import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { fetchAllDataWorkflow } from "src/workflows/fetch-all-from-db";

interface FetchDataParams {
  table: string;
  fields: string[];
  filters: Record<string, any>;
  metadata: { take: number; skip: number; order: { name: string } };
}

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const { table, fields, filters } = req.query;
  console.log("GET request received\n" + table);
  const { result } = await fetchAllDataWorkflow(req.scope).run({
    input: {
      table: table as string,
      fields: (fields as string).split(","),
      filters: JSON.parse(filters as string),
    } as FetchDataParams,
  });

  res.json({ table: result });
};