package org.com.meropasal.meropasalbackend.product.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

/**
 * Created On : 2025 24 Sep 12:47 PM
 * Author : Monu Siddiki
 * Description :
 **/

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ProductVariantData {

    private List<ProductVariant> variants;

    // Helper methods
    public boolean isEmpty() {
        return variants == null || variants.isEmpty();
    }
}
