import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { knex } from "@/database/knex";
import { AppError } from "@/utils/AppError";

class ProductController {
  async index(request: Request, response: Response, next: NextFunction) {
    try {
      const { name } = request.query;
      const products = await knex<ProductRpository>("products")
        .select()
        .whereLike("name", `%${name ?? ""}%`)
        .orderBy("name");

      return response.json(products);
    } catch (error) {
      next(error);
    }
  }

  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const bodySchema = z.object({
        name: z.string().trim().min(2, "Name is required"),
        price: z.number().positive("Price must be a positive number"),
      });

      const { name, price } = bodySchema.parse(request.body);

      await knex<ProductRpository>("products").insert({ name, price });

      return response.status(201).json();
    } catch (error) {
      next(error);
    }
  }

  async update(request: Request, response: Response, next: NextFunction) {
    try {
      const id = z
        .string()
        .transform((value) => Number(value))
        .refine((value) => !isNaN(value), { message: "id must be a number" })
        .parse(request.params.id);

      const bodySchema = z.object({
        name: z.string().trim().min(2, "Name is required"),
        price: z.number().positive("Price must be a positive number"),
      });

      const { name, price } = bodySchema.parse(request.body);

      const product = await knex<ProductRpository>("products")
        .select()
        .where({ id })
        .first();

      if (!product) {
        throw new AppError("Product not found", 404);
      }

      await knex<ProductRpository>("products")
        .update({ name, price, updated_at: knex.fn.now() })
        .where({ id });

      return response.json();
    } catch (error) {
      next(error);
    }
  }

  async delete(request: Request, response: Response, next: NextFunction) {
    try {
      const id = z
        .string()
        .transform((value) => Number(value))
        .refine((value) => !isNaN(value), { message: "id must be a number" })
        .parse(request.params.id);

      const product = await knex<ProductRpository>("products")
        .select()
        .where({ id })
        .first();

      if (!product) {
        throw new AppError("Product not found", 404);
      }

      await knex<ProductRpository>("products").where({ id }).delete();

      return response.json();
    } catch (error) {
      next(error);
    }
  }
}

export { ProductController };
