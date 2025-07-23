import { Router } from "express";
import { prodductsRoutes } from "./products-routes";

const routes = Router();
routes.use("/products", prodductsRoutes);

export { routes };
