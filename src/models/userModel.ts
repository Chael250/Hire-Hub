import mongoose , { Schema } from "mongoose"
import { Category, ICategory } from "./categoryModel"
import Joi, { ObjectSchema, ValidationResult } from "joi"
import newJoi from "../startup/validation"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import config from "config"

interface IUser{
    name:string,
    location: string,
    phone: string,
    cv_link: string,
    email: string,
    password: string,
    categories: ICategory[] | mongoose.Types.ObjectId[],
    generateAuthToken: () => string
    generatePassword: () => string
}

const userSchema = new Schema<IUser>({
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    cv_link: {
        type: String,
        required: true
    },
    email:{
        type:String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    categories: {
        type: [mongoose.Types.ObjectId],
        ref: "Category",
        required: true
    }
})

userSchema.methods.generateAuthToken = function(){
    return jwt.sign({_id:this._id}, config.get("jwtPrivateKeyUser"))
}

userSchema.methods.generatePassword = async function():Promise<string>{
    const genSalt = await bcrypt.genSalt(10)
    return await bcrypt.hash(this.password, genSalt)
}

const User = mongoose.model('User', userSchema)

function validate(user:IUser):ValidationResult{
    const schema:ObjectSchema = Joi.object({
        name: Joi.string().required(),
        location: Joi.string().required(),
        phone: Joi.string().pattern(/^[0-9]{10}$/).required(),
        cv_link: Joi.string().required(),
        email: Joi.string().pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).required(),
        password: Joi.string().min(5).max(50).required(),
        categories: Joi.array().items(newJoi().required()).required()
    })
    return schema.validate(user)
}

export { User , validate , IUser}