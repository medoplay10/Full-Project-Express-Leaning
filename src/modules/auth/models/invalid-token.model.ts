import mongoose, { Schema } from "mongoose";

const InvalidTokenSchema = new Schema(
    {
      token: {
        required: true,
        type: String,
      },
      user: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      expiredAt: {
        required: true,
        type: Date,
      },
     
    },
    {
      timestamps: true,
    }
  );
  export const InvalidTokenModel = mongoose.model("InvalidToken", InvalidTokenSchema);
  