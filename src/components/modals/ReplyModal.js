import React, { useState, useEffect } from "react";
import moment from "moment";
import firebase from "../../utils/firebase";
import {
    InputAdornment,
    TextField,
    CardContent,
    Card,
    Divider,
    Avatar,
    Grid,
    Typography,
    Modal,
    IconButton,
    List
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from '@material-ui/icons/Close';
import SendIcon from '@material-ui/icons/Send';
export default function ReplyModal({ open, setOpen, postID }) {
    const db = firebase.firestore();
    const handleClose = () => {
        setOpen(false);
    };
    const useStyles = makeStyles((theme) => ({
        paper: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
        },
        avatar: {
            backgroundColor: theme.palette.secondary.main,
        },
        form: {
            width: "100%", // Fix IE 11 issue.
            marginTop: theme.spacing(1),
        },
        submit: {
            margin: theme.spacing(3, 0, 2),
            height: 50,
            borderRadius: 25,
        },
        signupLink: {
            alignItems: "center",
            justifyContent: "center",
            textDecoration: "none",
        },
        input: {
            display: "none",
        },
        large: {
            width: 120,
            height: 120,
        },
        modalCenter: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: 10,
            paddingBottom: 10
        },
        dateBottom: {
            marginBottom: 8
        },
        textPosts: {
            fontSize: 23
        },
        overFlow: {
            overflowY: "scroll",
            height: 400
        }
    }));
    const [mainPost, setMainPost] = useState({
        userName: "",
        displayName: "",
        postContent: "",
        date_posted: "",
        imageURL: "",
        userID: ""
    });
    const [reply, setReply] = useState({
        postID: "",
        replyID: "",
        replyContent: "",
    });
    const handleChange = (prop) => (e) => {
        setReply({ ...reply, [prop]: e.target.value });
    };
    const [avatar, setAvatar] = useState({
        src: null,
    });
    const [profile, getProfile] = useState({
        userName: "",
        displayName: "",
        displayPicture: true,
    });
    const [postReplies, setPostReplies] = useState({
        replies: null,
    });
    const replyPost = (e) => {
        e.preventDefault();
        const currentUser = firebase.auth().currentUser;
        const increment = firebase.firestore.FieldValue.increment(1);
        const notifMessage = " replied to your post!";
        db.collection("users")
            .doc(mainPost.userID)
            .collection("notifs")
            .add({
                notifiedPost: postID,
                notifContent: profile.userName + notifMessage,
                date_notif: new Date().toISOString(),
                notifAvatar: avatar.src,
                sourceUser: currentUser.uid
            });
        db.collection("reply")
            .add({
                postReplied: postID,
                userID: currentUser.uid,
                userName: profile.userName,
                displayName: profile.displayName,
                replyContent: reply.replyContent,
                date_replied: new Date().toISOString(),
                imageURL: avatar.src
            });

        db.collection("posts")
            .doc(postID).update({
                replyCount: increment
            })
        reply.replyContent = "";
    };
    const SearchButton = () => (
        <IconButton onClick={replyPost}>
            <SendIcon />
        </IconButton>
    )

    useEffect(() => {
        const db = firebase.firestore();
        const fetchData = () => {
            const currentUser = firebase.auth().currentUser;
            if (postID !== 0) {
                db.collection("posts")
                    .doc(postID)
                    .get()
                    .then((doc) => {
                        setMainPost({
                            userID: doc.data().userID,
                            userName: doc.data().userName,
                            displayName: doc.data().displayName,
                            postContent: doc.data().postContent,
                            date_posted: doc.data().date_posted,
                            imageURL: doc.data().imageURL,
                        })
                    })
            }
            db.collection("users")
                .doc(currentUser.uid)
                .get()
                .then((doc) => {
                    if (doc.exists) {
                        getProfile({
                            userName: "@" + doc.data().username,
                            displayName: doc.data().firstName + " " + doc.data().lastName,
                            displayPicture: doc.data().profilePic
                        });
                    }
                    if (doc.data().profilePic === true) {
                        fetchAvatar();
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
        const fetchReply = () => {
            db.collection("reply")
                .orderBy("date_replied")
                .onSnapshot((snapshot) => {
                    if (snapshot) {
                        let reply = [];
                        snapshot.forEach((doc) => {
                            if (doc.data().postReplied === postID) {
                                reply.unshift({ ...doc.data(), id: doc.id });
                            }
                        }
                        );
                        setPostReplies({ replies: reply });
                    } else {
                        console.log("empty")
                    }
                });
        }
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
        fetchReply();
        return () => {
            setPostReplies({ replies: null });
        };
    }, [postID]);
    const classes = useStyles();
    return (
        <Modal
            className={classes.modalCenter}
            open={open}>
            <Card
                variant="outlined"
                id="cardReply"
                elevation={1}
                key={postID}
            >
                <Grid container wrap="nowrap" spacing={2}>
                    <Grid item>
                        <Avatar
                            src={mainPost.imageURL || ".././assets/images/profile.png"}
                        />
                    </Grid>
                    <Grid item xs zeroMinWidth>
                        <div id="thisPost">
                            <Typography variant="body2">
                                {mainPost.displayName}
                            </Typography>
                            <Typography variant="body2">
                                {mainPost.userName}
                            </Typography>
                        </div>
                    </Grid>
                    <Grid item>
                        <IconButton
                            onClick={handleClose}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Grid>
                </Grid>
                <Grid container wrap="nowrap" spacing={2}>
                    <Grid item xs zeroMinWidth>
                        <Typography className={classes.textPosts} id="textPosts">{mainPost.postContent}</Typography>
                        <Typography variant="subtitle2" className={classes.dateBottom} color="primary">
                            {moment(mainPost.date_posted).format('hh:mm A ∙ MMMM DD, YYYY')}
                        </Typography>
                    </Grid>
                </Grid>
                <Divider />
                <div className={classes.overFlow}>
                    <List>
                        {postReplies.replies &&
                            postReplies.replies.map((replies) => {
                                return (
                                    <Card
                                        id="cardReply"
                                        elevation={0}
                                        key={replies.id}
                                    >
                                        <Grid container wrap="nowrap" spacing={2}>
                                            <Grid item>
                                                <Avatar
                                                    src={replies.imageURL || ".././assets/images/profile.png"}
                                                />
                                            </Grid>
                                            <Grid item xs zeroMinWidth>
                                                <div>
                                                    <Typography variant="body2">
                                                        {replies.displayName}
                                                    </Typography>
                                                    <Typography>{replies.replyContent}</Typography>
                                                    <Typography variant="subtitle2">
                                                        {moment(replies.date_replied).fromNow()}
                                                    </Typography>
                                                </div>
                                            </Grid>
                                        </Grid>
                                    </Card>
                                );
                            })}
                    </List>
                </div>
                <CardContent>
                    <TextField
                        variant="standard"
                        placeholder="What's on your mind?"
                        fullWidth
                        multiline
                        onChange={handleChange("replyContent")}
                        value={reply.replyContent}
                        inputProps={{
                            maxLength: 140,
                        }}
                        InputProps={{
                            endAdornment: <SearchButton />,
                            disableUnderline: true,
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Avatar
                                        src={avatar.src || ".././assets/images/profile.png"}
                                    />
                                </InputAdornment>
                            ),
                        }}
                    />
                </CardContent>
            </Card>
        </Modal>
    );
}
