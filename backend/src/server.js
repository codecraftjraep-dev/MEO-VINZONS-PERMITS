import app from "./app.js";
import connectDB from "./config/db.js";
import env from "./config/env.js";

const startServer = async () => {
  try {
    await connectDB();

    app.listen(env.PORT, "0.0.0.0", () => {
      console.log("-----------------------------------");
      console.log("MEO PERMIT ARCHIVE API");
      console.log("-----------------------------------");
      console.log(`Server: http://localhost:${env.PORT}`);
      console.log(`Health: http://localhost:${env.PORT}/health`);
      console.log(`Mode: ${env.NODE_ENV}`);
      console.log("-----------------------------------");
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
