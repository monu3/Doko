import { useState } from "react";
import { FooterDefault } from "./components/footer";
import HeaderDefault from "./components/header";

function DefaultThemeWrapper() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(
    undefined
  );

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
  };

  return (
    <div>
      <HeaderDefault
        onCategorySelect={handleCategorySelect}
        selectedCategory={selectedCategoryId}
      />
      {/* <ProductListPage /> */}
      <FooterDefault />
    </div>
  );
}
export default DefaultThemeWrapper;
