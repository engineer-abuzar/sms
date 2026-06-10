import mongoose, { Document, Schema } from "mongoose";

export interface IStudent extends Document {
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  courseEnrolled: string;
  password: string;
}

const studentSchema = new Schema<IStudent>(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    dateOfBirth: { type: String, required: true },
    gender: { type: String, required: true },
    address: { type: String, required: true },
    courseEnrolled: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

export const Student = mongoose.model<IStudent>("Student", studentSchema);
