import { Router , Request , Response} from "express"
import asyncMiddleware from "../middleware/asyncMiddleware"
import { valid } from "../middleware/validateMiddleware"
import { User,validate } from "../models/userModel"
import { forEach, pick } from "lodash"
import bcrypt from "bcrypt"
import { authMIddleware , IRequest } from "../middleware/authMIddleware"

const route = Router()

route.post('/', valid(validate),asyncMiddleware(async(req:Request,res:Response) => {
    const newUser = new User(pick(req.body,['name',"location","phone","email","cv_link","categories"]))
    const genSalt = await bcrypt.genSalt(10)
    newUser.password = await bcrypt.hash(req.body.password, genSalt)
    await newUser.save()
    res.send(newUser)
}))

route.put("/me", [authMIddleware,valid(validate)],asyncMiddleware(async(req:IRequest,res:Response) => {
    const array = Object.keys(req.body)
    const userId = req.user?._id
    if(!userId) return res.status(401).send("Unauthorised")
        
    await User.findByIdAndUpdate(userId,{
        $set:pick(req.body,array)
    })
    const newUser = await User.findById(userId)
    if(!newUser) return res.status(404).send("User Not found")

    if(req.body.categories.length > 0){
        req.body.categories.forEach(category =>{
            if(!req.body.categories.includes(category)){
                newUser?.categories.push(category)
            }
        })
    }
    await newUser?.save()
    res.send()
}))

export default route