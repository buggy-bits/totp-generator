import mongoose, { Document, Schema } from "mongoose";

interface SecretType extends Document {
  id: string;
  secretCode: string;
  issuer?: string;
  createdAt: Date;
  updatedAt: Date;
}

const secretSchema = new Schema<SecretType>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    secretCode: {
      type: String,
      required: true,
    },
    issuer: { type: String },
  },
  { timestamps: true }
);

const SecretModel = mongoose.model("Secrets", secretSchema);
export default SecretModel;
