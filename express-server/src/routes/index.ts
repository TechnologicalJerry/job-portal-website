import express, { Request, Response } from "express";
import userRoutes from "./user.routes";
import authRoutes from "./auth.routes";

const router = express.Router();

// ✅ Explicitly define types for Request and Response
router.get("/health-check", (_: Request, res: Response) => {
    res.sendStatus(200);
    console.log("Health check passed");

});

// Use user routes under "/users"
router.use("/users", userRoutes);

// Use auth routes under "/auth"
router.use("/auth", authRoutes);

export default router;
