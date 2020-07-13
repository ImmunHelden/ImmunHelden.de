import React from "react";
import { makeStyles } from "@material-ui/styles";
import LogoSVG from "../../images/svg/logo.svg";
import { Container } from "@material-ui/core";

const useStyles = makeStyles(() => ({
    container: {
        backgroundColor: "white",
        width: "188px",
        height: "110px",
        textAlign: "center",
        marginLeft: "calc(100% / 4.5)",
        borderRadius: "0 0 10px 10px",
    },
    logo: {
        width: "133px",
        height: "82px",
        top: "10px",
        position: "relative",
    },
}));

function Logo() {
    const classes = useStyles();

    return (
        <div className={classes.container}>
            <LogoSVG className={classes.logo} />
        </div>
    );
}

export default Logo;
