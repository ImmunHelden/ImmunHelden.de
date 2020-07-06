import React from "react";
import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

const useStyle = makeStyles(() => ({
    button: {
        width: "370px",
        height: "70px",
        borderRadius: "90px",
        fontWeight: "800",
        fontSize: "18px",
        lineHeight: "46px",
        marginTop: "50px",
    },
}));

const HeroButton = ({ children }) => {
    const classes = useStyle();
    return (
        <Button color="primary" variant="contained" className={classes.button}>
            {children}
        </Button>
    );
};

export default HeroButton;
