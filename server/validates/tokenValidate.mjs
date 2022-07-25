import jwt from "jsonwebtoken"

const tokenValidate = {
  //verifyToken 
  verifyToken: (req,res,next) => {
    const token = req.headers.token
    if(token){
      const accessToken = token.split(" ")[1]
      jwt.verify(accessToken, "secretKey", (err,user)=>{
        if(err){
          res.status(403).json("Token isn't valid")
        }
        req.user = user
        next()
      })
    }
    else{
      res.status(401)
    }
  }
}

export default tokenValidate 