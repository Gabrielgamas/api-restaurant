import { NextFunction, Request, Response } from "express";
import { knex } from "@/database/knex";
import { z } from "zod";

class TablesController {
  async index(request: Request, response: Response, next: NextFunction) {
    try {
      const tables = await knex<TableRepository>("tables")
        .select()
        .orderBy("table_id");
      return response.json(tables);
    } catch (error) {
      next(error);
    }
  }

  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const bodySchema = z.object({
        number: z
          .number()
          .int()
          .positive("Table number must be a positive integer"),
      });

      const { number } = bodySchema.parse(request.body);

      await knex("tables").insert({ number });

      return response.status(201).json();
    } catch (error) {
      next(error);
    }
  }
}
export { TablesController };
