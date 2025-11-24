import { Suspense } from "react";
import ProductCatalog from "@/sections/ProductCatalog";

export default function ProductsPage() {
  return (
    <Suspense fallback={null}>
      <ProductCatalog />
    </Suspense>
  );
}
