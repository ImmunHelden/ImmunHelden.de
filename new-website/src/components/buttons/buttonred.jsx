import React from "react"
import { makeStyles, Button} from "@material-ui/core"


const useStyles = makeStyles(theme => ({
    button: {
      borderRadius: 90,
      backgroundColor: "#FC4141",
      color: "white",
      paddingLeft: 60,
      paddingRight: 60,
      paddingTop: 10,
      paddingBottom: 10,
      margin:"auto",
      fontSize: 18,
      fontWeight: 800,
      display: "flex",
      "&:hover":{
        backgroundColor: "#FC4141"
      }
    }
}))

export default function Buttonred({ children }) {
  const classes = useStyles()
  return(
   <Button  className={classes.button}  >{children}</Button>
)
}
