export const peers = ["https://gun-relay.scobrudot.dev/gun", "https://peer.wallie.io/gun","http://localhost:3000/gun"];

import env from "dotenv";

const { VALID_TOKEN } = env as {
  VALID_TOKEN?: string;
};

export const validToken = VALID_TOKEN;
