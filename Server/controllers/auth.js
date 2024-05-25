import prisma from "../db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const JWT_SECRET = process.env.JWT_SECRET || "DEFAULT_SECRET_KEY";

export const login = async (req, res) => {
  const { email, password, phone } = req.body;

  try {
    let user ;
    if (email) {
     user = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (!user) {
        return res.status(404).json({
          data: null,
          status: false,
          msg: "User Does not Exist With this email.",
        });
      }
    }

    if (phone) {
     user = await prisma.user.findUnique({
        where: {
          phone: parseInt(phone),
        },
      });
      if (!user) {
        return res.status(404).json({
          data: null,
          status: false,
          msg: "User Does not Exist With this Phone Number.",
        });
      }
    }

   

    const isVerified = await bcrypt.compare(password, user.password);

    if (!isVerified) {
      return res.status(401).json({
        status: false,
        data: null,
        msg: "Wrong Password",
      });
    }

    let token = jwt.sign(
      {
        name: user.name,
        email: user.email,
      },
      JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    return res.status(200).json({
      data: {
        token,
        user,
      },
      status: true,
      msg: "Login Succesful",
    });
  } catch (error) {
    return res.status(422).json({
      status: false,
      data: null,
      msg: error.message,
    });
  }
};

export const verifyToken = async (req, res, next) => {
  try {
  
    let token = req.headers.authorization;
    let authToken = token && token.split(" ")[1];
  
    const verifyToken = jwt.verify(authToken, JWT_SECRET, (error, decoded) => {
      if (error) {
        return res.status(403).json({
          status: false,
          data: null,
          msg: "Authentication Unsuccesful",
        });
      } else {
        req.user = decoded;
        next();
      }
    });
    
  } catch (error) {
    return res.status(422).json({
      status: false,
      data: null,
      msg: error.message,
    });
  }
};
