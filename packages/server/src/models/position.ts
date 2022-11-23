import { Schema, model } from 'mongoose'

export interface IPosition {
  userId: string
  symbol: string
  price: number
  amount: number
}

const PositionSchema = new Schema<IPosition>({
  userId: { type: String, required: true },
  symbol: { type: String, required: true },
  price: { type: Number, required: true },
  amount: { type: Number, required: true },
})

export const Position = model<IPosition>('Position', PositionSchema)
