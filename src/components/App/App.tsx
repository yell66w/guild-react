import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from "../Home";
import Navigation from "../Navigation";
import Attendance from "../Attendance";
import Login from "../Auth/Login";
import Register from "../Auth/Register";

function App() {
  return (
    <div className="App text-white ">
      <BrowserRouter>
        <Navigation />
        <div className="px-6 py-2">
          <Switch>
            <Route path="/login">
              <Login></Login>
            </Route>
            <Route path="/register">
              <Register></Register>
            </Route>
            <Route path="/attendance">
              <Attendance></Attendance>
            </Route>
            <Route path="/">
              <Home></Home>
            </Route>
          </Switch>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
