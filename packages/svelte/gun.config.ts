export const peers = ["https://gun-relay.scobrudot.dev/gun", "https://peer.wallie.io/gun"];

import env from "dotenv";

const { VALID_TOKEN } = env as {
  VALID_TOKEN?: string;
};

export const validToken = VALID_TOKEN;
