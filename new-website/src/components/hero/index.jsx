import React from "react";
import { Container } from "@material-ui/core";
import Img from "gatsby-image";
import { makeStyles } from "@material-ui/core";

const useStyle = makeStyles({
    container: {
        display: "flex",
        alignItems: "center",
        width: "100%",
    },
    overlay: {
        textAlign: "center",
        position: "absolute",
        left: "0",
        right: "0",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        position: "absolute",
        top: "0",
        left: "0",
        width: "100%",
        zIndex: "-1",
        height: props => props.height || "80vh",
        "& > img": {
            objectFit: props => `${props.fit || "cover"} !important`,
            objectPosition: props => `${props.position || "50% 50%"} !important`,
            fontFamily: props =>
                `object-fit: ${props.fit || "cover"} !important; object-position: ${
                    props.position || "50% 50%"
                } !important`,
        },
    },
});

const Hero = ({ children, fluid }) => {
    const classes = useStyle(fluid);
    return (
        <div className={classes.container}>
            <Img className={classes.image} fluid={fluid} />
            <Container maxWidth="md" className={classes.overlay}>
                {children}
            </Container>
        </div>
    );
};

export default Hero;
