import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { UserContext } from "../../../contexts/User";

const ProtectedRoute = ({ exact, path, component: Component }: Props) => {
  const { user } = useContext(UserContext);

  return (
    <>
      {user ? (
        <Route exact={exact} path={path} component={Component} />
      ) : (
        <Redirect to={{ pathname: "/auth", state: { referrer: path } }} />
      )}
    </>
  );
};

type Props = {
  exact: boolean;
  path: string;
  protect?: boolean | undefined;
  component: (prop?: any) => JSX.Element;
};

export default ProtectedRoute;
