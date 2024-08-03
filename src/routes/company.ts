import { Router , Request , Response} from "express"
import { Company , validate } from "../models/companyModel"
import asyncMiddleware from "../middleware/asyncMiddleware"
import { valid , ValidationFunction } from "../middleware/validateMiddleware"
import { Category } from "../models/categoryModel"
import bcrypt from "bcrypt"
import { pick } from "lodash"

const route = Router()

route.post("/", valid(validate),asyncMiddleware(async(req:Request,res:Response) => {

    const category = await Category.findById(req.body.category)
    if(!category) return res.status(404).send("Such a category doesn't exist")

    const newCompany = new Company(pick(req.body,["name","location","manager","category","description"]))

    const genSalt = await bcrypt.genSalt(10)
    newCompany.password = await bcrypt.hash(req.body.password, genSalt)
    await newCompany.save()
    const token = newCompany.generateAuthToken()
    res.header("x-auth-token").send(newCompany)
}))

export default route