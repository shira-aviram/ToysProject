
const express= require("express");
const {auth, authAdmin} = require("../middlewares/auth");
const {ToyModel ,validateToys} = require("../models/toyModel")
const router = express.Router();

router.get("/" , async(req,res)=> {
  
  let perPage = Math.min(req.query.perPage,20) || 10;//הגבלת דפים
  let page = req.query.page || 1;
  let sort = req.query.sort || "_id";
  let reverse = req.query.reverse == "yes" ? -1 : 1;
  try{
    let data = await ToyModel
    .find({})
    .limit(perPage)
    .skip((page - 1)*perPage)
    .sort({[sort]:reverse})
    res.json(data);
  } 
  catch(err){
    console.log(err)
    res.status(500).json({msg:"err",err})
  }
})
router.get("/search", async(req,res)=>{
  try{
    let queryS = req.query.s;
    let searchReg = new RegExp(queryS,"i")
    let data = await ToyModel.find({name:searchReg})
    .limit(50)//הגבלב ל50 משחקים
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(500).json({msg:"there error try again later",err})
  }   
})

router.get("/category/:catName", async(req,res)=>{
  try{
    let paramC = req.params.catName;
    let data = await ToyModel.find({category:paramC})
    .limit(50)
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(500).json({msg:"there error try again later",err})
  }    
})
router.get("/prices", async (req, res) => {
  let perPage = req.query.perPage || 10;
  let page = req.query.page || 1;
  let sort = req.query.sort || "price"
  let reverse = req.query.reverse == "yes" ? -1 : 1;
  try {
      let minP = req.query.min;
      let maxP = req.query.max;
      if (minP && maxP) {
          let data = await ToyModel.find({ $and: [{ price: { $gte: minP } }, { price: { $lte: maxP } }] })

              .limit(perPage)
              .skip((page - 1) * perPage)
              .sort({ [sort]: reverse })
          res.json(data);
      }
      else if (maxP) {
          let data = await ToyModel.find({ price: { $lte: maxP } })
              .limit(perPage)
              .skip((page - 1) * perPage)
              .sort({ [sort]: reverse })
          res.json(data);
      } else if (minP) {
          let data = await ToyModel.find({ price: { $gte: minP } })
              .limit(perPage)
              .skip((page - 1) * perPage)
              .sort({ [sort]: reverse })
          res.json(data);
      } else {
          let data = await ToyModel.find({})
              .limit(perPage)
              .skip((page - 1) * perPage)
              .sort({ [sort]: reverse })
          res.json(data);
      }
  }
  catch (err) {
      console.log(err);
      res.status(500).json({ msg: "there error try again later", err })
  }
})

router.post("/", auth,async(req,res) => {
  let validBody = validateToys(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  }
  try{
    let toy = new ToyModel(req.body);
    toy.user_id=req.tokenData._id;
    await toy.save();

    res.status(201).json(toy);
  }
  catch(err){
   
    console.log(err);
    res.status(500).json({msg:"err",err})
  }
})

router.put("/:editId", auth, async(req,res) => {
  let valdiateBody = validateToys(req.body);
  if(valdiateBody.error){
    return res.status(400).json(valdiateBody.error.details)
  }
  try{
    let idEdit = req.params.editId
    let data = await ToyModel.updateOne({_id:idEdit,user_id:req.tokenData._id},req.body)
    res.json(data);
  }
  catch(err){
    console.log(err)
    res.status(500).json({msg:"err",err})
  }
})

router.delete("/:delId",auth, async(req,res) => {
  try{
    let idDel = req.params.delId
    let data = await ToyModel.deleteOne({_id:idDel,user_id:req.tokenData._id})
    res.json(data);
  }
  catch(err){
    console.log(err)
    res.status(500).json({msg:"err",err})
  }
})
router.get("/single/:id", async(req,res) => {
  try{
    let paramS = req.params.id;
    let data = await ToyModel.find({_id:paramS})
    .limit(50)
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(500).json({msg:"there error try again later",err})
  }    
})


module.exports = router;