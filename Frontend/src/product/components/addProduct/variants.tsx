"use client";

import { Plus, X, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Product } from "@/product/types/product";
import {
  ProductVariantData,
  parseVariantData,
  validateVariantData,
} from "@/product/types/product";
import { useState, useEffect, useCallback, useRef } from "react";

interface VariantsProps {
  data: Partial<Product>;
  onValueChange: (values: Partial<Product>) => void;
}

export function Variants({ data, onValueChange }: VariantsProps) {
  const [variantData, setVariantData] = useState<ProductVariantData>({
    variants: [],
  });
  const [hasVariants, setHasVariants] = useState<boolean>(
    data.hasVariants || false
  );
  const isInitialized = useRef(false);

  // Initialize from parent data once
  useEffect(() => {
    if (!isInitialized.current && data.variantData) {
      const parsedData = parseVariantData(data.variantData);
      setVariantData(parsedData);
      setHasVariants(data.hasVariants || false);
      isInitialized.current = true;
    }
  }, [data.variantData, data.hasVariants]);

  // Update parent immediately when variant data or hasVariants changes
  const updateParent = useCallback(
    (newVariantData: ProductVariantData, newHasVariants: boolean) => {
      const shouldHaveVariants =
        newHasVariants &&
        newVariantData.variants.length > 0 &&
        newVariantData.variants.some((v) => v.values.length > 0);

      const finalHasVariants = shouldHaveVariants;

      onValueChange({
        hasVariants: finalHasVariants,
        variantData: finalHasVariants ? JSON.stringify(newVariantData) : null,
      });
    },
    [onValueChange]
  );

  useEffect(() => {
    if (isInitialized.current) {
      updateParent(variantData, hasVariants);
    }
  }, [variantData, hasVariants, updateParent]);

  // Handle toggle ON/OFF
  const handleHasVariantsToggle = (checked: boolean) => {
    setHasVariants(checked);
    if (!checked) {
      // Disable variants → reset and inform parent
      setVariantData({ variants: [] });
      onValueChange({
        hasVariants: false,
        variantData: null,
      });
    } else {
      // Enable variants → inform parent immediately
      onValueChange({
        hasVariants: true,
        variantData: JSON.stringify({ variants: [] }),
      });
    }
  };

  // Variant handlers
  const addVariant = () => {
    const newVariants = [...variantData.variants, { name: "", values: [""] }];
    setVariantData({ variants: newVariants });
  };

  const updateVariantName = (index: number, name: string) => {
    const newVariants = [...variantData.variants];
    newVariants[index] = { ...newVariants[index], name: name.trim() };
    setVariantData({ variants: newVariants });
  };

  const addVariantValue = (variantIndex: number) => {
    const newVariants = [...variantData.variants];
    newVariants[variantIndex].values.push("");
    setVariantData({ variants: newVariants });
  };

  const updateVariantValue = (
    variantIndex: number,
    valueIndex: number,
    value: string
  ) => {
    const newVariants = [...variantData.variants];
    newVariants[variantIndex].values[valueIndex] = value.trim();
    setVariantData({ variants: newVariants });
  };

  const removeVariant = (index: number) => {
    const newVariants = variantData.variants.filter((_, i) => i !== index);
    setVariantData({ variants: newVariants });
    if (newVariants.length === 0) {
      setHasVariants(false);
      onValueChange({
        hasVariants: false,
        variantData: null,
      });
    }
  };

  const removeVariantValue = (variantIndex: number, valueIndex: number) => {
    const newVariants = [...variantData.variants];
    newVariants[variantIndex].values = newVariants[variantIndex].values.filter(
      (_, i) => i !== valueIndex
    );
    setVariantData({ variants: newVariants });
  };

  // Validation checks
  const validation = validateVariantData(variantData);
  const hasValidVariants =
    variantData.variants.length > 0 &&
    variantData.variants.every(
      (v) =>
        v.name.trim() &&
        v.values.length > 0 &&
        v.values.every((val) => val.trim())
    );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium">Product Variants</h2>
        <p className="text-sm text-muted-foreground">
          Add variants like size, color, etc. to offer different options for
          your product.
        </p>
      </div>

      {/* Enable/Disable Variants */}
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div>
          <Label htmlFor="has-variants" className="text-base font-medium">
            Enable Variants
          </Label>
          <p className="text-sm text-muted-foreground">
            {hasVariants
              ? "Variant options are enabled. Add variant types below."
              : "Turn on to add variant options like size, color, etc."}
          </p>
        </div>
        <Switch
          id="has-variants"
          checked={hasVariants}
          onCheckedChange={handleHasVariantsToggle}
        />
      </div>

      {hasVariants && (
        <div className="space-y-4">
          {/* Variants List */}
          {variantData.variants.map((variant, variantIndex) => (
            <div
              key={variantIndex}
              className="space-y-4 p-4 border rounded-lg bg-gray-50"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 space-y-2">
                  <Label htmlFor={`variant-${variantIndex}-name`}>
                    Variant Name *
                  </Label>
                  <Input
                    id={`variant-${variantIndex}-name`}
                    placeholder="e.g., Color, Size, Material"
                    value={variant.name}
                    onChange={(e) =>
                      updateVariantName(variantIndex, e.target.value)
                    }
                    className="font-medium"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeVariant(variantIndex)}
                  className="ml-4 mt-6"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Variant Values *</Label>
                <div className="space-y-2">
                  {variant.values.map((value, valueIndex) => (
                    <div key={valueIndex} className="flex items-center gap-2">
                      <Input
                        placeholder="e.g., Red, Blue, Small, Large"
                        value={value}
                        onChange={(e) =>
                          updateVariantValue(
                            variantIndex,
                            valueIndex,
                            e.target.value
                          )
                        }
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          removeVariantValue(variantIndex, valueIndex)
                        }
                        disabled={variant.values.length <= 1}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => addVariantValue(variantIndex)}
                >
                  <Plus className="h-4 w-4" />
                  Add Value
                </Button>
              </div>
            </div>
          ))}

          {/* Add Variant Button */}
          <Button
            variant="outline"
            className="gap-2 w-full"
            onClick={addVariant}
            disabled={!hasVariants}
          >
            <Plus className="h-4 w-4" />
            Add Variant Option
          </Button>

          {/* Variant Summary */}
          {hasValidVariants && validation.isValid && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-800 mb-2">
                <CheckCircle className="h-4 w-4" />
                <span className="font-medium">Variant Setup Complete</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
