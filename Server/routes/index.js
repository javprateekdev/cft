import { Router } from 'express'
import userRoutes  from './user.js'
import authRoutes from "./auth.js";
import todoRoutes from './todo.js';

const router = Router()

router.use("/user",userRoutes)
router.use('/auth',authRoutes)
router.use('/todos',todoRoutes)


export default router