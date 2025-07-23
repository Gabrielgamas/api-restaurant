import { NextFunction, Request, Response } from "express";

class ProductController {
  async index(request: Request, response: Response, next: NextFunction) {
    try {
      return response
        .status(200)
        .json({ message: "Products retrieved successfully" });
    } catch (error) {
      next(error);
    }
  }
}

export { ProductController };
