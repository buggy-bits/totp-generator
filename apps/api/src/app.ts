import express from "express";
import healthRoute from "./routes/health.route";
import otpRoute from "./routes/otp.route";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import corsMiddleware from "./config/cors";
const app = express();
app.use(corsMiddleware);
app.use(express.json());
// Routes
app.use("/api", healthRoute);

app.use("/api", otpRoute);

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;
