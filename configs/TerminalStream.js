import { createWriteStream } from "fs";
import { join } from "path";
import Writable from "stream";
import { consoleError, __dirname } from "../utils/utils.js";
export default class TerminalStream extends Writable {
  write(line) {
    consoleError(line);
  }

  fileWrite() {
    return createWriteStream(join(__dirname, "access.log"), { flags: "a" });
  }
  skipSuccess(_, res) {
    return res.statusCode < 400;
  }
  skipError(_, res) {
    return res.statusCode >= 400;
  }
}
