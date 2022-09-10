import express from "express";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import {  generateToken , isAuth } from "../utils.js";
import expressAsyncHandler from "express-async-handler";

const userRoutes = express.Router();

userRoutes.post(
  "/signin",
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user),
        });
        return;
      }
    }
    res.status(401).send({ message: "Invalid email or Password" });
  })
);

userRoutes.post(
  "/signup",
  expressAsyncHandler(async (req, res) => {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password),
    });
    const user = await newUser.save();
    res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user),
    });
  })
);

userRoutes.put(
  "/profile",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8);
      }

      const updatesUser = await user.save();

      res.send({
        _id: updatesUser._id,
        name: updatesUser.name,
        email: updatesUser.email,
        isAdmin: updatesUser.isAdmin,
        token: generateToken(updatesUser),
      });
    }
    else{
      res.status(404).send({message:'user not found'})
    }
  })
);

userRoutes.get('/admin/userList' , expressAsyncHandler(async (req , res) => {
  const userList = await User.find() ;
  res.send(userList) 
}))



export default userRoutes;
