import React from "react";
import { AppBar, Toolbar } from "@material-ui/core";
import Logo from "./logo";

const Header = () => {
    return (
        <AppBar position="absolute" style={{ backgroundColor: "transparent" }} elevation={0}>
            <Toolbar>
                <Logo />
            </Toolbar>
        </AppBar>
    );
};

export default Header;
