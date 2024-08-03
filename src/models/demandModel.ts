import mongoose , { Schema }from "mongoose"
import Joi, { ValidationResult } from "joi"
import { ICategory } from "./categoryModel"
import { ICompany } from "./companyModel"

interface IDemand extends Document{
    companyId: ICompany | mongoose.Types.ObjectId,
    categoryId: ICategory | mongoose.Types.ObjectId,
    description: string,
    applies: number
}

const demandSchema = new Schema<IDemand>({
    companyId: {
        type:mongoose.Types.ObjectId,
        ref: "Company",
        required: true
    },
    categoryId:{
        type:mongoose.Types.ObjectId,
        ref: "Category",
        required:true
    },
    description:{
        type:String,
        required:true
    },
    applies:{
        type: Number,
        required: true,
        default:0
    }
})

const Demand = mongoose.model("Demand", demandSchema)

function validate(demand:IDemand):ValidationResult{
    const schema = Joi.object({
        description: Joi.string().required()
    })
    return schema.validate(demand)
}

export { Demand , validate , IDemand}