import mongoose from 'mongoose';

declare global {
  // eslint-disable-next-line no-var
  var mongoose: { conn: typeof import('mongoose') | null; promise: Promise<typeof import('mongoose')> | null } | undefined;
}

const MONGO_URI = process.env.MONGO_URI!;

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached!.conn) return cached!.conn;

  if (!cached!.promise) {
    cached!.promise = mongoose.connect(MONGO_URI).then((m) => m);
  }

  cached!.conn = await cached!.promise;
  return cached!.conn;
}
