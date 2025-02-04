import {
    createStep,
    StepResponse,
    createWorkflow,
    WorkflowResponse
} from "@medusajs/framework/workflows-sdk"
import { BRAND_MODULE } from "src/modules/brand"
import BrandModuleService from "src/modules/brand/service"
import { emitEventStep } from "@medusajs/medusa/core-flows"

export type CreateBrandStepInput = {
    name: string
}
export const createBrandStep = createStep(
    "create-brand-step", 
    async (input: CreateBrandStepInput, { container }) => {
        const BrandModuleService: BrandModuleService = container.resolve(
            BRAND_MODULE
        )

        const brand = await BrandModuleService.createBrands(input)

        return new StepResponse(brand, brand.id)
    },
    async (id:string, {container}) => { //Compensation function for deleting the data if a fault happens
        const brandModuleService: BrandModuleService = container.resolve(
            BRAND_MODULE
        )

        await brandModuleService.deleteBrands(id)
    } 
)



type CreateBrandWorkflowInput = {
    name: string
}
export const createBrandWorkflow = createWorkflow(
    "create-brand",
    (input: CreateBrandInput) => {
        const brand = createBrandStep(input)
        
        emitEventStep({
            eventName: "brand.created",
            data: {
                id: brand.id
            },
        })
        
        return new WorkflowResponse(brand)
    }
)