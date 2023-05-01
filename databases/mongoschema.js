const mongoose = require("mongoose")
const Schema = mongoose.Schema

 const Items = new Schema({
    item_name : String , 
    item_quantity : Number , 
    item_price : String ,
    category : String ,
    sub_catagory : String ,
    status : String , 
    createAt : String , 
    listImage : Array
 })

 
 const Accounts = new Schema({
   username : String , 
   password : String
})



 module.exports.Items = mongoose.model("items" , Items)
 
 module.exports.Accounts = mongoose.model("accounts" , Accounts)