import mongoose from "mongoose";
import { Role } from "../../constants/enums/role.enum";
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: {
      required: true,
      type: String,
    },
    email: {
      required: true,
      type: String,
    },
    password: {
      required: true,
      type: String,
    },
    role: {
      required: true,
      type: String,
      enum: Role,
      default: Role.Member,
    },
  },
  {
    timestamps: true,
  }
);
export const UserModel = mongoose.model("User", UserSchema);
