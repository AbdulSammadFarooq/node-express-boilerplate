import { Schema } from 'mongoose';
import { email } from '../regexes.js';
const userSchema = new Schema(
  {
    email: {
      type: String,
      validate: email,
      lowercase: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    salt: String,
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
    },
    sessionStarted: {
      type: Date,
      default: new Date(),
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    superAdmin: {
      type: Boolean,
      default: false,
    },
    companyAdmin: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    companyUser: {
      type: Boolean,
      default: false,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    jwtToken: {
      type: String,
    },
    verifyEmailToken: {
      type: String,
    },
    forgotPasswordKey: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export default userSchema;
