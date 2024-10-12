import { writable, derived, get } from "svelte/store";
import ms from "ms";
import { useGun } from "./gun";
import { useUser } from "./user";
import SEA from "gun/sea";
import { useColor } from "./colors";

const TIMEOUT = 10000;
const colorDeep = useColor("deep");

interface Profile {
  name?: string;
  first_name?: string;
  last_name?: string;
  birth_day?: string;
}

interface Account {
  pub?: string;
  color?: string;
  pulse?: number;
  blink?: boolean;
  profile?: Profile;
  petname?: string;
  db?: any;
  lastSeen?: string | number;
}

export function useAccount(pubKey: string) {
  console.log("useAccount called with:", pubKey);
  const gun = useGun();
  const { user } = useUser();
  console.log("user store:", user);
  const pub = writable(pubKey);

  const accountStore = writable<Account>({
    pub: pubKey,
    color: colorDeep.hex(pubKey),
    profile: { name: "" },
    pulse: 0,
    blink: false,
    db: gun.user(pubKey),
    lastSeen: "offline",
  });

  const pulseStore = writable(0);

  const calculateLastSeen = (pulse: number) => {
    if (!pulse) return "offline";
    const timeDiff = Date.now() - pulse;
    if (timeDiff <= TIMEOUT) return "online";
    return ms(timeDiff);
  };


  
  // Aggiorna lastSeen ogni secondo
  const lastSeenInterval = setInterval(() => {
    accountStore.update(acc => ({
      ...acc,
      lastSeen: calculateLastSeen(get(pulseStore)),
    }));
  }, 1000);

  const account = derived([pub, user, accountStore, pulseStore], ([$pub, $user, $account, $pulse]) => {
    if (!$pub || !$user) return $account;

    gun
      .user($pub)
      .get("pulse")
      .on(d => {
        pulseStore.set(d);
        accountStore.update(acc => ({ ...acc, blink: !acc.blink, pulse: d }));
      });

    if ($user.is) {
      gun
        .user()
        .get("petnames")
        .get($pub)
        .on(async d => {
          const decrypted = await $user.decrypt(d);
          accountStore.update(acc => ({ ...acc, petname: decrypted }));
        });
    }

    gun
      .user($pub)
      .get("profile")
      .map()
      .on((data, key) => {
        accountStore.update(acc => ({
          ...acc,
          profile: { ...acc.profile, [key]: data },
        }));
      });

    return $account;
  });

  return {
    account,
    setPetname,
    destroy: () => clearInterval(lastSeenInterval), // Funzione per pulire l'intervallo
  };
}

export async function setPetname(pub: string, name: string): Promise<void> {
  const { user } = useUser();
  if (!get(user).is) return;
  const gun = useGun();
  const enc = await get(user).encrypt(name);
  gun.user().get("petnames").get(pub).put(enc);
}

export function useAvatar(pub: string, size: number) {
  const gun = useGun();
  const { user } = useUser();
  const avatar = writable("");
  const blink = writable(false);
  const uploadStatus = writable("");

  const updateAvatar = () => {
    console.log("Updating avatar for pub:", pub);
    gun
      .user(pub)
      .get("avatar")
      .once(data => {
        console.log("Avatar data:", data);
        if (data) {
          avatar.set(data);
        } else {
          avatar.set(`https://avatars.dicebear.com/api/identicon/${pub}.svg?size=${size}`);
        }
      });
  };

  updateAvatar();

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
        uploadStatus.set("Salvando avatar...");

        gun
          .user()
          .get("avatar")
          .put(base64, ack => {
            if (ack.err) {
              console.error("Errore nel salvare l'avatar:", ack.err);
              uploadStatus.set("Errore nel salvare l'avatar");
            } else {
              console.log("Avatar salvato con successo");
              uploadStatus.set("Avatar caricato con successo");
              updateAvatar();
            }
          });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Errore durante il caricamento dell'avatar:", error);
      uploadStatus.set("Errore durante il caricamento. Riprova.");
    }
  };

  return {
    avatar: derived(avatar, $a => $a),
    blink: derived(blink, $b => $b),
    uploadAvatar,
    uploadStatus: derived(uploadStatus, $s => $s),
  };
}
