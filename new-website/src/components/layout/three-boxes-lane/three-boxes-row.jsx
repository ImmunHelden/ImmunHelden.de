import React from "react"
import { Grid } from "@material-ui/core"
import { ThreeBoxes } from "./content/ThreeBoxes"
import { Title } from "./content/Title"

export const ThreeBoxesRow = ({ title, items }) => {
    return (
        <Grid container spacing={3}>
            <Title title={title} />
            <ThreeBoxes items={items} />
        </Grid>
    )
}
