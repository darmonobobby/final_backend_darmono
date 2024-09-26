const { hash, genSalt, compareSync } = require("bcrypt");
const { User } = require("../models");
const UnauthenticatedError = require("../errors/UnauthenticatedError");
const { sign } = require("jsonwebtoken");

exports.register = async (req, res, next) => {
  const { name, email, password, username, phoneNumber, role, address } = req.body;

  try {
    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);
    const user = await User.create({
      name,
      username,
      email,
      password: hashedPassword,
      phoneNumber,
      role,
      address,
    });
    res.status(201).json({ 
      message: "Success creating new user",
      data: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
        address: user.address,
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!email) throw new UnauthenticatedError("Invalid email or password");
    if (!password) throw new UnauthenticatedError("Invalid email or password");

    const user = await User.findOne({
      where: { email },
    });


    if (!user) throw new UnauthenticatedError("Invalid email or password");

    if (!compareSync(password, user.password)) {
      throw new UnauthenticatedError("Invalid email or password");
    }

    const payload = {
      name: user.name,
      email: user.email,
      role: user.role,
    };
    
    const token = sign(payload, process.env.JWT_SECRET, { expiresIn: "12h" });
    res.status(200).json({ 
      accessToken: token, 
      name: user.name, 
      role: user.role, 
      id: user.id
    });
  } catch (error) {
    next(error);
  }
};
