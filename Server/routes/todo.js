import { Router } from 'express';
import { createTodo,updateTodo,deleteTodo,getTodos} from '../controllers/todo.js';
import { verifyToken } from '../controllers/auth.js';

const router = Router()

router.post("/createTodo", verifyToken, createTodo)
router.post("/updateTodo", verifyToken, updateTodo)
router.delete("/deleteTodo/:uuid", verifyToken, deleteTodo)
router.get('/getTodo/:take/:skip', verifyToken, getTodos)

export default router;