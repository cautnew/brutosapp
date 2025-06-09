import { red } from "@material-ui/core/colors";
import { createTheme } from "@material-ui/core/styles";
// A custom theme for this app
const theme = createTheme({
  palette: {
    type: "light",
    primary: {
      main: "#f4511e",
      light: "#ff844c",
      dark: "#b91400",
    },
    secondary: {
      main: "#fafafa",
      light: "#ffffff",
      dark: "#c7c7c7",
    },
    error: {
      main: red.A400,
    },
  },
  overrides: {
    MuiPaper: {
      root: {
        padding: "20px 10px",
        margin: "10px",
        backgroundColor: "#fff", // 5d737e
      },
    },
    MuiButton: {
      root: {
        margin: "5px",
      },
    },
  },
});
export default theme;
