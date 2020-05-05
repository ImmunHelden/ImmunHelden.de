import React from "react"
import { Grid } from "@material-ui/core"
import { Box } from "./Box"
import { renderWithLink } from "./LinkBox"

export const ThreeBoxes = ({ items }) => {
    return (
        <Grid container xs={12} justify="center">
            {items.map(({ image, text, link }, i) => (
                <Grid item xs={12} lg={3} xl={2}>
                    {link ? renderWithLink(link, <Box image={image} text={text} />) : <Box image={image} text={text} />}
                </Grid>
            ))}
        </Grid>
    )
}
