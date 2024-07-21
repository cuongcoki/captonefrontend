import ProductPhaseTable from "@/components/shared/dashboard/product-phase/product-phase-table";
import { SearchProductPhaseParams } from "@/types/product-phase.type";
import React from "react";

export default function page({
  searchParams,
}: {
  searchParams: SearchProductPhaseParams;
}) {
  searchParams.PageIndex = searchParams.PageIndex || 1;
  searchParams.PageSize = searchParams.PageSize || 10;
  searchParams.SearchCompany = searchParams.SearchCompany || "";
  searchParams.SearchPhase = searchParams.SearchPhase || "";
  searchParams.SearchProduct = searchParams.SearchProduct || "";

  return (
    <div>
      <ProductPhaseTable searchParams={searchParams} />
    </div>
  );
}
