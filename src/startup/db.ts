import mongoose from "mongoose"
import config from "config"
import { logger } from "../startup/logging"

export default function(){
    mongoose.connect(config.get("db"))
        .then(() => logger.info(`Connected to ${config.get("db")}`))
        .catch((err) => logger.info(`Error while connecting ${config.get("db")}`))
}