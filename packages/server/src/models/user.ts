import { Schema, model } from "mongoose";

export interface IUser {
  username: string;
  password: string;
  email: string;
  cashAssets?: number;
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  cashAssets: Number,
});

export const User = model<IUser>("User", UserSchema);
