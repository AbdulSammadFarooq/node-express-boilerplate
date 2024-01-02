import { Schema } from 'mongoose';
const companySchema = new Schema(
  {
    companyName: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  },
);

export default companySchema;
