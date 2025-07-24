import { ProductController } from "@/controllers/products-controller";
import { Router } from "express";

const prodductsRoutes = Router();
const productsController = new ProductController();

prodductsRoutes.get("/", productsController.index);
prodductsRoutes.post("/", productsController.create);
prodductsRoutes.put("/:id", productsController.update);
prodductsRoutes.delete("/:id", productsController.delete);

export { prodductsRoutes };
