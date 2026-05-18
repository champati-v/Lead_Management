import { Document, Model, Schema, Types, model } from "mongoose";

export type LeadStatus = "new" | "contacted" | "qualified" | "lost";
export type LeadSource = "website" | "instagram" | "referral";

export interface ILead extends Document {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const leadSchema = new Schema<ILead>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    status: {
      type: String,
      enum: ["new", "contacted", "qualified", "lost"],
      default: "new",
    },
    source: {
      type: String,
      enum: ["website", "instagram", "referral"],
      default: "website",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Lead: Model<ILead> = model<ILead>("Lead", leadSchema);

export default Lead;
