import mongoose , { Schema }from "mongoose"
import Joi, { ValidationResult } from "joi"
import newJoi from "../startup/validation"
import { IApply } from "./applyModel"

interface IReply extends Document{
    applyId: IApply | mongoose.Types.ObjectId
    description: string,
}

const replySchema = new Schema<IReply>({
    applyId:{
        type:mongoose.Types.ObjectId,
        ref: "Apply",
        required: true
    },
    description:{
        type:String,
        required:true
    },
})

const Reply = mongoose.model("Reply", replySchema)

function validate(reply:IReply):ValidationResult{
    const schema = Joi.object({
        applyId: newJoi().required(),
        description: Joi.string().required()
    })
    return schema.validate(reply)
}

export { Reply , validate , IReply } 