import { Router ,Request , Response} from "express"
import asyncMiddleware from "../middleware/asyncMiddleware"
import { authMIddleware, IRequest } from "../middleware/authMIddleware"
import { valid } from "../middleware/validateMiddleware"
import { Apply } from "../models/applyModel"
import { pick } from "lodash"
import mongoose from "mongoose"
import { Reply , validate } from "../models/replyModel"

const route = Router()

route.post("/", [authMIddleware, valid(validate)] , asyncMiddleware(async(req:IRequest,res:Response) => {
    if(!req.company?._id) return res.status(401).send("Requires company log in")
    const session = await mongoose.startSession()
    if(!session) return res.status(500).send("Internal server error");

    session.startTransaction()
    const newReply = new Reply(pick(req.body,["applyId","description"]))
    await newReply.save()
    const apply = await Apply.findById(req.body.applyId)
    if(!apply){
        await session.abortTransaction();
        session.endSession()
        return res.status(404).send("The application was not found")
    }
    apply.reply = true
    await apply.save();
    await session.commitTransaction();
    session.endSession()
    res.send(newReply)
}))

export default route