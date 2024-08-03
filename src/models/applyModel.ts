import mongoose , { Schema }from "mongoose"
import Joi, { ValidationResult } from "joi"
import { IDemand } from "./demandModel"
import newJoi from "../startup/validation"

interface IApply extends Document{
    demandId: IDemand | mongoose.Types.ObjectId
    description: string,
    reply: boolean
}

const applySchema = new Schema<IApply>({
    demandId:{
        type:mongoose.Types.ObjectId,
        ref: "Demand",
        required: true
    },
    description:{
        type:String,
        required:true
    },
    reply:{
        type: Boolean,
        default: false
    }
})

const Apply = mongoose.model("Apply", applySchema)

function validate(apply:IApply):ValidationResult{
    const schema = Joi.object({
        demandId: newJoi().required(),
        description: Joi.string().required()
    })
    return schema.validate(apply)
}

export { Apply , validate , IApply } 