var jwt = require('jsonwebtoken')

module.exports.authenticate = (req , res , next) => {
        if(!req.headers.authorization){
            res.status(200).json({
                success: false ,
                message : 'Token not found'
            })
        }
        else{
            try {
                let token = req.headers.authorization.split(" ")[1]
                let {adminID} = jwt.verify(token , 'khangprodangcap')
                res.location.adminID = adminID
                next()

            }
            catch (err){
                res.status(200).json({
                    success: false ,
                    message : 'Invalid token'
                })
            }

        }


}