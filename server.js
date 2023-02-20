import app from "./app.js";
const PORT = process.env.PORT || 3500;
app.listen(PORT, () => {
  console.info("Server is running at http://localhost:" + PORT);
});
