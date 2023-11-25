import mongoose, { Schema } from 'mongoose';

const { ObjectId } = mongoose.Types;

const schema = new Schema({
  username: {
    type: String,
    trim: true,
    required: true,
    unique: true,
    lowercase: true,
  },
  name: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
    trim: true,
    maxLength: 256,
  },
  address: {
    type: String,
    default: "",
  },
  company: {
    type: String,
    default: "",
  },
  phone: {
    type: String,
    default: "",
  },
  photo: {},
  role: {
    type: [String],
    default: ["Buyer"],
    enum: ["Buyer", "Seller", "Admin"],
  },
  enquiredProperties: [{ type: ObjectId, ref: "Ad" }],
  wishlist: [{ type: ObjectId, ref: "Ad" }],
  resetcode: {
    type: String,
    default: "",
  },
  
},
{ timestamps: true }
);

export default mongoose.model("newUser", schema);
