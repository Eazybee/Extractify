import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import LoadingSpinner from "../ui/LoadingSpinner";
import routeData from "./data";
import ProtectedRoute from "./Protected";

const Routes = () => (
  <Router>
    <Suspense
      fallback={
        <LoadingSpinner
          style={{
            position: "fixed",
            top: "50%",
            right: "50%",
            marginLeft: 30,
            marginBottom: 30,
          }}
        />
      }
    >
      <Switch>
        {routeData.default.map(({ exact, path, Component, protect }) => {
          const MyRoute = protect ? ProtectedRoute : Route;
          return (
            <MyRoute
              key={path}
              exact={exact}
              path={path}
              component={Component}
            />
          );
        })}
        <Route
          path="*"
          render={({ location }: any) => (
            <Redirect
              to={{
                pathname: "/",
                state: { from: location },
              }}
            />
          )}
        />
      </Switch>
    </Suspense>
  </Router>
);

export default Routes;
