import React, { useState, useEffect } from "react";
import moment from "moment";
import Navigation from "./Navigation";
import clsx from "clsx";
import firebase from "../utils/firebase";
import { makeStyles } from "@material-ui/core/styles";
import {
  TextField,
  Typography,
  Card,
  CardContent,
  Avatar,
  Grid,
  InputAdornment,
  Divider,
  List,
  IconButton,
  CardActions,
} from "@material-ui/core";
import ReplyIcon from "@material-ui/icons/Reply";
import FavoriteIcon from "@material-ui/icons/Favorite";

import ReplyModal from "../components/modals/ReplyModal";

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
  }
}));
export default function Home() {
  const db = firebase.firestore();
  const currentUser = firebase.auth().currentUser;
  const [replyModal, setReplyModal] = useState(false)
  const classes = useStyles();
  const [userPosts, setPosts] = useState({
    posts: null,
  });
  const [userLikes, setLikes] = useState({
    likes: null,
  });

  const [post, setPost] = useState({
    postID: "",
    postContent: "",
  });

  const handleChange = (prop) => (e) => {
    setPost({ ...post, [prop]: e.target.value });
  };


  const checkLike = (postID) => {
    let test = false;
    userLikes.likes && userLikes.likes.forEach((likes) => {
      if (likes.postLiked === postID) {
        test = true;
      }
    })
    return test;
  }
  const likePost = (id, userID) => {
    const increment = firebase.firestore.FieldValue.increment(1);
    const decrement = firebase.firestore.FieldValue.increment(-1);
    if (checkLike(id) === true) {
      db.collection("posts")
        .doc(id)
        .update({
          likes: decrement
        });
      db.collection("users")
        .doc(currentUser.uid)
        .collection("likes")
        .doc(id)
        .delete();
    } else {
      db.collection("posts")
        .doc(id)
        .update({
          likes: increment
        });
      db.collection("users")
        .doc(currentUser.uid)
        .collection("likes")
        .doc(id)
        .set({
          postLiked: id,
        })
      const notifMessage = " liked your post!";
      db.collection("users")
        .doc(userID)
        .collection("notifs")
        .add({
          notifiedPost: id,
          notifContent: profile.userName + notifMessage,
          date_notif: new Date().toISOString(),
          notifAvatar: avatar.src,
          sourceUser: currentUser.uid
        });
    }
  }

  const [openID, setOpenID] = useState(0);
  const replyPost = (postID) => {
    setOpenID(postID);
    setReplyModal(true);
  }

  useEffect(() => {
    let abortController = new AbortController();
    const db = firebase.firestore();
    const currentUser = firebase.auth().currentUser;
    const getUser = db.collection("users").doc(currentUser.uid);
    const fetchData = () => {
      db.collection("posts")
        .orderBy("date_posted")
        .onSnapshot((snapshot) => {
          let posts = [];
          snapshot.forEach((doc) => {
            if (doc.data().postContent.includes("haha")) {
              posts.unshift({ ...doc.data(), id: doc.id });
            }
          });
          setPosts({ posts: posts });
        });
      getUser
        .collection("likes")
        .onSnapshot((snapshot) => {
          let likes = [];
          snapshot.forEach((doc) => {
            likes.unshift({ ...doc.data(), id: doc.id });
          });
          setLikes({ likes: likes });
        });
    };
    fetchData();
    return () => {
      setPosts({ posts: null });
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
          <Card variant="outlined" id="cardField">
            <CardContent>
              <TextField
                variant="standard"
                placeholder="Type something to start searching.."
                className={classes.postTalk}
                fullWidth
                multiline
                inputProps={{
                  maxLength: 140,
                }}
                onChange={handleChange("postContent")}
                value={post.postContent}
                InputProps={{
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
          <List>
            {userPosts.posts &&
              userPosts.posts.map((posts) => {
                return (
                  <Card
                    variant="outlined"
                    id="cardField"
                    elevation={1}
                    key={posts.id}
                  >
                    <Grid container wrap="nowrap" spacing={2}>
                      <Grid item>
                        <Avatar
                          src={posts.imageURL || ".././assets/images/profile.png"}
                        />
                      </Grid>
                      <Grid item xs zeroMinWidth>
                        <div id="thisPost">
                          <Typography variant="body2">
                            {posts.displayName}
                          </Typography>
                          <Typography variant="body2">
                            {posts.userName}
                          </Typography>
                        </div>
                      </Grid>
                      <Grid item>
                        <Typography variant="subtitle2">
                          {moment(posts.date_posted).fromNow()}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container wrap="nowrap" spacing={2}>
                      <Grid item xs zeroMinWidth>
                        <Typography className={classes.textPosts}>{posts.postContent}</Typography>
                      </Grid>
                    </Grid>
                    <Divider className={classes.divider} />
                    <CardActions disableSpacing>
                      <IconButton
                        className={classes.button}
                        onClick={() => replyPost(posts.id)}
                      >
                        <ReplyIcon />
                        <Typography>{posts.replyCount}</Typography>
                      </IconButton>
                      <IconButton
                        color={checkLike(posts.id) === true ? "primary" : "default"}
                        className={classes.button}
                        onClick={() => likePost(posts.id, posts.userID)}
                      >
                        <FavoriteIcon />
                        <Typography> {posts.likes}</Typography>
                      </IconButton>
                    </CardActions>
                  </Card>
                );
              })}
          </List>
          <ReplyModal open={replyModal} setOpen={setReplyModal} postID={openID} />
        </div>
      </main>
    </div>
  );
}
