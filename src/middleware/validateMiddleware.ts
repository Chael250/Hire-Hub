import { ValidationResult } from "joi"
import { Request , Response , NextFunction } from "express"

type ValidationFunction = (data:any) => ValidationResult<any>

function valid(validator:ValidationFunction){
    return (req:Request,res:Response, next:NextFunction) => {
        const {error} = validator(req.body)
        if(error) return res.status(400).send(error.details[0].message)
        next()
    }
} 

export { valid , ValidationFunction }