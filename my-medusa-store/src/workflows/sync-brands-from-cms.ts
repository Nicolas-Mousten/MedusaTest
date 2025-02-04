import {
  createStep,
  StepResponse,
  createWorkflow,
  transform,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import CmsModuleService from "../modules/cms/service";
import { CMS_MODULE } from "../modules/cms";
import BrandModuleService from "src/modules/brand/service";
import brand, { BRAND_MODULE } from "src/modules/brand";
import { Brand } from ".medusa/types/query-entry-points";

const retrieveBrandsFromCmsStep = createStep(
  "retrieve-brands-from-cms",
  async (_, { container }) => {
    const cmsModuleService: CmsModuleService = container.resolve(CMS_MODULE);

    const brands = await cmsModuleService.retrieveBrands();

    return new StepResponse(brands);
  }
);

type CreateBrand = {
  name: string;
};

type CreateBrandInput = {
  brands: CreateBrand[];
};

export const createBrandsStep = createStep(
  "create-brand-step",
  async (input: CreateBrandInput, { container }) => {
    const brandModuleService: BrandModuleService =
      container.resolve(BRAND_MODULE);

    const brands = await brandModuleService.createBrands(input.brands);

    return new StepResponse(brands, brands);
  },
  async (brands, { container }) => {
    if (!brands) {
      return;
    }

    const brandModuleService: BrandModuleService =
      container.resolve(BRAND_MODULE);

    await brandModuleService.deleteBrands(brands.map((brand) => brand.id));
  }
);

type UpdateBrand = {
  id: string;
  name: string;
};

type UpdateBrandsInput = {
  brands: UpdateBrand[];
};

export const updateBrandsStep = createStep(
  "update-brands-step",
  async ({ brands }: UpdateBrandsInput, { container }) => {
    const brandModuleService: BrandModuleService =
      container.resolve(BRAND_MODULE);

    const prevUpdatedBrands = await brandModuleService.listBrands({
      id: brands.map((brand) => brand.id),
    });

    const updatedBrands = await brandModuleService.updateBrands(brands);

    return new StepResponse(updatedBrands, prevUpdatedBrands);
  },
  async (prevUpdatedBrands, { container }) => {
    if (!prevUpdatedBrands) {
      return;
    }

    const brandModuleService: BrandModuleService =
      container.resolve(BRAND_MODULE);

    await brandModuleService.updateBrands(prevUpdatedBrands);
  }
);

export const syncBrandsFromCmsWorkflow = createWorkflow(
  "sync-brands-from-system",
  () => {
    const brands = retrieveBrandsFromCmsStep();

    const { toCreate, toUpdate } = transform(
      {
        brands,
      },
      (data) => {
        const toCreate: CreateBrand[] = [];
        const toUpdate: UpdateBrand[] = [];

        data.brands.forEach((brand) => {
          if (brand.external_id) {
            toUpdate.push({
              id: brand.external_id as string,
              name: brand.name as string,
            });
          } else {
            toCreate.push({
              name: brand.name as string,
            });
          }
        });

        return { toCreate, toUpdate };
      }
    );

    const created = createBrandsStep({ brands: toCreate });
    const updated = updateBrandsStep({ brands: toUpdate });

    return new WorkflowResponse({
      created,
      updated,
    });
  }
);
