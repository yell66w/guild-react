import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
interface Props {
  auth: boolean;
  setAuth: (value: boolean) => void;
}
const Navigation: React.FC<Props> = ({ auth, setAuth }) => {
  const [isOpen, setIsOpen] = useState(false);
  const logout = () => {
    localStorage.removeItem("token");
    setAuth(false);
  };

  return (
    <Fragment>
      <nav className="bg-dark-black-500 text-white flex flex-row flex-wrap justify-between p-6">
        <div className="mr-6 animate__animated animate__lightSpeedInLeft ">
          <Link to="/" className="font-bold ">
            MAFIA
          </Link>
        </div>
        <div className=" flex-wrap flex justify-end items-center lg:hidden ">
          <span onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
            <svg
              className="fill-current h-4 w-4"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Menu</title>
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
            </svg>
          </span>
        </div>

        <div
          className={`${
            isOpen ? "block" : "hidden"
          } lg:w-auto w-full flex-grow lg:flex lg:flex-row text-sm items-center `}
        >
          <div
            className={`${
              auth ? "block" : "hidden"
            } flex flex-col lg:flex-row animate__animated animate__lightSpeedInLeft`}
          >
            <Link className="link text-xs font-semibold " to="/">
              HOME
            </Link>
            <Link className="link text-xs font-semibold" to="/attendance">
              ATTENDANCE
            </Link>
            <Link className="link text-xs font-semibold" to="/activities">
              ACTIVITIES
            </Link>
          </div>
          <div className="flex flex-col lg:flex-row ml-auto items-start lg:items-center animate__animated animate__lightSpeedInRight">
            <Link
              to="/login"
              className={`${
                auth ? "hidden" : "block"
              } transition duration-150 ease-linear hover:text-dark-teal-100 mt-3 lg:mt-0 focus:outline-none mr-2 font-semibold text-xs`}
            >
              LOGIN
            </Link>
            <Link
              to="/register"
              className={`${
                auth ? "hidden" : "block"
              } mt-3 lg:mt-0 btn-primary font-semibold text-xs`}
            >
              REGISTER
            </Link>
            <button
              onClick={logout}
              className={`${
                auth ? "block" : "hidden"
              } transition duration-150 ease-linear hover:text-dark-teal-100 cursor-pointer mt-3 lg:mt-0 focus:outline-none mr-2 font-semibold text-xs`}
            >
              LOGOUT
            </button>
          </div>
        </div>
      </nav>
    </Fragment>
  );
};

export default Navigation;
