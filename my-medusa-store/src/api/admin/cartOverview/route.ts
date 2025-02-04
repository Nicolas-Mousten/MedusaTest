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
    console.log("GET request received\n" + req.body.table);
    const { result } = await fetchAllDataWorkflow(req.scope).run({
      input: req.body as FetchDataParams,
    });
  
    res.json({ brand: result });
  };