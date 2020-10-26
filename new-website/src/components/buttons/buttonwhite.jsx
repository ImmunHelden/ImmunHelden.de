import React from "react"
import { makeStyles, Button} from "@material-ui/core"


const useStyles = makeStyles(theme => ({
    button: {
      borderRadius: 90,
      backgroundColor: "white",
      color: "#FC4141",
      paddingLeft: 60,
      paddingRight: 60,
      paddingTop: 10,
      paddingBottom: 10,
      margin:"auto",
      fontSize: 18,
      display: "flex",
      "&:hover":{
        backgroundColor: "white"
      }
    }
}))

export default function Buttonwhite({ children }) {
  const classes = useStyles()
  return(
   <Button  className={classes.button}  >{children}</Button>
)
}
