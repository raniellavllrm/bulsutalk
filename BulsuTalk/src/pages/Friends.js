import React, { useState, useEffect } from "react";
import Navigation from "./Navigation";
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
    avatarColor: {
        backgroundColor: "#ffc542"
    }
}));
export default function Friends() {
    const classes = useStyles();
    const [userFriends, setFriends] = useState({
        friends: null,
    });
    useEffect(() => {
        const db = firebase.firestore();
        const getUser = db.collection("users");
        let abortController = new AbortController();
        const fetchData = () => {
            const currentUser = firebase.auth().currentUser;
            getUser
                .onSnapshot((snapshot) => {
                    let friends = [];
                    snapshot.forEach((doc) => {
                        if (doc.data().id !== currentUser.uid) {
                            friends.unshift({ ...doc.data(), id: doc.id });
                        }
                    });
                    setFriends({ friends: friends });
                });
        };
        fetchData();
        return () => {
            setFriends({ friends: null });
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
                        Friends from this Application:
                    </Typography>
                    <List>
                        {userFriends.friends &&
                            userFriends.friends.map((friends) => {
                                return (
                                    <Card
                                        variant="outlined"
                                        id="cardField"
                                        elevation={1}
                                        key={friends.id}
                                    >
                                        <Grid container wrap="nowrap" spacing={2}>
                                            <Grid item>
                                                <Avatar className={classes.avatarColor}>{friends.firstName[0] + friends.lastName[0]}</Avatar>
                                            </Grid>
                                            <Grid item xs zeroMinWidth>
                                                <div id="thisPost">
                                                    <Typography variant="subtitle1">
                                                        {friends.firstName + " " + friends.lastName}
                                                    </Typography>
                                                    <Typography variant="subtitle2">
                                                        {friends.username}
                                                    </Typography>
                                                </div>
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
