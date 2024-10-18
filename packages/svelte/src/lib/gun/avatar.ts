import { derived, writable, get } from "svelte/store";
import { useGun } from "./gun";
import { useUser } from "./user";
import SEA from "gun/sea";
import { browser } from '$app/environment';

export function useAvatar(pub: string, size: number) {
  const gun = useGun();
  const { user } = useUser();
  const avatar = writable("");
  const blink = writable(false);
  const uploadStatus = writable("");

  const updateAvatar = () => {
    console.log("Updating avatar for pub:", pub);
    if (!pub) {
      console.log("No pub provided, setting default avatar");
      setDefaultAvatar();
      return;
    }
    gun
      .user(pub)
      .get("avatar")
      .once((data: string) => {
        console.log("Avatar data:", data);
        if (data) {
          if (typeof data === "string" && data.startsWith("#")) {
            // L'avatar è salvato come riferimento
            gun
              .get("#")
              .get(data.slice(1))
              .once((media: string) => {
                console.log("Retrieved media:", media);
                if (media) {
                  try {
                    const mediaObj = JSON.parse(media);
                    avatar.set(`data:${mediaObj.type};base64,${mediaObj.b64}`);
                  } catch (error) {
                    console.error("Error parsing media:", error);
                    setDefaultAvatar();
                  }
                } else {
                  setDefaultAvatar();
                }
              });
          } else if (typeof data === "string" && data.startsWith("data:")) {
            // L'avatar è già in formato base64
            avatar.set(data);
          } else {
            setDefaultAvatar();
          }
        } else {
          setDefaultAvatar();
        }
      });
  };


  const setDefaultAvatar = () => {
    const avatarUrl = gunAvatar({ pub, size });

      avatar.set(avatarUrl);
    
  };

  gun
    .user(pub)
    .get("pulse")
    .on(() => {
      blink.update(b => !b);
    });

  const uploadAvatar = async (file: File) => {
    console.log("Starting avatar upload");
    uploadStatus.set("Iniziando il caricamento...");

    const currentUser = get(user);
    if (!currentUser || !currentUser.is || currentUser.pub !== pub) {
      console.error("Utente non autenticato o non autorizzato");
      uploadStatus.set("Errore: Utente non autenticato o non autorizzato");
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = async e => {
        const base64 = e.target?.result as string;
        const mediaType = file.type;
        const media = JSON.stringify({ b64: base64.split(",")[1], type: mediaType });

        console.log("Media prepared:", media.substring(0, 50) + "...");
        uploadStatus.set("Generando hash...");

        const mediaID = await SEA.work(media, null, null, { name: "SHA-256" });
        console.log("Generated mediaID:", mediaID);

        uploadStatus.set("Salvando media...");
        await new Promise<void>((resolve, reject) => {
          gun
            .get("#")
            .get(mediaID)
            .put(media, (ack: { err: any; }) => {
              if (ack.err) {
                console.error("Errore nel salvare il media:", ack.err);
                reject(ack.err);
              } else {
                console.log("Media salvato con successo");
                resolve();
              }
            });
        });

        // Salva il riferimento all'avatar nello spazio utente
        await new Promise<void>((resolve, reject) => {
          gun
            .user(pub)
            .get("avatar")
            .put("#" + mediaID, (ack: { err: any; }) => {
              if (ack.err) {
                console.error("Errore nel salvare il riferimento avatar:", ack.err);
                reject(ack.err);
              } else {
                console.log("Riferimento avatar salvato con successo");
                resolve();
              }
            });
        });

        console.log("Avatar upload completed");
        uploadStatus.set("Caricamento completato!");
        updateAvatar();
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Errore durante il caricamento dell'avatar:", error);
      uploadStatus.set("Errore durante il caricamento. Riprova.");
    }

    // Dopo aver completato il caricamento, aggiorna immediatamente l'avatar
    updateAvatar();
  };

  // Chiama updateAvatar all'inizializzazione
  updateAvatar();

  return {
    avatar: derived(avatar, $a => {
      console.log("Avatar value:", $a);
      return $a;
    }),
    blink: derived(blink, $b => $b),
    uploadAvatar,
    uploadStatus: derived(uploadStatus, $s => $s),
    updateAvatar
  };
}
