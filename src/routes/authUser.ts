import { Router , Request , Response} from "express"
import asyncMiddleware from "../middleware/asyncMiddleware"
import Joi, { ValidationResult } from "joi"
import { IUser, User } from "../models/userModel"
import { valid } from "../middleware/validateMiddleware"
import bcrypt from "bcrypt"

const route = Router()

route.post("/", valid(validateUser),asyncMiddleware(async(req:Request,res:Response) => {
    const user = await User.findOne({
        email:req.body.email
    })
    if(!user) return res.status(400).send("Invalid email or password")
    const isValid = await bcrypt.compare(req.body.password,user.password)
    if(!isValid) return res.status(400).send("Invalid email or password")

    const token = user.generateAuthToken()
    res.send(token)
}))

function validateUser(user:IUser):ValidationResult{
    const schema = Joi.object({
        email: Joi.string().pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).required(),
        password: Joi.string().min(5).max(50).required()
    })
    return schema.validate(user)
}

export default route
