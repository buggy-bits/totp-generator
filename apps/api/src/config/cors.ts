import cors from "cors";
import { FRONTEND_URL } from "./env";

const corsOptions: cors.CorsOptions = {
  origin: [FRONTEND_URL || "http://localhost:3000"], // Add your frontend URLs here
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true, // Allow cookies if needed
};

export default cors(corsOptions);
