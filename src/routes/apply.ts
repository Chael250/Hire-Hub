import { Router ,Request , Response} from "express"
import asyncMiddleware from "../middleware/asyncMiddleware"
import { authMIddleware, IRequest } from "../middleware/authMIddleware"
import { valid } from "../middleware/validateMiddleware"
import { Apply, validate } from "../models/applyModel"
import { Demand } from "../models/demandModel"
import { pick } from "lodash"
import mongoose from "mongoose"

const route = Router()

route.post("/", [authMIddleware, valid(validate)] , asyncMiddleware(async(req:IRequest,res:Response) => {
    if(!req.user?._id) return res.status(401).send("Requires user to log in")
    const session = await mongoose.startSession()
    if(!session) return res.status(500).send("Internal server error");

    session.startTransaction()
    const newApply = new Apply(pick(req.body,["demandId","description"]))
    await newApply.save()
    const demand = await Demand.findById(req.body.demandId)
    if(!demand){
        await session.abortTransaction();
        session.endSession()
        return res.status(404).send("The demand was not found")
    }
    demand.applies += 1
    await demand.save();
    await session.commitTransaction();
    session.endSession()
    res.send(newApply)
}))

export default route