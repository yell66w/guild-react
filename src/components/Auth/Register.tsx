import React from "react";
import { Formik, Field, Form, FormikHelpers } from "formik";
import { Link } from "react-router-dom";

interface data {
  IGN: string;
  username: string;
  password: string;
  confirmPassword: string;
}
const Register = () => {
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
              fill-rule="evenodd"
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
              clip-rule="evenodd"
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
          onSubmit={(values: data, { setSubmitting }: FormikHelpers<data>) => {
            setTimeout(() => {
              alert(JSON.stringify(values, null, 2));
              setSubmitting(false);
            }, 500);
          }}
        >
          <Form className="flex flex-col rounded-lg justify-center p-10 bg-dark-black-400 ">
            <label className="text-sm font-semibold" htmlFor="IGN">
              IGN
            </label>
            <Field
              className="text-xs transition duration-150 ease-linear focus:border-teal-100  p-2 w-full mb-3 bg-transparent focus:outline-none border-b border-dark-teal-100 mt-1"
              id="IGN"
              name="IGN"
              placeholder="Type your IGN"
              autocomplete="off"
            />

            <label className="text-sm font-semibold" htmlFor="username">
              Username
            </label>
            <Field
              className="text-xs transition duration-150 ease-linear focus:border-teal-100  p-2 w-full mb-3 bg-transparent focus:outline-none border-b border-dark-teal-100 mt-1"
              id="username"
              name="username"
              placeholder="Type your username"
              autocomplete="off"
            />

            <label className="text-sm font-semibold" htmlFor="password">
              Password
            </label>
            <Field
              className="text-xs transition duration-150 ease-linear focus:border-teal-100 p-2 w-full mb-3 bg-transparent focus:outline-none  border-b border-dark-teal-100 mt-1"
              id="password"
              name="password"
              type="password"
              placeholder="************"
              autocomplete="off"
            />

            <label className="text-sm font-semibold" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <Field
              className="text-xs transition duration-150 ease-linear focus:border-teal-100 p-2 w-full mb-3 bg-transparent focus:outline-none  border-b border-dark-teal-100 mt-1"
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="************"
              autocomplete="off"
            />

            <button
              className="ffocus:outline-none hover:bg-teal-300 transition duration-150 ease-linear mt-2 text-dark-black-400 text-sm p-2 w-full rounded-full bg-dark-teal-100 font-medium self-center"
              type="submit"
            >
              Register
            </button>
            <Link
              className="transition duration-150 ease-linear text-xs self-center pt-3 hover:text-dark-teal-100"
              to="/login"
            >
              Already have an account?
            </Link>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default Register;
