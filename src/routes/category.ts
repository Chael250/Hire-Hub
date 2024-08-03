import { Router , Response } from "express"
import asyncMiddleware from "../middleware/asyncMiddleware"
import { Category,validate } from "../models/categoryModel"
import { ValidationFunction,valid } from "../middleware/validateMiddleware"
import { authMIddleware , IRequest } from "../middleware/authMIddleware"

const route = Router()

route.post("/", authMIddleware ,asyncMiddleware(async(req:IRequest,res:Response) => {
   valid(validate)
   
   const newCategory = new Category({
    name: req.body.name,
    description: req.body.description
   })
   await newCategory.save()
   res.status(200).send(newCategory)
}))

export default route