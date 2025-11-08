// src/websitesThemes/ThemeLoader.tsx
import { Suspense, ComponentType } from "react";
import { RootState } from "@/store";
import ThemeRegistry, { ThemeKey } from "./themeRegistry";
import { useAppSelector } from "@/hooks";
import DefaultThemeWrapper from "./themes/defaulttheme";

const ThemeLoader = () => {
  const shop = useAppSelector((state: RootState) => state.shop.shop);

  if (!shop?.theme) return <div>Loading theme...12334</div>;

  const SelectedTheme = ThemeRegistry[shop.theme as ThemeKey]?.Layout as ComponentType<any> | undefined;

  return (
    <Suspense fallback={<div>Loading theme...</div>}>
      {/* <SelectedTheme /> */}
      {SelectedTheme ? <SelectedTheme shop={shop} /> : <DefaultThemeWrapper />}
    </Suspense>
  );
};

export default ThemeLoader;
