import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("tables").del();

  await knex("tables").insert([
    { table_id: 1 },
    { table_id: 2 },
    { table_id: 3 },
    { table_id: 4 },
    { table_id: 5 },
  ]);
}
