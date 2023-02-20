import dotenv from "dotenv";
import app from "./app.js";
dotenv.config();
const PORT = process.env.PORT || 3500;
app.listen(PORT, () => {
  console.info("Server is running at http://localhost:" + PORT);
});
