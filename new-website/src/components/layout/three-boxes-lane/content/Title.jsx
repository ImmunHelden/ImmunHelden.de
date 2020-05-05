import React from "react"
import styled from "styled-components"
import { Grid } from "@material-ui/core"

const TitleComponent = styled.h2`
    font-size: 2.25rem;
    font-weight: 300;
    line-height: 1.3;
    text-align: center;
`

export const Title = ({ title }) => {
    return (
        <Grid item xs={12}>
            <TitleComponent>{title}</TitleComponent>
        </Grid>
    )
}
