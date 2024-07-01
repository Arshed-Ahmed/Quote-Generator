import mongoose, { Document, Schema } from 'mongoose';

export interface IQuote extends Document {
  text: string;
  author: string;
}

const quote: Schema = new Schema({
  text: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
});

export default mongoose.model<IQuote>('Quote', quote);