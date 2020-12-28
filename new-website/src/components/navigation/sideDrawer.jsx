import * as React from "react"
import { useState } from "react"
import { Link } from "gatsby"
import { Drawer, IconButton, List} from "@material-ui/core"
import { Menu } from "@material-ui/icons"
import { makeStyles } from "@material-ui/core/styles"
const useStyles = makeStyles({
  list: {
    width: 250,
  },
  linkText: {
    textDecoration: `none`,
    textTransform: `uppercase`,
    color: `black`,
    display: "block",
    textAlign: "center",
    fontWeight: "800",
    fontFamily: "Raleway",
    paddingTop: "20px"
  },
  iconmenue: {
    float: "right",
    backgroundColor: "white"
  }
})

  const SideDrawer = ({ navLinks }) => {
    const classes = useStyles();
    const [state, setState] = useState({ right: false }) 
    const toggleDrawer = (anchor, open) => (event) => {
      if (
        event.type === "keydown" &&
        (event.key === "Tab" || event.key === "Shift")
      ) {
        return
      }
      setState({ [anchor]: open })
    }
    const sideDrawerList = anchor => (
      <div
        className={classes.list}
        role="presentation"
        onClick={toggleDrawer(anchor, false)}
        onKeyDown={toggleDrawer(anchor, false)}
      >
        <List component="nav">
          {navLinks.map(({ title, path }) => (
            <Link to={path} key={title} className={classes.linkText}>{title}
            </Link>
          ))}
        </List>
      </div>
    );
    return (
        <React.Fragment>
        <IconButton className={classes.iconmenue} edge="start" aria-label="menu" onClick={toggleDrawer("right", true)}>
          <Menu />
        </IconButton>
        <Drawer
          anchor="right"
          open={state.right}
          onOpen={toggleDrawer("right", true)}
          onClose={toggleDrawer("right", false)}
        >
        {sideDrawerList("right")}
        </Drawer>
      </React.Fragment>
      
    )
  }
  export default SideDrawer