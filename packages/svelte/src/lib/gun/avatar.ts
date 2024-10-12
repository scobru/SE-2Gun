import { derived, writable, get } from "svelte/store";
import { useGun } from "./gun";
import { useUser } from "./user";
import SEA from 'gun/sea';

export function useAvatar(pub: string, size: number) {
  const gun = useGun();
  const { user } = useUser();
  const avatar = writable("");
  const blink = writable(false);
  const uploadStatus = writable("");

  const updateAvatar = () => {
    console.log('Updating avatar for pub:', pub);
    gun.user(pub).get('avatar').once((data) => {
      console.log('Avatar data:', data);
      if (data) {
        if (typeof data === 'string' && data.startsWith('#')) {
          // L'avatar è salvato come riferimento
          gun.get('#').get(data.slice(1)).once((media) => {
            console.log('Retrieved media:', media);
            if (media) {
              try {
                const mediaObj = JSON.parse(media);
                avatar.set(`data:${mediaObj.type};base64,${mediaObj.b64}`);
              } catch (error) {
                console.error('Error parsing media:', error);
                avatar.set(`https://avatars.dicebear.com/api/identicon/${pub}.svg?size=${size}`);
              }
            } else {
              avatar.set(`https://avatars.dicebear.com/api/identicon/${pub}.svg?size=${size}`);
            }
          });
        } else if (typeof data === 'string' && data.startsWith('data:')) {
          // L'avatar è già in formato base64
          avatar.set(data);
        } else {
          avatar.set(`https://avatars.dicebear.com/api/identicon/${pub}.svg?size=${size}`);
        }
      } else {
        avatar.set(`https://avatars.dicebear.com/api/identicon/${pub}.svg?size=${size}`);
      }
    });
  };

  updateAvatar();

  gun.user(pub).get("pulse").on(() => {
    blink.update(b => !b);
  });

  const uploadAvatar = async (file: File) => {
    console.log('Starting avatar upload');
    uploadStatus.set('Iniziando il caricamento...');
    
    const currentUser = get(user);
    if (!currentUser || !currentUser.is || currentUser.pub !== pub) {
      console.error('Utente non autenticato o non autorizzato');
      uploadStatus.set('Errore: Utente non autenticato o non autorizzato');
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result as string;
        const mediaType = file.type;
        const media = JSON.stringify({ b64: base64.split(',')[1], type: mediaType });
        
        console.log('Media prepared:', media.substring(0, 50) + '...');
        uploadStatus.set('Generando hash...');
        
        const mediaID = await SEA.work(media, null, null, { name: "SHA-256" });
        console.log('Generated mediaID:', mediaID);
        
        uploadStatus.set('Salvando media...');
        await new Promise<void>((resolve, reject) => {
          gun.get('#').get(mediaID).put(media, (ack) => {
            if (ack.err) {
              console.error('Errore nel salvare il media:', ack.err);
              reject(ack.err);
            } else {
              console.log('Media salvato con successo');
              resolve();
            }
          });
        });
        
        // Salva il riferimento all'avatar nello spazio utente
        await new Promise<void>((resolve, reject) => {
          gun.user().get('avatar').put('#' + mediaID, (ack) => {
            if (ack.err) {
              console.error('Errore nel salvare il riferimento avatar:', ack.err);
              reject(ack.err);
            } else {
              console.log('Riferimento avatar salvato con successo');
              resolve();
            }
          });
        });
        
        console.log('Avatar upload completed');
        uploadStatus.set('Caricamento completato!');
        updateAvatar();
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Errore durante il caricamento dell'avatar:", error);
      uploadStatus.set('Errore durante il caricamento. Riprova.');
    }
  };

  return {
    avatar: derived(avatar, $a => $a),
    blink: derived(blink, $b => $b),
    uploadAvatar,
    uploadStatus: derived(uploadStatus, $s => $s)
  };
}
