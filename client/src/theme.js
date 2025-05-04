// theme.js
import { createTheme } from "@mui/material/styles";

const palette = {
  primary: {
    main: "#1976d2",
    light: "#e3f2fd",
    contrastText: "#fff",
  },
  secondary: {
    main: "#ff9800",
    light: "#fff3e0",
    contrastText: "#000",
  },
  warning: {
    main: "#ffb300",
    light: "#fff8e1",
    contrastText: "#000",
  },
  info: {
    main: "#0288d1",
    light: "#e1f5fe",
    contrastText: "#000",
  },
  success: {
    main: "#4caf50",
    light: "#e8f5e9",
    contrastText: "#000",
  },
  error: {
    main: "#f44336",
    light: "#ffebee",
    contrastText: "#000",
  },
  background: {
    default: "#fafafa",
    paper: "#fff",
  },
  action: {
    hover: "#f5f5f5",
  },
};

const typography = {
  fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
  h4: { fontWeight: 600 },
  h6: { fontWeight: 500 },
  button: { textTransform: "none", fontWeight: 600 },
};

const shape = { borderRadius: 8 };

const components = {
  MuiCard: {
    styleOverrides: {
      root: { borderRadius: shape.borderRadius, transition: "box-shadow 0.2s" },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        boxShadow: "none",
        "&:hover": { boxShadow: "0 2px 8px rgba(0,0,0,0.15)" },
      },
    },
  },
  MuiDialog: {
    styleOverrides: { paper: { borderRadius: shape.borderRadius } },
  },
};

const theme = createTheme({ palette, typography, shape, components });
export default theme;
