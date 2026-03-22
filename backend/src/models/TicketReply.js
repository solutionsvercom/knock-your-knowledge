import mongoose from "mongoose";

const TicketReplySchema = new mongoose.Schema(
  {
    ticket_id: { type: mongoose.Schema.Types.ObjectId, ref: "SupportTicket", required: true, index: true },
    message: { type: String, required: true },
    author_email: { type: String, default: "" },
    author_role: { type: String, default: "student" },
    sender_name: { type: String, default: "" },
  },
  { timestamps: true }
);

TicketReplySchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = String(ret._id);
    ret.ticket_id = String(ret.ticket_id);
    ret.created_date = ret.createdAt;
    ret.updated_date = ret.updatedAt;
    ret.sender_name = ret.sender_name || ret.author_email || "";
    ret.sender_role = ret.author_role === "student" ? "student" : "support";
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const TicketReply = mongoose.model("TicketReply", TicketReplySchema);

