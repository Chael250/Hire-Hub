import { Request , Response , NextFunction } from "express"

export default function(handler:Function){
    return async (req:Request,res:Response,next:NextFunction) => {
        try{
            handler(req,res)
        }
        catch(ex){
            next(ex)
        }
    }
}