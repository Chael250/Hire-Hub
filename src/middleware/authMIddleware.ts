import { Request , Response , NextFunction } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"
import config from "config"
import mongoose from "mongoose"

interface DecodedPayload{
    _id:mongoose.Types.ObjectId,
    iat:number
}

interface IRequest extends Request{
    company?: DecodedPayload
    user?: DecodedPayload
}

function authMIddleware(req:IRequest,res:Response,next:NextFunction){
    const token = req.header("x-auth-token")
    if(!token) return res.status(401).send("Unauthorised")

   try{
        const decodedPayloadUser = jwt.verify(token, config.get("jwtPrivateKeyUser")) as DecodedPayload
        req.user = decodedPayloadUser
    }
   catch(userError){
        try{
            const decodedPayloadCompany = jwt.verify(token, config.get("jwtPrivateKeyCompany")) as DecodedPayload
            req.company = decodedPayloadCompany
        }
        catch(ex){
            res.status(400).send("Invalid token")
        }
    }
    next()
}

export { authMIddleware , IRequest }