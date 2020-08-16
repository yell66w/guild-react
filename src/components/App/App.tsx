import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import Navigation from "../Navigation";
import Attendance from "../Attendance";
import Login from "../Auth/Login";
import Register from "../Auth/Register";
import API from "../../API/API";
import { ToastContainer } from "react-toastify";
import Home from "../Home/Home";

function App() {
  const [auth, setAuth] = useState(false);
  const [render, setRender] = useState(false);

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
        setRender(true);
        console.log("rendered", res.data.IGN);
      } catch (error) {
        setRender(true);
        setAuth(false);
        console.log(error.message);
        console.log("rendered error");
      }
    };
    checkAuth();
  }, []);

  if (!render) return <p>Loading</p>;
  return (
    <div className="App text-white ">
      <BrowserRouter>
        <Navigation auth={auth} setAuth={setAuth} />
        <div className="px-6 py-2">
          <ToastContainer />

          <Switch>
            <Route exact path="/login">
              {auth ? <Redirect to="/" /> : <Login setAuth={setAuth} />}
            </Route>
            <Route exact path="/register">
              {auth ? <Redirect to="/" /> : <Register />}
            </Route>
            <Route exact path="/attendance">
              {!auth ? <Redirect to="/login" /> : <Attendance />}
            </Route>
            <Route exact path="/">
              {!auth ? <Redirect to="/login" /> : <Home />}
            </Route>
            <Route path="*">
              {!auth ? <Redirect to="/login" /> : <Home />}
            </Route>
          </Switch>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
