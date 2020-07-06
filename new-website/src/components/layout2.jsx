import React from "react"
import { ThemeProvider, makeStyles } from "@material-ui/core"
import theme from "../theme"
import Header from "./header"

const useStyles = makeStyles(() => {
    container: {
    }
})

const LayoutFancy = props => {
    const classes = useStyles()

    return (
        <ThemeProvider theme={theme}>
            <Header />
            <main>{props.children}</main>
        </ThemeProvider>
    )
}

export default LayoutFancy
