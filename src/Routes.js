import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Login from "./pages/Login/Login";
import HomePage from "./pages/HomePage";

import { isAuthenticated } from "./services/auth";

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      isAuthenticated() ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{ pathname: "/login", state: { from: props.location } }}
        />
      )
    }
  />
);

const Routes = () => (
  <Switch>
    <PrivateRoute exact path="/" component={HomePage} />
    <Route exact path="/login" component={Login} />

    <Route component={Login} />
  </Switch>
);

export default Routes;
