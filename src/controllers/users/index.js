import User from "../../models/user";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";

const { QueryTypes } = require('sequelize');

export const getData = async (req, res) => {
  try {
    const users = await User.findAll();
    //const usersa = await sequelize.query("SELECT * FROM `users`", { type: QueryTypes.SELECT });

    //res.json(users);
    res.json({ message: "All users", content: users });
  } catch (error) {
    res.status(500).json({ error: "Hubo un error al obtener los usuarios" });
  }
};

export const postData = async (req, res) => {
  const { user_name, names, lastNames, email, password, roles } = req.body;

  try {
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "El Correo ya se encuentra en uso" });
    }

    // Verificar si se proporciona una contraseña
    if (!password) {
      return res.status(400).json({ message: "La Contraseña es Requerida" });
    }

    // Verificar si se proporcionan roles y si existen en la base de datos
    if (roles && roles.length > 0) {
      const foundRoles = await Role.findAll({ where: { role_name: roles } });
      if (foundRoles.length === 0) {
        return res.status(404).json({ message: "Role no encontrado" });
      }
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el nuevo usuario
    const newUser = await User.create({
      names,
      lastNames,
      user_name,
      email,
      password: hashedPassword,
    });

    // Asignar roles al usuario
    if (roles && roles.length > 0) {
      await newUser.addRoles(foundRoles);
    } else {
      const defaultRole = await Role.findOne({ where: { role_name: "user" } });
      await newUser.addRoles([defaultRole]);
    }

    res.status(201).json({ message: "Usuario Creado Exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Error al Crear Usuario: ${error.message}` });
  }
};

export const deleteUser = async (req, res) => {
  try {
    console.log("req.params", req.params);
    // Obtén el ID del usuario a eliminar desde los parámetros de la solicitud
    const userId = req.params.id;

    // Busca el usuario en la base de datos
    const user = await User.findByPk(userId);

    // Si el usuario no existe, devuelve un mensaje de error
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Elimina el usuario de la base de datos
    await user.destroy();

    // Devuelve una respuesta de éxito
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    // Si ocurre un error, devuelve un mensaje de error
    console.error(error);
    res.status(500).json({ message: 'Error deleting user: ' + error.message });
  }
};

export const postDataAdmin = async (req, res) => {
  const { user_name, email, password, roles } = req.body;

  try {
    // Verificar si el usuario actual es administrador
    if (!req.isAdmin) {
      return res
        .status(403)
        .json({ message: "Unauthorized: Only admins can create users" });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "The email is already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      user_name,
      email,
      password: hashedPassword,
    });

    if (roles && roles.length > 0) {
      const foundRoles = await Role.findAll({ where: { role_name: roles } });
      if (foundRoles.length === 0) {
        return res.status(404).json({ message: "Role not found" });
      }
      await newUser.addRoles(foundRoles);
    } else {
      const defaultRole = await Role.findOne({ where: { role_name: "user" } });
      await newUser.addRoles([defaultRole]);
    }

    res.status(201).json({ message: "Admin user created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `createAdminUser => ${error.message}` });
  }
};
