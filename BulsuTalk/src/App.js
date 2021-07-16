import "./assets/stylesheets/App.css";
import "./assets/stylesheets/Style.css";
import "./FontAwesomeIcons/iconindex";
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import { ThemeProvider } from "@material-ui/core";
import firebase from "./utils/firebase";
import theme from "./utils/theme";
import Home from "./pages/Home";
import MyProfile from "./pages/MyProfile";
import Loading from "./pages/Loading";
import Login from "./pages/Login";
import Notification from "./pages/Notification";
import Register from "./pages/Register";
import Friends from "./pages/Friends";
import CreateProfile from "./pages/CreateProfile";
import PrivateRoute from "./routers/PrivateRoute";
import PublicRoute from "./routers/PublicRoute";
function App() {
  const [state, setState] = useState({
    isAuth: false,
    isLoading: true,
  });

  useEffect(() => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        setState({ isAuth: true, isLoading: false });
      } else {
        setState({ isAuth: false, isLoading: false });
      }
    });
  }, []);

  if (state.isLoading) {
    return <p>Loading..</p>;
  }
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Switch>
          <Route path="/" exact>
            <Redirect to="/login" exact />
          </Route>

          <PublicRoute
            component={Login}
            isAuth={state.isAuth}
            restricted={true}
            path="/login"
            exact
          />
          <PublicRoute
            component={Register}
            isAuth={state.isAuth}
            restricted={true}
            path="/register"
            exact
          />
          <PrivateRoute
            component={Home}
            isAuth={state.isAuth}
            path="/home"
            exact
          />
          <PrivateRoute
            component={MyProfile}
            isAuth={state.isAuth}
            path="/profile"
            exact
          />
          <PrivateRoute
            component={CreateProfile}
            isAuth={state.isAuth}
            path="/createprofile"
            exact
          />
          <PrivateRoute
            component={Notification}
            isAuth={state.isAuth}
            path="/notification"
            exact
          />
          <PrivateRoute
            component={Friends}
            isAuth={state.isAuth}
            path="/friends"
            exact
          />
          <PrivateRoute
            component={Loading}
            isAuth={state.isAuth}
            path="/loading"
            exact
          />
        </Switch>
      </Router>
    </ThemeProvider>
  );
}

export default App;
