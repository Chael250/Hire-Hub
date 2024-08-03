import { Router ,Request , Response} from "express"
import asyncMiddleware from "../middleware/asyncMiddleware"
import Joi, { ValidationResult } from "joi"
import { valid } from "../middleware/validateMiddleware"
import { Company, ICompany } from "../models/companyModel"
import bcrypt from "bcrypt"
import { logger } from "../startup/logging"

const route = Router()

route.post("/", valid(validateCompany),asyncMiddleware(async(req:Request,res:Response) => {
    const company = await Company.findOne({
        email:req.body.email
    })
    if(!company) return res.status(400).send("Invalid email or password")

    const isValid = await bcrypt.compare(req.body.password,company.password)
    if(!isValid) return res.status(400).send("Invalid email or password")

    const token = company.generateAuthToken()
    res.send(token)
}))

function validateCompany(company:ICompany):ValidationResult{
    const schema = Joi.object({
        name: Joi.string().required(),
        password: Joi.string().min(5).max(50).required()
    })
    return schema.validate(company)
}

export default route
