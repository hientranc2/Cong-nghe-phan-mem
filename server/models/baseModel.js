import mongoose from "mongoose";

export const createSchema = (definition = {}) => {
  const schema = new mongoose.Schema(
    {
      _id: {
        type: String,
        required: true,
      },
      ...definition,
    },
    {
      strict: false,
      versionKey: false,
    },
  );

  schema.set("toJSON", {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      return ret;
    },
  });

  return schema;
};
