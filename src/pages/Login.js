import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import logo from ".././assets/images/icon.svg";
import firebase from "../utils/firebase";
import { TextField, CssBaseline, Grid, Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Container, Typography } from "@material-ui/core";
export default function Login() {
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
  }));
  const history = useHistory();
  const login = (e) => {
    e.preventDefault();
    if (!payload.email || !payload.pass) {
      alert("Please complete the fields.");
    } else {
      firebase
        .auth()
        .signInWithEmailAndPassword(payload.email, payload.pass)
        .then((signedinUser) => {
          alert(signedinUser.user.email + " is succesfully logged in!");
          history.push("/home");
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
          Log in to BulsuTalk
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
            autoFocus
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
            autoComplete="current-password"
            onChange={handleChange("pass")}
            value={payload.pass}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={login}
            disableElevation
          >
            Sign In
          </Button>
          <Grid container className={classes.signupLink}>
            <Grid item>
              <Typography>
                <Link to="/register"
                  className={classes.signupLink}
                  color="inherit"
                >
                  {"Sign Up for BulsuTalk"}
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
