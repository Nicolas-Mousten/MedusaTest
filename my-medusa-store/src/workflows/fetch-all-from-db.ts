
import { createStep, StepResponse, createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

class databaseQuery<T>{
    table: string;
    fields:string[];
    filters: Record<string, any>;
    take: number; 
    skip: number; 
    data: { field: string, value: any }[];
    //order: { name: string };
    constructor(
        table: string,
        fields: string[],
        filters: Record<string, any>,
        take: number,
        skip: number,
        // order: { name: string } = { name: "" }
    ) {
        this.table = table;
        this.fields = fields;
        this.filters = filters;
        this.take = take;
        this.skip = skip;
        // this.order = order;
    }


    toString = () => {
        return `table: ${this.table}\n,
        ${this.data.forEach(element => {
            element + ": " + data + "\n"
        })}` 
    
    }
}





interface FetchDataParams {
    table: string;
    fields: string[];
    filters: Record<string, any>;
    metadata: { take: number; skip: number; order: { name: string } };
}

const fetchDataStep = createStep("fetch-all-data-step", async (input: FetchDataParams, { container }) => {
    console.log("fetchDataStep input:", input.table); // Log input
    const query = container.resolve(ContainerRegistrationKeys.QUERY);
    const { table, metadata, fields, filters } = input;
    if(!metadata){
        const { data } = await query.graph({
            entity: table,
            fields: fields,
            filters: filters,
            // pagination: {
            //     take: metadata.take,
            //     skip: metadata.skip,
            //     order: {
            //         name: metadata.order.name,
            //     },
            // },
        });
        return new StepResponse(data);
    }else{
        const { data } = await query.graph({
            entity: table,
            fields: fields,
            filters: filters,
            pagination: {
                take: metadata.take,
                skip: metadata.skip,
                // order: {
                //     name: metadata.order.name,
                // },
            },
        });
        return new StepResponse(data);
    }
});

export const fetchAllDataWorkflow = createWorkflow(
    "fetch-all-data",
    (input: FetchDataParams) => {
        
        const data = fetchDataStep(input);

        return new WorkflowResponse(data);
    }
);
