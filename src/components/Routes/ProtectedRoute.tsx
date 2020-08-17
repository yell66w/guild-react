import * as React from "react";
import { Redirect, Route, RouteProps } from "react-router";

export interface ProtectedRouteProps extends RouteProps {
  auth: boolean;
  authPath: string;
}
//issue refactor
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  auth = "login",
  authPath,
  ...rest
}) => {
  if (authPath) {
    const renderComponent = () => <Redirect to={{ pathname: authPath }} />;
    return <Route {...rest} component={renderComponent} render={undefined} />;
  } else {
    return <Route {...rest} />;
  }
};

export default ProtectedRoute;
