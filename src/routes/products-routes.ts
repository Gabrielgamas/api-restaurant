import { ProductController } from "@/controllers/products-controller";
import { Router } from "express";

const prodductsRoutes = Router();
const productsController = new ProductController();

prodductsRoutes.get("/", productsController.index);

export { prodductsRoutes };
