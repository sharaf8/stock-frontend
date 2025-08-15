import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // RBAC API routes - loaded dynamically to avoid import issues during config loading
  try {
    const rbacRoutes = require("./routes/rbac");
    app.get("/api/admin/users", ...rbacRoutes.getUsers);
    app.get("/api/admin/users/:id", ...rbacRoutes.getUserById);
    app.put("/api/admin/users/:id/role", ...rbacRoutes.updateUserRole);
    app.put("/api/admin/users/:id/status", ...rbacRoutes.updateUserStatus);
    app.get("/api/admin/roles", ...rbacRoutes.getAllRoles);
    app.get("/api/admin/roles/:role/permissions", ...rbacRoutes.getRolePermissions);
    app.get("/api/permissions/check", ...rbacRoutes.checkPermissions);
    app.get("/api/admin/audit-logs", ...rbacRoutes.getAuditLogs);
  } catch (error) {
    console.warn("RBAC routes not loaded:", error.message);
    // Provide fallback routes for development
    app.get("/api/admin/users", (_req, res) => res.json({ users: [] }));
    app.get("/api/admin/roles", (_req, res) => res.json({ roles: [] }));
  }

  return app;
}
