import { Schema, model } from 'mongoose'

const UserSchema = new Schema<User>({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  cashAssets: Number,
})

const User = model<User>('User', UserSchema)

export default User
