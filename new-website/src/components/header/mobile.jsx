import React from "react";
import { makeStyles } from "@material-ui/styles";
import LogoSVG from "../../images/svg/logo.svg";
import { Toolbar } from "@material-ui/core";

const useStyles = makeStyles(() => ({
    container: {
        backgroundColor: "white",
    },
}));

export const MobileHeader = () => {
    const classes = useStyles();
    return (
        <Toolbar className={classes.container}>
            <LogoSVG height="50" width="90" />
        </Toolbar>
    );
};

