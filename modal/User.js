// const mongoose = require("mongoose");
// const bcrypt  = require( "bcryptjs");
const mongoose =require( "mongoose");
const bcrypt =require( "bcryptjs");
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username:{
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone:{
      type:String,
    },
    sex:{
      type:String,
      default:'Nam'
    },
    money:{
      type:Number,
      default:0
    },
    sumMoney:{
      type:Number,
      default:0,
    },
    chiTieu:{
      type:Number,
      default:0,
    },
    hsD:{
      type:Number,
      default:0,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      // required: true,
      default: false,
    }
  },
  {
    timestamps: true,
  }
);

// Login
userSchema.methods.matchPassword = async function (enterPassword) {
  return await bcrypt.compare(enterPassword, this.password);
};

// Register
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

module.exports= User;
