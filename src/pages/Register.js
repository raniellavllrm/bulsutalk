import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import logo from ".././assets/images/icon.svg";
import firebase from "../utils/firebase";
import {
  TextField,
  CssBaseline,
  Grid,
  Box,
  Container,
  Button,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
export default function Register() {
  const db = firebase.firestore();
  function Copyright() {
    return (
      <Typography variant="body2" color="textSecondary" align="center">
        {"Copyright © "}
        <Link to="/" color="inherit" href="https://material-ui.com/">
          BulsuTalk
        </Link>{" "}
        {new Date().getFullYear()}
        {"."}
      </Typography>
    );
  }

  const [payload, setPayload] = useState({
    email: "",
    pass: "",
    confirmPass: "",
  });
  const handleChange = (prop) => (e) => {
    setPayload({ ...payload, [prop]: e.target.value });
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
      width: 100,
      height: 100,
    },
  }));
  const history = useHistory();
  const register = (e) => {
    e.preventDefault();
    if (!payload.email || !payload.pass || !payload.confirmPass) {
      alert("Please complete the fields.");
    } else if (payload.pass !== payload.confirmPass) {
      alert("Passwords do not match.");
    } else if (payload.pass.length < 5) {
      alert("Password should be at least 6 characters");
    } else {
      firebase
        .auth()
        .createUserWithEmailAndPassword(payload.email, payload.pass)
        .then((signedinUser) => {
          const currentUser = firebase.auth().currentUser;
          db.collection("users")
            .doc(currentUser.uid)
            .set({
              firstName: "First Name",
              lastName: "Last Name",
              bioDesc: "",
              locDesc: "",
              username: payload.email,
              profilePic: false,
            })
            .then(() => {
              var storage = firebase.storage();
              var storageRef = storage.ref();
              var uploadTask = storageRef.child("images/" + currentUser.uid).put(".././assets/images/profile.png");
              uploadTask.then(() => {
                history.push("/createprofile");
              })
            });
        })
        .catch((err) => {
          alert(err.message);
        });
    }
  };
  const classes = useStyles();
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <img id="logo_login" src={logo} alt="BulsuTalk Logo"></img>
        <Typography component="h1" variant="h5">
          Register to BulsuTalk
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            onChange={handleChange("email")}
            value={payload.email}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            onChange={handleChange("pass")}
            value={payload.pass}
            autoComplete="current-password"
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Confirm Password"
            type="password"
            id="confirmPass"
            onChange={handleChange("confirmPass")}
            value={payload.confirmPass}
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={register}
          >
            Sign Up
          </Button>
          <Grid container className={classes.signupLink}>
            <Grid item>
              <Typography>
                <Link
                  to="/login"
                  className={classes.signupLink}
                  color="inherit"
                >
                  {"Already have an account?"}
                </Link>
              </Typography>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}
