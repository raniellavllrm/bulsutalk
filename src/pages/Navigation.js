import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import logo from ".././assets/images/icon.svg";
import { Link } from "react-router-dom";
import {
  List,
  Typography,
  Divider,
  IconButton,
  Toolbar,
  AppBar,
  CssBaseline,
  Avatar,
  Drawer,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
//icons
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import GroupIcon from '@material-ui/icons/Group';
import AccountCircle from "@material-ui/icons/AccountCircle";
import SearchIcon from "@material-ui/icons/Search";
import MoreIcon from "@material-ui/icons/MoreVert";
import HomeIcon from "@material-ui/icons/Home";
import NotifIcon from "@material-ui/icons/Notifications";
import ExitIcon from "@material-ui/icons/ExitToApp";
import firebase from "../utils/firebase";
import MenuIcon from "@material-ui/icons/Menu";

const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  drawerIcon: {
    float: "right",
    margin: "auto",
    marginRight: 3,
  },
}));
const db = firebase.firestore();
export default function Navigation() {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [avatar, setAvatar] = useState({
    src: null,
  });

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const [userProfile, setUserProfile] = useState({
    firstName: "",
    lastName: "",
    bioDesc: "",
    locDesc: "",
    userName: "",
    displayPicture: false
  });
  const signout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => { })
      .catch((error) => { });
  };

  useEffect(() => {
    const currentUser = firebase.auth().currentUser;
    let abortController = new AbortController();
    const fetchData = () => {
      db.collection("users")
        .doc(currentUser.uid)
        .get()
        .then((doc) => {
          if (doc.exists) {
            setUserProfile({
              userName: doc.data().username,
              firstName: doc.data().firstName,
              lastName: doc.data().lastName,
              bioDesc: doc.data().bioDesc,
              locDesc: doc.data().locDesc,
              displayPicture: doc.data().profilePic
            });
            if (doc.data().profilePic) {
              fetchAvatar();
            }
          }

        })
        .catch((err) => { });
    };
    const fetchAvatar = () => {
      const currentUser = firebase.auth().currentUser;
      var storageRef = firebase.storage().ref();
      storageRef
        .child("images/" + currentUser.uid)
        .getDownloadURL()
        .then((url) => {
          setAvatar({
            src: url,
          });
        });
    };
    fetchData();
    return () => {
      abortController.abort();
    };
  }, []);

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        elevation={0}
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
        color="primary"
      >
        <Toolbar>
          <IconButton
            color="inherit"
            component="span"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <div id="searchText">
            <IconButton aria-label="search" color="inherit">
              <SearchIcon />
            </IconButton>
            <IconButton
              aria-label="display more actions"
              edge="end"
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <img id="appbarLogo" src={logo} alt="BulsuTalk Logo"></img>
          <div className={classes.drawerIcon}>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "ltr" ? (
                <ChevronLeftIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </IconButton>
          </div>
        </div>
        <div id="center">
          <Avatar
            src={avatar.src || ".././assets/images/profile.png"}
            id="profile"
          ></Avatar>
        </div>
        <Typography variant="h6" noWrap id="name">
          {userProfile.firstName} {userProfile.lastName}
        </Typography>
        <Typography variant="subtitle1" noWrap id="email">
          @{userProfile.userName}
        </Typography>
        <List>
          <ListItem button component={Link} to={"/profile"}>
            <ListItemIcon>
              <AccountCircle color="primary" />
            </ListItemIcon>
            <ListItemText>My Profile</ListItemText>
          </ListItem>
          <ListItem button component={Link} to={"/home"}>
            <ListItemIcon>
              <HomeIcon color="primary" />
            </ListItemIcon>
            <ListItemText>Home</ListItemText>
          </ListItem>
          <ListItem button component={Link} to={"/notification"}>
            <ListItemIcon>
              <NotifIcon color="primary" />
            </ListItemIcon>
            <ListItemText>Notifications</ListItemText>
          </ListItem>
          <ListItem button component={Link} to={"/friends"}>
            <ListItemIcon>
              <GroupIcon color="primary" />
            </ListItemIcon>
            <ListItemText>Friends</ListItemText>
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem button onClick={signout}>
            <ListItemIcon>
              <ExitIcon color="primary" />
            </ListItemIcon>
            <ListItemText>Log Out</ListItemText>
          </ListItem>
        </List>
      </Drawer>
    </div>
  );
}
