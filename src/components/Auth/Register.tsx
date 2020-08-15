import React, { useState } from "react";
import { Formik, Field, Form, FormikHelpers } from "formik";
import { Link, Redirect } from "react-router-dom";
import * as Yup from "yup";
import API from "../../API/API";
import { toast } from "react-toastify";

interface data {
  IGN: string;
  username: string;
  password: string;
  confirmPassword: string;
}

const RegisterSchema = Yup.object().shape({
  IGN: Yup.string()
    .min(3, "Too Short!")
    .max(30, "Too Long!")
    .required("Required!"),
  username: Yup.string()
    .min(3, "Too Short!")
    .max(30, "Too Long!")
    .required("Required!"),
  password: Yup.string()
    .min(6, "Too Short!")
    .max(12, "Too Long!")
    .required("Required!"),
  confirmPassword: Yup.string()
    .min(6, "Too Short!")
    .max(12, "Too Long!")
    .required("Required!")
    .oneOf([Yup.ref("password")], "Passwords must match"),
});
const Register: React.FC = () => {
  const [registered, setRegistered] = useState(false);

  if (registered) {
    return <Redirect to="/login" />;
  }
  return (
    <div className="flex justify-center items-center my-12 ">
      <div className="w-11/12 sm:w-9/12 md:w-1/2 lg:w-1/3  p-6 rounded-lg animate__animated animate__backInDown flex flex-col ">
        <div className="top-0 z-10 fixed self-center flex flex-row bg-gray-100 w-16 h-16 rounded-full items-center justify-center">
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            className="lock-closed w-6 h-6 text-dark-black-400"
          >
            <path
              fillRule="evenodd"
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
              clipRule="evenodd"
            ></path>
          </svg>
        </div>
        <Formik
          initialValues={{
            IGN: "",
            username: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={RegisterSchema}
          onSubmit={async (
            values: data,
            { setSubmitting }: FormikHelpers<data>
          ) => {
            try {
              setSubmitting(false);
              await API.post("auth/sign-up", values);
              toast.success(
                "Registered successfully! Please wait for admin's approval.",
                {
                  className: "text-sm",
                }
              );
              setRegistered(true);
            } catch (err) {
              toast.error("Registration failed! Please try again.", {
                className: "text-sm",
              });
            }
          }}
        >
          {({ errors, touched }) => (
            <Form className="flex flex-col rounded-lg justify-center p-10 bg-dark-black-400 ">
              <label className="text-sm font-semibold" htmlFor="IGN">
                IGN
              </label>
              <Field
                className={`${
                  errors.IGN && touched.IGN
                    ? "border-dark-red-100 mb-1"
                    : "border-dark-teal-100 mb-3"
                } text-xs transition duration-150 ease-linear focus:border-teal-100  p-2 w-full  bg-transparent focus:outline-none border-b  mt-1`}
                id="IGN"
                name="IGN"
                placeholder="Type your IGN"
                autoComplete="off"
              />
              {errors.IGN && touched.IGN ? (
                <span className="text-xs text-dark-red-100 mb-2">
                  {errors.IGN}
                </span>
              ) : null}

              <label className="text-sm font-semibold" htmlFor="username">
                Username
              </label>
              <Field
                className={`${
                  errors.username && touched.username
                    ? "border-dark-red-100 mb-1"
                    : "border-dark-teal-100 mb-3"
                } text-xs transition duration-150 ease-linear focus:border-teal-100  p-2 w-full  bg-transparent focus:outline-none border-b  mt-1`}
                id="username"
                name="username"
                placeholder="Type your username"
                autoComplete="off"
              />
              {errors.username && touched.username ? (
                <span className="text-xs text-dark-red-100 mb-2">
                  {errors.username}
                </span>
              ) : null}

              <label className="text-sm font-semibold" htmlFor="password">
                Password
              </label>
              <Field
                className={`${
                  errors.password && touched.password
                    ? "border-dark-red-100 mb-1"
                    : "border-dark-teal-100 mb-3"
                } text-xs transition duration-150 ease-linear focus:border-teal-100  p-2 w-full  bg-transparent focus:outline-none border-b  mt-1`}
                id="password"
                name="password"
                type="password"
                placeholder="Type your password"
                autoComplete="off"
              />
              {errors.password && touched.password ? (
                <span className="text-xs text-dark-red-100 mb-2">
                  {errors.password}
                </span>
              ) : null}

              <label
                className="text-sm font-semibold"
                htmlFor="confirmPassword"
              >
                Confirm Password
              </label>
              <Field
                className={`${
                  errors.confirmPassword && touched.confirmPassword
                    ? "border-dark-red-100 mb-1"
                    : "border-dark-teal-100 mb-3"
                } text-xs transition duration-150 ease-linear focus:border-teal-100  p-2 w-full  bg-transparent focus:outline-none border-b  mt-1`}
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Type your password again"
                autoComplete="off"
              />
              {errors.confirmPassword && touched.confirmPassword ? (
                <span className="text-xs text-dark-red-100 mb-2">
                  {errors.confirmPassword}
                </span>
              ) : null}
              <button
                className="focus:outline-none hover:bg-teal-300 transition duration-150 ease-linear mt-2 text-dark-black-400 text-sm p-2 w-full rounded-full bg-dark-teal-100 font-medium self-center"
                type="submit"
              >
                Register
              </button>
              <Link
                className="focus:outline-none transition duration-150 ease-linear text-xs self-center pt-3 hover:text-dark-teal-100"
                to="/login"
              >
                Already have an account?
              </Link>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Register;
