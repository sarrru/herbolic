import mongoose from "mongoose";

const auditSchema = new mongoose.Schema({
  action: String,         // LOGIN, REGISTER, PASSWORD_RESET
  email: String,
  ip: String,
  userAgent: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const AuditModel = mongoose.model("audit", auditSchema);
export default AuditModel;
