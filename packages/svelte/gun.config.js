//export const peers = ["https://gun-relay.scobrudot.dev/gun"];
import env from "dotenv";

env.config();

export const peers = ["https://peer.wallie.io/gun"];
export const validToken = process.env.VALID_TOKEN;
