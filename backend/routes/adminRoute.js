import express from "express"
import { loginAdmin, registerAdmin, googleLoginAdmin } from "../controllers/adminController.js"

const adminRouter = express.Router()

adminRouter.post("/register", registerAdmin)
adminRouter.post("/login", loginAdmin)
adminRouter.post("/google-login", googleLoginAdmin)

export default adminRouter
