import morgan from "morgan";
import { createServer } from "node:http";
import { consoleError } from "../utils/utils.js";
import TerminalStream from "./TerminalStream.js";
export function httpServerConfig(app) {
  const PORT = process.env.PORT || 3500;
  const NODE_ENV = process.env.NODE_ENV;
  const terminal = new TerminalStream();
  app.use(
    morgan("dev", {
      skip: terminal.skipSuccess,
    })
  );
  app.use(
    morgan("common", {
      stream: terminal.fileWrite(),
    })
  );
  app.use(
    morgan("combined", {
      skip: terminal.skipError,
      stream: terminal,
    })
  );
  app.set("port", normalisePort(PORT));
  const server = createServer(app);

  function handleError(error) {
    if (error.syscall === "listen") throw error;
    const address = server.address();
    const bind =
      typeof address === "string" ? "pipe " + address : "port " + PORT;
    switch (error.code) {
      case "EACCES":
        consoleError(bind + " requires elevated privileges");
        process.exit(1);
        break;
      case "ADDRINUSE":
        consoleError(bind + " is already in use");
        process.exit(1);
        break;
      default:
        throw error;
    }
  }
  function serverListening() {
    const address = server.address();
    const bind =
      typeof address === "string" ? "pipe " + address : "port " + PORT;
    consoleError(`Listening on ${bind} http://localhost:${PORT}`);
  }
  server.on("error", handleError);
  server.on("listening", serverListening);
  if (NODE_ENV === "production") {
    server.listen();
  } else {
    server.listen(PORT);
  }
}
export function normalisePort(port = process.env.PORT || 3500) {
  port = parseInt(port);
  if (isNaN(port)) {
    return 3500;
  }
  return port;
}
