import React, { useState, useEffect } from "react";
import moment from "moment";
import Navigation from "../pages/Navigation";
import clsx from "clsx";
import firebase from "../utils/firebase";
import { makeStyles } from "@material-ui/core/styles";
import {
    Typography,
    Card,
    Avatar,
    Grid,
    List,
} from "@material-ui/core";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
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
    drawerHeader: {
        display: "flex",
        alignItems: "center",
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        marginBottom: 2,
    },
    divider: {
        marginTop: 1,
        marginBottom: 1,
    },
    cardField: {
        marginLeft: 40,
        marginRight: 40,
    },
    input: {
        display: "none",
    },
    textPosts: {
        paddingBottom: 10
    },
    largeAvatar: {
        width: 50,
        height: 50
    },
    text: {
        fontSize: 15,
        fontWeight: "bold"
    }
}));
export default function Notification() {
    const classes = useStyles();
    const [userNotifs, setNotifs] = useState({
        notifs: null,
    });
    useEffect(() => {
        const db = firebase.firestore();
        const currentUser = firebase.auth().currentUser;
        const getUser = db.collection("users").doc(currentUser.uid);
        let abortController = new AbortController();
        const fetchData = () => {
            const currentUser = firebase.auth().currentUser;
            getUser
                .collection("notifs")
                .onSnapshot((snapshot) => {
                    let notifs = [];
                    snapshot.forEach((doc) => {
                        if (doc.data().sourceUser !== currentUser.uid) {
                            notifs.unshift({ ...doc.data(), id: doc.id });
                        }
                    });
                    setNotifs({ notifs: notifs });
                });
        };
        fetchData();
        return () => {
            setNotifs({ notifs: null });
            abortController.abort();
        };
    }, []);
    return (
        <div>
            <Navigation />
            <main>
                <div
                    className={clsx(classes.content, {
                        [classes.contentShift]: true,
                    })}
                >
                    <div className={classes.drawerHeader} />
                    <Typography variant="h6" id="cardField">
                        Notifications:
                    </Typography>
                    <List>
                        {userNotifs.notifs &&
                            userNotifs.notifs.map((notifs) => {
                                return (
                                    <Card
                                        variant="outlined"
                                        id="cardField"
                                        elevation={1}
                                        key={notifs.id}
                                    >
                                        <Grid container wrap="nowrap" spacing={2}>
                                            <Grid item>
                                                <Avatar className={classes.largeAvatar}
                                                    src={notifs.notifAvatar || ".././assets/images/profile.png"}
                                                />
                                            </Grid>
                                            <Grid item xs zeroMinWidth>
                                                <div id="thisPost">
                                                    <Typography variant="subtitle1" className={classes.text}>
                                                        {notifs.notifContent}
                                                    </Typography>
                                                </div>
                                            </Grid>
                                        </Grid>
                                        <Grid container wrap="nowrap" spacing={2}>
                                            <Grid item xs zeroMinWidth>
                                                <Typography variant="subtitle2">
                                                    {moment(notifs.date_notif).fromNow()}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Card>
                                );
                            })}
                    </List>
                </div>
            </main>
        </div>
    );
}
