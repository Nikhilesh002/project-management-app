const jwt=require('jsonwebtoken');
require('dotenv').config()

function verifyToken(req,res,next){
  // get bearer token from headers of req
  const bearerToken=req.headers.authorization;
  if(!bearerToken){
    res.send({message:"Unauthorised access. Plz login to continue"});
  }
  // extract token from bearer token
  const token=bearerToken.split(' ')[1];
  try {
    jwt.verify(token,process.env.SECRET_KEY);
    next();
  }
  catch (error) {
      next(error);
  }

}

module.exports=verifyToken;