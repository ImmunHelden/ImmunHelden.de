import { createMuiTheme } from "@material-ui/core/styles";
import { red } from "@material-ui/core/colors";

// Create a theme instance.
const theme = createMuiTheme({
    palette: {
        primary: {
            main: "#ec5044",
            light: "#ff8370",
            dark: "#b3131c",
        },
        error: {
            main: red.A400,
        },
        background: {
            default: "#fff",
        },
    },
    typography: {
        h2: {
            fontWeight: "800",
            fontSize: "2rem",
            lineHeight: "3rem",
            textTransform: "uppercase",
        },
    },
});

export default theme;
