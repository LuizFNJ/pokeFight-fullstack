import mongoose, { Schema } from "mongoose";

interface UserDocument {
  email: string;
  password: string;
}

const userSchema = new Schema<UserDocument>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model<UserDocument>("User", userSchema);

export default User;
