import mongoose, { Schema } from 'mongoose';

const AnalyticsEventSchema = new Schema(
  {
    event: {
      type: String,
      enum: ['product_view', 'add_to_cart', 'checkout_start', 'order_complete', 'article_view'],
      required: true,
      index: true,
    },
    productId:    { type: String, index: true },
    productName:  { type: String },
    articleId:    { type: String, index: true },
    articleTitle: { type: String },
    sessionId:    { type: String },
    amountTotal:  { type: Number },
  },
  { timestamps: true }
);

AnalyticsEventSchema.index({ event: 1, createdAt: -1 });
AnalyticsEventSchema.index({ productId: 1, event: 1 });

export const AnalyticsEvent =
  mongoose.models.AnalyticsEvent ||
  mongoose.model('AnalyticsEvent', AnalyticsEventSchema);
