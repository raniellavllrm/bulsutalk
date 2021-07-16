import { createMuiTheme } from "@material-ui/core";
const theme = createMuiTheme({
  palette: {
    common: { black: "#000", white: "#fff" },
    background: {
      paper: "rgba(251, 251, 248, 1)",
      default: "rgba(240, 242, 245, 1)",
    },
    primary: {
      light: "rgba(171, 45, 54, 1)",
      main: "rgba(171, 45, 54, 1)",
      dark: "rgba(253, 86, 97, 1)",
      contrastText: "#fff",
    },
    secondary: {
      light: "rgba(255, 197, 66, 1)",
      main: "rgba(255, 197, 66, 1)",
      dark: "rgba(255, 210, 110, 1)",
      contrastText: "rgba(255, 255, 255, 1)",
    },
    error: {
      light: "#e57373",
      main: "#f44336",
      dark: "#d32f2f",
      contrastText: "#fff",
    },
    text: {
      primary: "rgba(0, 0, 0, 0.87)",
      secondary: "rgba(0, 0, 0, 0.54)",
      disabled: "rgba(0, 0, 0, 0.38)",
      hint: "rgba(0, 0, 0, 0.38)",
    },
  },
});
export default theme;
