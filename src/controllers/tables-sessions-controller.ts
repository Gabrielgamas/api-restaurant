import { NextFunction, Request, Response } from "express";
import { knex } from "@/database/knex";
import { z } from "zod";

class TablesSessionsController {
  async create(request: Request, response: Response, next: NextFunction) {
    try {
      return response.json();
    } catch (error) {
      next(error);
    }
  }
}

export { TablesSessionsController };
