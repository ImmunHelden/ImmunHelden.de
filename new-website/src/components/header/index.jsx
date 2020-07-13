import React from "react";
import { AppBar } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Logo from "./logo";
import { MobileHeader } from "./mobile";

const Header = () => {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up("sm"));
    return (
        <AppBar position="absolute" style={{ backgroundColor: "transparent" }} elevation={0}>
            {matches ? <Logo /> : <MobileHeader />}
        </AppBar>
    );
};

export default Header;
