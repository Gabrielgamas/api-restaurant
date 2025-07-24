import { Router } from "express";
import { prodductsRoutes } from "./products-routes";
import { tablesRoutes } from "./tables-routes";

const routes = Router();
routes.use("/products", prodductsRoutes);
routes.use("/tables", tablesRoutes);

export { routes };
