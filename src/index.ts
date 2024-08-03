import { log , logger } from "./startup/logging"
import db from "./startup/db"
import routes from "./startup/routes"
import validateJoi from "./startup/validation"
import express from "express"

const app = express()

app.use(express.json())
log()
validateJoi()
routes(app)
db()

const port = process.env.PORT || 9001
app.listen(port, () => {
    logger.info(`Listening on port ${port}...`)
})