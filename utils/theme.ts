import { lightBlue } from "@material-ui/core/colors";
import { createTheme, responsiveFontSizes } from "@material-ui/core/styles";

export const theme = responsiveFontSizes(
  createTheme({
    palette: {
      primary: {
        main: lightBlue[600],
      },
    },
    typography: {
      h2: {
        lineHeight: 1.2,
        fontWeight: 900,
        margin: "0px 0px 0.35em",
        color: "rgb(45, 55, 72)",
      },
      h3: {
        fontWeight: 700,
        color: "rgb(45, 55, 72)",
        margin: "0px 0px 0.35em",
      },
      h4: {
        color: "rgb(45, 55, 72)",
        lineHeight: 1.235,
        fontWeight: 700,
        margin: "0px 0px 0.25em",
      },
      h5: {
        fontWeight: 500,
      },
      h6: {
        color: "rgb(100, 110, 115)",
        lineHeight: 1.6,
        fontWeight: 500,
      },
      subtitle2: {
        fontSize: "1rem",
        fontWeight: 500,
      },
      body1: {
        fontWeight: 400,
        fontSize: "1rem",
        lineHeight: 1.5,
        color: "rgb(100, 110, 115)",
      },
    },
  })
);
