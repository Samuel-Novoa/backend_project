import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import Jwt from "jsonwebtoken";
import { getConfig } from "../../config";
import Role from "../../models/roles";
import SessionToken from "../../models/sessionToken";
import User from "../../models/user";

const config = getConfig();

export const signup = async (req, res) => {
  const { user_name, names, lastNames, email, password, roles } = req.body;

  // Validar datos de entrada
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  try {
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "The email is already in use" });
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    if (names, lastNames){
      let regex = /^[^\d]{3,}$/;
      if (!regex.test(names) ||!regex.test(lastNames)) {
        return res.status(400).json({ message: "Los Nombres y Apellidos NO pueden contener valores numéricos y deben tener un tamaño mayor a 2 letras" });
      }
    }

    // Crear nuevo usuario
    
    const newUser = await User.create({
      names,
      lastNames,
      user_name,
      email,
      password: hashedPassword,
    });

    // Asignar roles al usuario
    if (roles && roles.length > 0) {
      const foundRoles = await Role.findAll({ where: { role_name: roles } });
      if (foundRoles.length === 0) {
        return res.status(404).json({ message: "Role not found" });
      }
      await newUser.addRoles(foundRoles);
    } else {
      // Buscar o crear el rol "user" si no existe
      let defaultRole = await Role.findOne({ where: { role_name: "user" } });
      if (!defaultRole) {
        // Si el rol "user" no existe, créalo
        defaultRole = await Role.create({ role_name: "user" });
      }
      await newUser.addRoles([defaultRole]);
    }

    // Generar token de sesión
    const sessionToken = Jwt.sign({ id: newUser.user_id }, config.SECRET, {
      expiresIn: "24h",
    });

    // Respuesta exitosa
    res
      .status(201)
      .json({ user: newUser, token: sessionToken, message: "User created" });

    // Crear registro de token de sesión en la base de datos
    await SessionToken.create({
      user_id: newUser.user_id,
      session_token: sessionToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `signup => ${error.message}` });
  }
};

export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.json({
        status: false,
        error: "User not found",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.json({
        status: false,
        error: "Invalid password",
      });
    }

    // Check if a session token already exists for the user
    let sessionToken = await SessionToken.findOne({
      where: { user_id: user.user_id },
    });

    // If a session token exists, update it; otherwise, create a new one
    if (sessionToken) {
      sessionToken.session_token = Jwt.sign(
        { id: user.user_id },
        config.SECRET,
        {
          expiresIn: "24h",
        }
      );
      await sessionToken.save();
    } else {
      sessionToken = await SessionToken.create({
        user_id: user.user_id,
        session_token: Jwt.sign({ id: user.user_id }, config.SECRET, {
          expiresIn: "24h",
        }),
      });
    }

    res.json({
      status: true,
      message: "User signed in successfully",
      user: user,
      token: sessionToken.session_token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      error: `signin => ${error.message}`,
    });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generar un token único para restablecer la contraseña
    const resetToken = await bcrypt.hash(email, 10); // Puedes usar cualquier otro dato para generar el token
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // Token válido por 1 hora

    await user.save();

    // Enviar el token al usuario (puede ser por correo electrónico)
    // Aquí iría el código para enviar el token al correo electrónico del usuario

    res.status(200).json({ message: "Reset token sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `forgotPassword => ${error.message}` });
  }
};

export const resetPassword = async (req, res) => {
  const { resetToken, newPassword } = req.body;

  try {
    const user = await User.findOne({
      where: {
        resetPasswordToken: resetToken,
        resetPasswordExpires: { $gt: Date.now() },
      },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Actualizar la contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `resetPassword => ${error.message}` });
  }
};

export const getDataById = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Session_token.findOne({
      where: { user_id: id },
    });

    if (!data) {
      return res.status(404).json({ message: "Session token not found" });
    }

    res.json(data, { message: "Session token found", success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
