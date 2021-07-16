import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import logo from "../../assets/images/icon.svg";
import firebase from "../../utils/firebase";
import {
    Paper,
    TextField,
    IconButton,
    Avatar,
    Grid,
    Button,
    Typography,
    Modal
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from '@material-ui/icons/Close';

export default function ProfileModal({ open, setOpen }) {
    const handleClose = () => {
        setOpen(false);
        history.push("/home");
    };
    const [image, setImage] = useState({
        fileImage: null,
        progress: 0,
        downloadURL: null,
        displayURL: null,
    });
    const handleImageChange = (e) => {
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
                    db.collection("posts")
                        .get()
                        .then(snapshots => {
                            snapshots.forEach((doc) => {
                                if (doc.data().userID === currentUser.uid) {
                                    db.collection("posts").doc(doc.id).update({
                                        userName: "@" + profile.userName,
                                        displayName: profile.firstName + profile.lastName,
                                        imageURL: url
                                    })
                                }
                            });
                        });
                    handleClose();
                });
            }
        );
    };
    const db = firebase.firestore();

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
            justifyContent: 'center'
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
                .update({
                    firstName: profile.firstName,
                    lastName: profile.lastName,
                    bioDesc: profile.bioDesc,
                    locDesc: profile.locDesc,
                    username: profile.userName,
                    profilePic: true
                })
                .then(() => {
                    if (image && image.fileImage) handleUpload();
                    else handleClose();
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
                            imageExists: doc.data().profilePic
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
        <Modal
            className={classes.modalCenter}
            open={open}>
            <Paper id="cardProfile">
                <div className={classes.paper}>
                    <Grid item id="searchText" >
                        <IconButton
                            onClick={handleClose}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Grid>
                    <img id="logo_login" src={logo} alt="BulsuTalk Logo"></img>
                    <Typography variant="h5">
                        Your Profile!
                    </Typography>
                    <input
                        accept="image/*"
                        className={classes.input}
                        id="pictureDisplay"
                        multiple
                        type="file"
                        onChange={handleImageChange}
                    />
                    <label htmlFor="pictureDisplay">
                        <IconButton component="span">
                            <Avatar
                                src={image.displayURL || "../../assets/images/profile.png"}
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
                                    size="small"
                                    onChange={handleChange("firstName")}
                                    value={profile.firstName}
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
                                    size="small"
                                    onChange={handleChange("lastName")}
                                    value={profile.lastName}
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
                            value={profile.userName}
                            size="small"
                            autoComplete="current-password"
                            inputProps={
                                { readOnly: true, }
                            }
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            name="biography"
                            label="Biography"
                            size="small"
                            onChange={handleChange("bioDesc")}
                            value={profile.bioDesc}
                            autoComplete="current-password"
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            name="location"
                            label="Location"
                            size="small"
                            onChange={handleChange("locDesc")}
                            value={profile.locDesc}
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
                            Create my Profile
                        </Button>
                    </form>
                </div>
            </Paper>
        </Modal>
    );
}
