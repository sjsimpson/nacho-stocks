import { Schema, model } from 'mongoose'

const PositionSchema = new Schema<Position>({
  userId: { type: String, required: true },
  symbol: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
})

const Position = model<Position>('Position', PositionSchema)

export default Position
