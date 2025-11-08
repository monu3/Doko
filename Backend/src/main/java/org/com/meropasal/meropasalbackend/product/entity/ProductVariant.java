package org.com.meropasal.meropasalbackend.product.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

/**
 * Created On : 2025 24 Sep 12:45 PM
 * Author : Monu Siddiki
 * Description : 
 **/
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ProductVariant {

    private String name;
    private List<String> values;

}
