import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { knex } from "@/database/knex";
import { AppError } from "@/utils/AppError";

class OrdersController {
  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const bodySchema = z.object({
        tables_session_id: z.number(),
        product_id: z.number(),
        quantity: z.number(),
      });

      const { tables_session_id, product_id, quantity } = bodySchema.parse(
        request.body
      );

      const session = await knex<TablesSessionsRepository>("tables_sessions")
        .where({ id: tables_session_id })
        .first();

      if (!session) {
        throw new AppError("Session not found", 404);
      }

      if (session.closed_at) {
        throw new AppError("this table is closed", 400);
      }

      const product = await knex<ProductRpository>("products")
        .where({ id: product_id })
        .first();

      if (!product) {
        throw new AppError("Product not found", 404);
      }

      await knex("orders").insert({
        tables_session_id,
        product_id,
        quantity,
        price: product.price * quantity,
        created_at: knex.fn.now(),
        updated_at: knex.fn.now(),
      });
      return response.status(201).json();
    } catch (error) {
      next(error);
    }
  }

  async index(request: Request, response: Response, next: NextFunction) {
    try {
      const paramsSchema = z.object({
        tables_session_id: z.coerce.number(),
      });

      const { tables_session_id } = paramsSchema.parse(request.params);

      const order = await knex("orders")
        .select(
          "orders.id",
          "orders.tables_session_id",
          "orders.product_id",
          "products.name",
          "orders.quantity",
          "orders.price",
          "orders.created_at",
          "orders.updated_at"
        )
        .join("products", "products.id", "orders.product_id")
        .where({
          tables_session_id,
        })
        .orderBy("orders.created_at", "desc");

      return response.json(order);
    } catch (error) {
      next(error);
    }
  }

  async show(request: Request, response: Response, next: NextFunction) {
    try {
      const { tables_session_id } = request.params;

      const order = await knex("orders")
        .select(
          knex.raw("COALESCE(SUM(orders.price), 0) as total"),
          knex.raw("COALESCE(SUM(orders.quantity), 0) as quantidade")
        )
        .where({ tables_session_id })
        .first();

      return response.json(order);
    } catch (error) {
      next(error);
    }
  }
}

export { OrdersController };
