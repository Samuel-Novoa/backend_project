import rolesRoutes from "./roles";
import authRoutes from "./auths";
import usersRoutes from "./user";
import simulatorRoutes from "./simulator";

export default function (app) {
  //auth and roles
  app.use("/api/auth", authRoutes);

  app.use("/api/users", usersRoutes);

  app.use("/api/role", rolesRoutes);

  app.use("/api/simulator", simulatorRoutes);

}
