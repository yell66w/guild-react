import React, { Fragment, useState } from "react";
import ReactModal from "react-modal";
import API from "../../../../API/API";
import Loader from "react-spinners/BeatLoader";
import { Redirect } from "react-router-dom";

interface Props {
  isDeleting: boolean;
  setIsDeleting: (value: boolean) => void;
  id: number;
}
const AttendanceDelete: React.FC<Props> = ({
  isDeleting,
  setIsDeleting,
  id,
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const deleteAttendance = async () => {
    setIsUpdating(true);
    try {
      await API.delete(`/attendances/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setIsUpdating(false);
      setIsDeleting(false);
      setDeleted(true);
    } catch (error) {
      console.log(error.message);
    }
  };

  if (deleted) return <Redirect to="/attendance" />;

  return (
    <Fragment>
      <ReactModal
        isOpen={isDeleting}
        contentLabel={`AttendanceDelete`}
        onRequestClose={function () {
          if (!isUpdating) setIsDeleting(false);
        }}
        className="max-h-full animate__animated animate__bounceInDown overflow-auto text-white  rounded-lg  w-10/12 sm:w-8/12 md:w-1/2  lg:w-1/3  focus:outline-none bg-dark-black-400"
        overlayClassName="animate__animated animate_fadeIn flex flex-wrap py-5 justify-center items-center fixed inset-0 bg-black bg-opacity-75"
      >
        <div className="h-full  flex flex-col flex-wrap ">
          <div className="flex flex-col rounded-t-lg items-center flex-wrap  py-4 justify-center">
            <h1 className="font-bold text-lg">
              {isUpdating
                ? isDeleting
                  ? "DELETING..."
                  : "UPDATING..."
                : "ARE YOU SURE?"}
            </h1>
            <p
              className={`${
                isUpdating ? "hidden" : "block"
              } text-gray-400 mt-1 px-6 text-xs`}
            >
              All unpaid GPS and APS will be lost after deleting.
            </p>
            <div
              className={`${
                isUpdating ? "hidden" : "block"
              } mt-5 mb-3 flex flex-row justify-around`}
            >
              <div className="px-1">
                <button
                  onClick={deleteAttendance}
                  className="focus:outline-none transition duration-300 ease-in-out hover:text-white hover:bg-dark-green-100 text-dark-green-100 text-xs font-bold border border-dark-green-100   rounded-full px-3 py-1"
                >
                  YES, I AM SURE
                </button>
              </div>
              <div className="px-1">
                <button
                  onClick={() => setIsDeleting(false)}
                  className="focus:outline-none transition duration-300 ease-in-out hover:text-white hover:bg-dark-red-100 text-dark-red-100 text-xs font-bold border border-dark-red-100   rounded-full px-3 py-1"
                >
                  NO
                </button>
              </div>
            </div>

            <div
              className={`${
                isUpdating ? "block" : "hidden"
              } mt-5 mb-3 flex flex-row justify-around`}
            >
              <Loader color={"#fff"} />
            </div>
          </div>
        </div>
      </ReactModal>
    </Fragment>
  );
};

export default AttendanceDelete;
