import AuditModel from "../models/audit.model.js";

const logAudit = async (action, request) => {
  try {
    await AuditModel.create({
      action,
      email: request.body?.email || "unknown",
      ip: request.ip || request.headers['x-forwarded-for'] || "unknown",
      userAgent: request.headers['user-agent'] || "unknown"
    });
  } catch (err) {
    console.error("Audit logging failed:", err.message);
  }
};

export default logAudit;
