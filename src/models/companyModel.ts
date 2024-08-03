import mongoose , {Document} from "mongoose"
import Joi, { required, string, ValidationResult , ObjectSchema} from "joi"
import newJoi from "../startup/validation"
import jwt from "jsonwebtoken"
import config from "config"
import { ICategory } from "./categoryModel"

interface ICompany extends Document{
    name: string,
    location: string,
    manager: string,
    category: ICategory | mongoose.Types.ObjectId,
    description: string,
    password: string
    generateAuthToken: () => String
}

const companySchema = new mongoose.Schema<ICompany>({
    name:{
        type:String,
        required: true
    },
    location:{
        type:String,
        required: true
    },
    manager:{
        type:String,
        required:true
    },
    category:{
        type: mongoose.Types.ObjectId,
        ref: "Category",
        required: true
    },
    description:{
        type:String,
        required: true
    },
    password:{
        type:String,
        required: true,
        minlenght: 5,
        maxlength: 1024
    }
})

companySchema.methods.generateAuthToken = function(){
    return jwt.sign({_id:this.id}, config.get("jwtPrivateKeyCompany"))
}

const Company = mongoose.model("Company", companySchema)

function validate(company:ICompany):ValidationResult{
    const schema:ObjectSchema = Joi.object({
        name: Joi.string().required(),
        location: Joi.string().required(),
        manager: Joi.string().required(),
        category: newJoi().required(),
        description: Joi.string().required(),
        password: Joi.string().min(5).max(50).required()
    })
    return schema.validate(company)
}

export { Company , validate , ICompany}
