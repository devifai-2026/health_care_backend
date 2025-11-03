import dotenv from "dotenv";
import app from "./app.js";
import connectDB from './db/index.js';

// ✅ Correct environment path
dotenv.config({
  path: "./.env",
});

// Connect to MongoDB and start the server
connectDB()
  .then(() => {
    const PORT = process.env.PORT || 8000;

    // ✅ Add '0.0.0.0' for Render
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📍 Local: http://localhost:${PORT}`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  })
  .catch((err) => {
    console.error("❌ MONGO DB CONNECTION FAILED !!!", err);
  });