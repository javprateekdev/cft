import prisma from "../db.js";
import bcrypt from "bcrypt";

export const createUser = async (req, res) => {

  const { name, password, phone, email } = req.body;

  try {
    const emailExist = await prisma.user.findUnique({
      where: {
         email,
      },
    });

    if (emailExist) {
      return res.status(409).json({
        status: false,
        data: false,
        msg: "Email Already Exists",
      });
    }
    const phonenumber = await prisma.user.findUnique({
      where: {
        phone,
      },
    });

    if (phonenumber) {
      return res.status(409).json({
        status: false,
        data: false,
        msg: "Phone Number Already Exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        email,
      },
    });

    return res.status(200).json({
      data: user,
      status: true,
      msg: "User Created Succesfully",
    });
  } catch (error) {
    return res.status(422).json({
      data: null,
      status: false,
      msg: error.message,
    });
  }
};
