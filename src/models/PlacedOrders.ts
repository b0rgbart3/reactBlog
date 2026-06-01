import mongoose, { Schema } from 'mongoose';

const OrderItemSchema = new Schema({
  productID: String,
  productName: String,
  quantity: Number,
  chosenSize: String,
  unitAmount: Number,
}, { _id: false });

const ShippingAddressSchema = new Schema({
  name: String,
  line1: String,
  line2: String,
  city: String,
  state: String,
  postalCode: String,
  country: String,
}, { _id: false });

const PlacedOrderSchema = new Schema({
  stripeSessionId: { type: String, required: true, unique: true },
  status: { type: String, enum: ['pending', 'paid'], default: 'pending' },
  customerEmail: String,
  customerName: String,
  amountTotal: Number,
  items: [OrderItemSchema],
  shippingAddress: ShippingAddressSchema,
  sentToPrinter: { type: Boolean, default: false },
}, { timestamps: true });

export const PlacedOrders =
  mongoose.models.PlacedOrders || mongoose.model('PlacedOrders', PlacedOrderSchema);
