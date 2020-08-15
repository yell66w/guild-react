import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import Home from "../Home";
import Navigation from "../Navigation";
import Attendance from "../Attendance";
import Login from "../Auth/Login";
import Register from "../Auth/Register";
import API from "../../API/API";
import { ToastContainer } from "react-toastify";

function App() {
  const [auth, setAuth] = useState(false);
  useEffect(() => {
    const checkAuth = async () => {
      try {
        /** issue = change user/profile to verify */
        const res = await API.get("users/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        res.data.IGN ? setAuth(true) : setAuth(false);
        console.log("rendered");
      } catch (error) {
        console.log(error.message);
        console.log("rendered error");
      }
    };
    checkAuth();
  }, []);
  return (
    <div className="App text-white ">
      <BrowserRouter>
        <Navigation auth={auth} setAuth={setAuth} />
        <div className="px-6 py-2">
          <ToastContainer />

          <Switch>
            <Route path="/login">
              {auth ? <Redirect to="/" /> : <Login setAuth={setAuth} />}
            </Route>
            <Route path="/register">
              {auth ? <Redirect to="/" /> : <Register />}
            </Route>
            <Route path="/attendance">
              {auth ? <Attendance /> : <Redirect to="/login" />}
            </Route>
            <Route path="/">{auth ? <Home /> : <Redirect to="/login" />}</Route>
          </Switch>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
