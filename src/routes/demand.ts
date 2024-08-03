import { Router , Request , Response } from "express"
import asyncMiddleware from "../middleware/asyncMiddleware"
import { authMIddleware, IRequest } from "../middleware/authMIddleware"
import { valid } from "../middleware/validateMiddleware"
import { Demand , IDemand , validate } from "../models/demandModel"
import { pick } from "lodash"
import validateObjectIdMiddleware from "../middleware/validateObjectIdMiddleware"
import { Company, ICompany } from "../models/companyModel"

const route = Router()

route.get("/", [authMIddleware, valid(validate)], asyncMiddleware(async(req:IRequest,res:Response) => {
    if(!req.company?._id) return res.status(401).send("Requires company to log in")
    
    const demands = await Demand.find()
    res.send(demands)
}))

route.get("/:id", [authMIddleware, validateObjectIdMiddleware,valid(validate)], asyncMiddleware(async(req:IRequest,res:Response) => {
    if(!req.company?._id) return res.status(401).send("Requires company to log in")
    
    const demands = await Demand.findById(req.params.id)
    if(!demands) return res.status(404).send("Demand not found")
    res.send(demands)
}))

route.post("/", [authMIddleware , valid(validate)],asyncMiddleware(async(req:IRequest,res:Response) => {
    const array = Object.keys(req.body)
    if(!req.company?._id) return res.status(401).send("Requires company to log in")

    const newDemand = new Demand(pick(req.body,array))
    newDemand.companyId = req.company._id
    const company = await Company.findById(req.company._id)
    if(company != undefined){
        newDemand.categoryId = company?.category
    }
    await newDemand.save()
    res.send(newDemand)
}))

route.put("/:id", [authMIddleware,validateObjectIdMiddleware,valid(validate)], asyncMiddleware(async (req:IRequest,res:Response) => {
    const array = Object.keys(req.body)
    if(!req.company?._id) return res.status(401).send("Requires company to log in")

    const newDemand = await Demand.findByIdAndUpdate(req.params.id,pick(req.body,array),{new:true})
    res.send(newDemand)
}))

route.delete("/:id", [authMIddleware,validateObjectIdMiddleware,valid(validate)], asyncMiddleware(async(req:IRequest,res:Response) => {
    if(!req.company?._id) return res.status(401).send("Requires company to log in")

    const newDemand = await Demand.findByIdAndDelete(req.params.id,{new:true})
    res.send(newDemand)
}))

export default route