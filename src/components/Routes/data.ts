import HomePage from "../pages/Home";
import AuthPage from "../pages/Auth";

export type RouteData = {
  default: {
    exact: boolean;
    path: string;
    protect?: boolean;
    Component: (prop?: any) => JSX.Element;
  }[];
};

const Routes: RouteData = {
  default: [
    {
      exact: true,
      path: "/",
      Component: HomePage,
      protect: true,
    },
    {
      exact: true,
      path: "/auth",
      Component: AuthPage,
    },
  ],
};

export default Routes;
