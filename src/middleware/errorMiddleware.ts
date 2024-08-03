import { NextFunction, Request, Response } from "express";
import { logger } from "../startup/logging";

export default function(ex:Error,req:Request, res:Response, next:NextFunction){
    logger.error(ex.message, ex)
    res.status(500).send("Internal Server Error")
}