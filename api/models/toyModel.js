const mongoose = require("mongoose");
const Joi = require("joi");

const toySchema = new mongoose.Schema({

  name: String,
  info: String,
  category: String,
  img_url: String,
  price: Number,
  date_created: {
    type: Date, default: Date.now()
  },
  
  user_id:{
    type:mongoose.Schema.ObjectId,
    ref:"users"
  }
})

exports.ToyModel = mongoose.model("toys", toySchema);

exports.validateToys = (_reqBody) => {
  let schemaJoi = Joi.object({
    name: Joi.string().min(2).max(99).required(),
    info: Joi.string().min(2).max(99).required(),
    category: Joi.string().min(2).max(99).required(),
    img_url:  Joi.string().min(2).max(99).allow(null, ""),
    price: Joi.number().min(1).max(3000000000).required(),
 
  })
  return schemaJoi.validate(_reqBody)
}
