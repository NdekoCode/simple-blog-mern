// TODO: #1 CREATE post
// TODO: #2 DELETE post
// TODO: #8 GET posts
// TODO: #7 GET SINGLE posts
// TODO: #4 UPDATE post
import app from "./app.js";
import connectDD from "./configs/dbConfig.js";
import { httpServerConfig } from "./configs/httpConfig.js";
httpServerConfig(app);
connectDD();
