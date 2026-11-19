import app from "./app.js";
import connectDB from "./config/db.js";
import env from "./config/env.js";

const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || env.PORT || 5000;

    app.listen(PORT, "0.0.0.0", () => {
      console.log("-----------------------------------");
      console.log("MEO PERMIT ARCHIVE API");
      console.log("-----------------------------------");
      console.log(`Port: ${PORT}`);
      console.log(`Health: /health`);
      console.log(`Mode: ${env.NODE_ENV}`);
      console.log("-----------------------------------");
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

startServer();
