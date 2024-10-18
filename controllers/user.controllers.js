// import user from models
import User from "../models/user-model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const getAllUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find();
    const currentTime = new Date()
    users = users.map((user) => {
      user.logHistory = user.logHistory.map((log) => {
        const logTime = new Date(log.currentTime);
        const diffTime = Math.floor(
          Math.abs(logTime - currentTime) / (1000 * 60 * 60)
        );
        const diffDays = Math.floor(diffTime / 24);
        console.log(logTime, currentTime, diffTime);
        return {
          ...log,
          FetchTime: `${diffDays} Days, ${diffTime} hours ago`,
        };
      });
      return user;
    });
  } catch (err) {
    console.log(err);
  }
  if (!users) {
    res.status(404).json({ message: "No users found" });
  }
  return res.status(200).json({ users });
};

export const signup = async (req, res, next) => {
  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    console.log(err);
  }
  if (existingUser) {
    return res
      .status(400)
      .json({ message: "User already exists, Please Login Instead" });
  }
  const hashedPassword = bcrypt.hashSync(password);
  const user = new User({
    name,
    email,
    password: hashedPassword,
    blogs: [],
  });

  try {
    await user.save();
  } catch (err) {
    console.log(err);
  }
  return res.status(201).json({ user });
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare the password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign({ id: existingUser._id }, "your_secret_key", {
      expiresIn: "1h",
    });

    res.status(200).json({ token, userId: existingUser._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
};

export const clearHistorybyId = async (req, res, next) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.logHistory = [];
    await user.save();
    return res.status(200).json({ message: "History cleared successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
