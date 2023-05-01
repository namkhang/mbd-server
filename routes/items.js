var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken')
var multer = require('multer')

// var upload = multer({ dest: "./public/upload" });

var upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, callback) => {
      // filFilter nó sẽ kiểm soát việc file nào nên tải lên và file nào không
      if (!file.mimetype.match(/jpe|jpeg|png|gif$i/)) {
        // Nếu không đúng loại file ảnh thì sẽ không cho upload file và ngược lại
        callback(new Error("File is not supported"), false);
        return;
      }
  
      callback(null, true);
    },
    limits: {
      fileSize: 1024 * 1024 * 5,
    },
  });

const {Items , Accounts} = require("../databases/mongoschema.js");
const { authenticate } = require('../middleware/authenticate.js');

/* GET home page. */
router.get('/find-all-item', async function(req, res){
        let data = await Items.find()
    res.status(200).json({
        success : true , 
        data
    })
});

router.post('/login' , async (req,res) => {
    let {username , password} = req.body
    let checkData = await Accounts.findOne({username})
    if(checkData){
        if(password === checkData.password){
            let token  = jwt.sign({adminID : checkData._id } , 'khangprodangcap')
            res.status(200).json({
                success : true ,
                adminID : checkData._id , 
                token
            }) 
        }
        else{
            res.status(200).json({
                success : false , 
                message : 'Password Invalid'
            })
        }
    }
    else{
        res.status(200).json({
            success : false , 
            message : 'Username Invalid'
        })
    }
})


router.get('/find-item-by-name', async function(req, res){
    let {name} = req.query
    let data = await Items.find({item_name : {$regex : `.*${name}.*` , $options: 'i'}})
    res.status(200).json({
        success : true , 
        data
    })
});

router.get('/get-one-item/:id', async function(req, res) {
    let {id} = req.params
    let data = await Items.findOne({_id : id})
    res.status(200).json({
        success : true , 
        data
    })
});


router.get('/get-item-by-subcatagory', async function(req, res) {
    let {subcatagory} = req.query
    let data = await Items.find({sub_catagory : subcatagory})  
    res.status(200).json({
        success : true , 
        data
    })
});


router.post("/create-item" , authenticate , upload.array("file") , async (req , res) => {
    let dateTime = new Date()
       let {item_name , item_quantity , item_price , category , sub_catagory , status} = req.body
       let createAt = `${dateTime.getDate()}/${dateTime.getMonth() + 1}/${dateTime.getFullYear()} ${dateTime.getHours()}:${dateTime.getMinutes()}:${dateTime.getSeconds()}`
       let listImage = req.files.map(i => ({image : `data:image/jpg;base64,${i.buffer.toString("base64")}`}))
       await Items.create({item_name , item_quantity , item_price , category , sub_catagory , status , createAt , listImage})
       res.status(200).json({
        success : true ,
       })

})


router.put("/edit-item/:id" , authenticate , upload.array("file") , async (req , res) => {
    let {id} = req.params
       let {item_name , item_quantity , item_price , category , sub_catagory , status} = req.body
       let listImage = req.files.map(i => ({image : `data:image/jpg;base64,${i.buffer.toString("base64")}`}))
       await Items.updateOne({_id : id}, {item_name , item_quantity , item_price , category , sub_catagory , status , listImage})
       res.status(200).json({
        success : true ,
       })

})



router.get('/get-item-by-catagory', async function(req, res) {
    let {catagory} = req.query

    let data = await Items.find({category : catagory})  
    res.status(200).json({
        success : true , 
        data
    })
});

router.delete('/remove-item/:id' , authenticate , async (req,res) => {
        await Items.deleteOne({_id : req.params.id})
        res.status(200).json({
            success : true
        })
})

module.exports = router;
