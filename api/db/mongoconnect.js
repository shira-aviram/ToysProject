const mongoose = require('mongoose');
 const {config} = require("../config/secret")

main().catch(err => console.log(err));

async function main() {
    mongoose.set('strictQuery' , false);

  await mongoose.connect(`mongodb+srv://${config.userDb}:${config.passDb}@shiradatabase.yp8hf0s.mongodb.net/toys`);
  // await mongoose.connect(`mongodb://localhost:27017/teat24`);
  console.log("mongo connect shira date base toys")

}