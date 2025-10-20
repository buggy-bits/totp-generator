import cors from 'cors';
import { ALLOWED_ORIGINS } from './env';

const allowedOrigins = ALLOWED_ORIGINS
  ? ALLOWED_ORIGINS.split(',').map((origin) => origin.trim())
  : [];

const corsOptions: cors.CorsOptions = {
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};

export default cors(corsOptions);
