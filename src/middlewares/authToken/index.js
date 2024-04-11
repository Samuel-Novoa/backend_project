// middleware.js
import { verify } from "jsonwebtoken";
import { getConfig } from "../../config";
import User from "../../models/user";
import Role from "../../models/roles";

const config = getConfig();

export const verifyToken = async (req, res, next) => {
  const token = req.headers["access-token"];
  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }
  try {
    const decoded = verify(token, config.SECRET);
    req.userId = decoded.id;
    const user = await User.findByPk(req.userId, {
      attributes: { exclude: ["password"] },
      include: Role,
    });
    if (!user) {
      return res.status(404).json({ message: "No user found" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export const isModerator = async (req, res, next) => {
  checkRole(req, res, next, "moderator");
};

export const isAdmin = async (req, res, next) => {
  checkRole(req, res, next, "admin");
};

export const checkRole = async (req, res, next, roleName) => {
  try {
    const user = await User.findByPk(req.userId);

    if (!user) { return res.status(404).json({ message: "No user found" }) }
    const role = await Role.findOne({ where: { role_name: roleName } })

    if (!role) { return res.status(404).json({ message: `Role '${roleName}' not found` }) }
    const userRoles = await user.getRoles();

    const foundRole = userRoles.find((userRole) => userRole.role_id === role.role_id && userRole.status === 1)

    if (!foundRole) { return res.status(403).json({ message: `Require '${roleName}' role` }) }
    next()
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
