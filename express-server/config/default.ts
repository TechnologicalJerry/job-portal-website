import dotenv from "dotenv";

dotenv.config();

export default {
  port: process.env.PORT || 9000,
  dbUri: process.env.DB_URI || "mongodb://localhost:27017/job-portal-website",
  logLevel: process.env.LOG_LEVEL || "info",
  accessTokenPrivateKey: process.env.ACCESS_TOKEN_PRIVATE_KEY || "",
  refreshTokenPrivateKey: process.env.REFRESH_TOKEN_PRIVATE_KEY || "",
  smtp: {
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 465,
    secure: process.env.SMTP_SECURE === "true",
  },
};
