import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  getUsers,
  getUserById,
  updateUserRole,
  updateUserStatus,
  getRolePermissions,
  getAllRoles,
  checkPermissions,
  getAuditLogs
} from "./routes/rbac";

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

  // RBAC API routes
  app.get("/api/admin/users", ...getUsers);
  app.get("/api/admin/users/:id", ...getUserById);
  app.put("/api/admin/users/:id/role", ...updateUserRole);
  app.put("/api/admin/users/:id/status", ...updateUserStatus);
  app.get("/api/admin/roles", ...getAllRoles);
  app.get("/api/admin/roles/:role/permissions", ...getRolePermissions);
  app.get("/api/permissions/check", ...checkPermissions);
  app.get("/api/admin/audit-logs", ...getAuditLogs);

  return app;
}
