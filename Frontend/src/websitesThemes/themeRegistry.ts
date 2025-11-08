// src/websitesThemes/themeRegistry.ts
import FashionLayout from "./themes/fashionlayout";
import DefaultThemeWrapper from "./themes/defaulttheme";
import EarringLayout from "./themes/earringLayout";
import ElectronicLayout from "./themes/electronicLayout";
import CosmeticsLayout from "./themes/cosmeticsLayout";
import FashionLayout1 from "./themes/fashionlayout1";
import ShoesLayout from "./themes/shoesLayout";
import PlantLayout from "./themes/plantLayout";

const ThemeRegistry = {
  default: {
    Layout: DefaultThemeWrapper,
    config: {
      // Theme-specific configuration
      primaryColor: "#ee4444",
    },
  },
  fashion: {
    Layout: FashionLayout,
    config: {
      // Theme-specific configuration
      primaryColor: "#ff3366",
    },
  },
  fashion1: {
    Layout: FashionLayout1,
    config: {
      // Theme-specific configuration
      primaryColor: "#ff3366",
    },
  },
  electronic: {
    Layout: ElectronicLayout,
    config: {
      // Theme-specific configuration
      primaryColor: "#ff3366",
    },
  },
  cosmetics: {
    Layout: CosmeticsLayout,
    config: {
      // Theme-specific configuration
      primaryColor: "#ff3366",
    },
  },
  plant: {
    Layout: PlantLayout,
    config: {
      // Theme-specific configuration
      primaryColor: "#ff3366",
    },
  },
  shoes: {
    Layout: ShoesLayout,
    config: {
      // Theme-specific configuration
      primaryColor: "#ff3366",
    },
  },
  earring: {
    Layout: EarringLayout,
    config: {
      // Theme-specific configuration
      primaryColor: "#ff3366",
    },
  },
  // Add other themes
};

export type ThemeKey = keyof typeof ThemeRegistry;
export default ThemeRegistry;
