import category from "../routes/category"
import company from "../routes/company"
import user from "../routes/user"
import authCompany from "../routes/authCompany"
import authUser from "../routes/authUser"
import error from "../middleware/errorMiddleware"
import demand from "../routes/demand"
import apply from "../routes/apply"
import reply from "../routes/reply"
import { Express } from "express"

export default function(app:Express){
    app.use("/resources/categories", category)
    app.use("/resources/company", company)
    app.use("/resources/user", user)
    app.use("/resources/authCompany", authCompany)
    app.use("/resources/authUser", authUser)
    app.use("/resources/demand", demand)
    app.use("/resources/apply", apply)
    app.use("/resources/reply", reply)
    app.use(error)
}