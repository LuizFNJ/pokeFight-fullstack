import app from "./app";
import connectDB from "./config/db";

const PORT = Number(process.env.PORT) || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
  });
});
