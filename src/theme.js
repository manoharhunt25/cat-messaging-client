import { extendTheme } from "@chakra-ui/react";

// Caterpillar brand colours: Golden Poppy, black and white.
export const BRAND = {
  yellow: "#FFC500",
  black: "#000000",
  white: "#FFFFFF",
};

const theme = extendTheme({
  colors: {
    // Full scale so Chakra components can use colorScheme="cat".
    cat: {
      50: "#FFF9E0",
      100: "#FFEFB3",
      200: "#FFE380",
      300: "#FFD84D",
      400: "#FFCE26",
      500: BRAND.yellow,
      600: "#E0AD00",
      700: "#B38A00",
      800: "#806300",
      900: "#4D3B00",
    },
    ink: {
      50: "#F5F5F5",
      100: "#E8E8E8",
      200: "#D1D1D1",
      300: "#B0B0B0",
      400: "#888888",
      500: "#5C5C5C",
      600: "#3D3D3D",
      700: "#262626",
      800: "#141414",
      900: BRAND.black,
    },
  },
  fonts: {
    heading: `'Roboto Condensed', 'Arial Narrow', sans-serif`,
    body: `'Roboto', 'Segoe UI', sans-serif`,
  },
  styles: {
    global: {
      body: {
        bg: "ink.50",
        color: "ink.900",
      },
    },
  },
  components: {
    Button: {
      baseStyle: { fontWeight: "700", borderRadius: "md" },
      variants: {
        // Yellow button with black text, the main call to action.
        brand: {
          bg: "cat.500",
          color: "black",
          _hover: { bg: "cat.400", _disabled: { bg: "cat.500" } },
          _active: { bg: "cat.600" },
        },
        // Black button with yellow text, for secondary actions.
        dark: {
          bg: "black",
          color: "cat.500",
          _hover: { bg: "ink.700" },
          _active: { bg: "ink.800" },
        },
      },
    },
    Input: {
      defaultProps: { focusBorderColor: "cat.500" },
    },
    Tabs: {
      variants: {
        brand: {
          tablist: {
            bg: "ink.100",
            borderRadius: "full",
            p: "4px",
          },
          tab: {
            borderRadius: "full",
            fontWeight: "700",
            color: "ink.600",
            _selected: { bg: "black", color: "cat.500" },
          },
        },
      },
    },
    Modal: {
      baseStyle: {
        header: {
          fontFamily: "heading",
          textTransform: "uppercase",
          letterSpacing: "0.02em",
          borderTop: "6px solid",
          borderColor: "cat.500",
          borderTopRadius: "md",
        },
      },
    },
  },
});

export default theme;
