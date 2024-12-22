import { useEffect } from "react";

import {
  DEFAULT_THEME,
  MantineThemeOverride,
  mergeMantineTheme,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";

const brandTheme: MantineThemeOverride = {
  colors: {
    "brand-": [
      "#D6E4F9",
      "#ADC9F3",
      "#84AFED",
      "#5A94E7",
      "#3079E1",
      "#095FDC",
      "#084DB1",
      "#063B87",
      "#04285C",
      "#021633",
    ],
  },
  primaryColor: "brand-",
  primaryShade: 5,
  fontFamily: "Poppins, sans-serif",
  headings: {
    fontFamily: "Poppins, sans-serif",
    fontWeight: "700",
  },
};

const darkTheme: MantineThemeOverride = {
  colors: {
    "brand-": [
      "#1B2C46",
      "#1A2940",
      "#17253B",
      "#152236",
      "#121D30",
      "#0F182A",
      "#0D1524",
      "#0A101E",
      "#080C19",
      "#050814",
    ],
  },
  primaryColor: "brand-",
  primaryShade: 5,
  fontFamily: "Poppins, sans-serif",
  headings: {
    fontFamily: "Poppins, sans-serif",
    fontWeight: "700",
  },
};

export const useTheme = () => {
  const [darkMode, setDarkMode] = useLocalStorage<boolean | undefined>({
    key: "darkMode",
    defaultValue: undefined,
  });

  useEffect(() => {
    if (darkMode === undefined) {
      const isDarkMode =
        window?.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      setDarkMode(isDarkMode);
    }
  }, []);

  return {
    theme: mergeMantineTheme(DEFAULT_THEME, darkMode ? darkTheme : brandTheme),
    darkMode,
    setDarkMode,
  };
};
