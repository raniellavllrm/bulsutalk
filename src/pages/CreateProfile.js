import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import firebase from "../utils/firebase";
import {
  TextField,
  CssBaseline,
  IconButton,
  Avatar,
  Grid,
  Container,
  Button,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
export default function CreateProfile() {
  const db = firebase.firestore();
  const [image, setImage] = useState({
    fileImage: null,
    progress: 0,
    downloadURL: null,
    displayURL: null,
  });
  const handleImageChange = (e) => {
    e.preventDefault()
    if (e.target.files[0]) {
      setImage({
        fileImage: e.target.files[0],
        displayURL: URL.createObjectURL(e.target.files[0]),
      });
    }
  };
  const handleUpload = () => {
    const currentUser = firebase.auth().currentUser;
    let file = image.fileImage;
    var storage = firebase.storage();
    var storageRef = storage.ref();
    var uploadTask = storageRef.child("images/" + currentUser.uid).put(file);
    uploadTask.on(
      firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) => {
        var progress =
          Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImage({ progress });
      },
      (error) => {
        throw error;
      },
      () => {
        uploadTask.snapshot.ref.getDownloadURL().then((url) => {
          setImage({
            downloadURL: url,
          });
          db.collection("users")
            .doc(currentUser.uid)
            .update({
              imageAvatar: url
            })
          history.push("/home");
        });
      }
    );
  };

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    bioDesc: "",
    locDesc: "",
    userName: "",
  });

  const handleChange = (prop) => (e) => {
    setProfile({ ...profile, [prop]: e.target.value });
  };
  const useStyles = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(8),
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    avatar: {
      margin: theme.spacing(1),
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
    drawerHeader: {
      display: "flex",
      alignItems: "center",
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
      marginBottom: 2,
    },
  }));
  const history = useHistory();
  const createprofile = (e) => {
    e.preventDefault();
    if (!profile.firstName || !profile.lastName) {
      alert("Please complete the Name Fields!");
    } else {
      const currentUser = firebase.auth().currentUser;
      db.collection("users")
        .doc(currentUser.uid)
        .set({
          firstName: profile.firstName,
          lastName: profile.lastName,
          bioDesc: profile.bioDesc,
          locDesc: profile.locDesc,
          username: profile.userName,
          profilePic: true,
        })
        .then(() => {
          handleUpload();
        });
    }
  };
  useEffect(() => {
    let abortController = new AbortController();
    const fetchData = () => {
      const currentUser = firebase.auth().currentUser;
      db.collection("users")
        .doc(currentUser.uid)
        .get()
        .then((doc) => {
          console.log(doc.exists);
          if (doc.exists) {
            setProfile({
              firstName: doc.data().firstName,
              lastName: doc.data().lastName,
              bioDesc: doc.data().bioDesc,
              locDesc: doc.data().locDesc,
              userName: doc.data().username,
              imageExists: doc.data().profilePic,
            });
          }
          if (doc.data().profilePic) {
            fetchAvatar();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };
    const fetchAvatar = () => {
      const currentUser = firebase.auth().currentUser;
      var storageRef = firebase.storage().ref();
      storageRef
        .child("images/" + currentUser.uid)
        .getDownloadURL()
        .then((url) => {
          setImage({
            displayURL: url,
          });
        });
    };
    fetchData();
    return () => {
      abortController.abort();
    };
  }, [db]);
  const classes = useStyles();
  return (
    <div>
      <div className={classes.drawerHeader} />
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Typography component="h2" variant="h5">
            Help your friends know you!
          </Typography>
          <input
            accept="image/*"
            className={classes.input}
            id="contained-button-file"
            multiple
            type="file"
            onChange={handleImageChange}
          />
          <label htmlFor="contained-button-file">
            <IconButton component="span">
              <Avatar
                src={image.displayURL || ".././assets/images/profile.png"}
                className={classes.large}
              />
            </IconButton>
          </label>
          <form className={classes.form} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="fname"
                  name="firstName"
                  variant="outlined"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  onChange={handleChange("firstName")}
                  value={profile.firstName || ''}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="lname"
                  onChange={handleChange("lastName")}
                  value={profile.lastName || ''}
                />
              </Grid>
            </Grid>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              name="username"
              label="Username"
              onChange={handleChange("userName")}
              value={profile.userName || ''}
              autoComplete="current-password"
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              name="biography"
              label="Biography"
              onChange={handleChange("bioDesc")}
              value={profile.bioDesc || ''}
              autoComplete="current-password"
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              name="location"
              label="Location"
              onChange={handleChange("locDesc")}
              value={profile.locDesc || ''}
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={createprofile}
            >
              Set my Profile
            </Button>
          </form>
        </div>
      </Container>

    </div>
  );
}
