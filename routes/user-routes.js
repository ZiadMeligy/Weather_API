import express from 'express';
import { getAllUsers, signup, login,clearHistorybyId } from '../controllers/user.controllers.js';


const userRouter = express.Router();

userRouter.get("/", getAllUsers);
userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.delete("/clearhistory/:id", clearHistorybyId);


export default userRouter; 