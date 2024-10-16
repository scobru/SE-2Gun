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
  const pulseStore = writable(0);

  const accountStore = writable<Account>({
    pub: pubKey,
    color: colorDeep.hex(pubKey),
    profile: { name: "" },
    pulse: 0,
    blink: false,
    db: gun.user(pubKey),
    lastSeen: derived(pulseStore, $pulse => calculateLastSeen($pulse) as string | number),
  });

  const calculateLastSeen = (pulse: number): string => {
    if (!pulse) return "offline";
    const timeDiff = Date.now() - pulse;
    if (timeDiff <= TIMEOUT) return "online";
    return ms(timeDiff);
  };

  gun.user(pubKey).get("pulse").put(Date.now().toFixed());

  const account = derived([pub, user, accountStore, pulseStore], ([$pub, $user, $account, $pulse]) => {
    if (!$pub || !$user) return $account;

    gun
      .user($pub)
      .get("pulse")
      .on(d => {
        pulseStore.update(p => d);
      });

    gun
      .user($pub)
      .get("pulse")
      .on((d: number) => {
        accountStore.update(acc => ({
          ...acc,
          blink: !acc.blink,
          pulse: d,
        }));
      })
      .back()
      .get("profile")
      .map()
      .on((data: any, key: string) => {
        accountStore.update(acc => ({
          ...acc,
          profile: {
            ...acc.profile,
            [key]: data,
          },
        }));
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
