import mongoose from "mongoose"
import Joi, { ValidationResult } from "joi"

interface ICategory{
    name: String,
    description: String
}

const categorySchema = new mongoose.Schema<ICategory>({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
})

const Category = mongoose.model("Category", categorySchema)

function validate(category:ICategory):ValidationResult{
    const schema = Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required()
    })
    return schema.validate(category)
}

export { Category , validate , ICategory}