import { Schema, model } from 'mongoose'

const TransactionSchema = new Schema<Transaction>(
  {
    userId: { type: String, required: true },
    symbol: { type: String, required: true },
    price: { type: Number, required: true },
    type: { type: String, enum: ['purchase', 'sale'], required: true },
    quantity: { type: Number, required: true },
    sold: { type: Boolean },
  },
  { timestamps: true }
)

const Transaction = model<Transaction>('Transaction', TransactionSchema)

export default Transaction
