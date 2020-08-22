import React, { useState, useEffect, Fragment } from "react";
import { useParams, Redirect } from "react-router-dom";
import API from "../../API/API";
import moment from "moment";
import AttendanceField from "./AttendanceField";
import Loader from "react-spinners/BeatLoader";
import ReactModal from "react-modal";
import AttendanceEdit from "./AttendanceEdit";

const AttendanceDetails = () => {
  let { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [attendance, setAttendance] = useState({
    id: "",
    activityPoint: {
      ap: 0,
      name: "",
    },
    name: "",
    ap_total: 0,
    gp_total: 0,
    author: "",
    createdAt: "",
    participants: [
      {
        id: "",
        userId: "",
        mark: "",
        percentage: "",
      },
    ],
    items: [
      {
        id: "",
        itemId: "",
        qty: 0,
        gp_price: 0,
      },
    ],
    remarks: "",
    result: "",
    status: "",
    updatedAt: "",
    category: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    let isSubscribed = true;
    const one = async () => {
      try {
        if (isSubscribed) {
          const res = await API.get(`attendances/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          setAttendance(res.data);
        }
      } catch (err) {
        console.log(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    one();

    return function cleanup() {
      isSubscribed = false;
    };
  }, [id]);

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

  if (isLoading) {
    return (
      <div
        className={`bg-black flex justify-center items-center absolute inset-0`}
      >
        <Loader color={"#fff"} />
      </div>
    );
  }
  if (!attendance.id) return <p>Attendance not found</p>;
  const {
    name,
    gp_total,
    ap_total,
    author,
    createdAt,
    items,
    participants,
    remarks,
    result,
    status,
    updatedAt,
    activityPoint,
    category,
  } = attendance;
  return (
    <Fragment>
      <div className="flex flex-col md:flex-row flex-wrap justify-center">
        <div className="p-2 w-full rounded-lg flex-col flex ">
          <div className="flex w-full lg:w-2/3 self-center flex-col bg-dark-black-400 rounded-lg p-6">
            <div className="flex flex-col  items-center justify-center p-2">
              <h1 className="font-bold text-white text-4xl">
                {name.toUpperCase()}
              </h1>
              <div className="mt-1 flex flex-row justify-around">
                <div className="px-1">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="focus:outline-none transition duration-300 ease-in-out hover:text-white hover:bg-dark-orange-100 text-dark-orange-100 text-xs font-bold border border-dark-orange-100   rounded-full px-3 py-1"
                  >
                    EDIT
                  </button>
                </div>
                <div className="px-1">
                  <button
                    onClick={() => setIsDeleting(true)}
                    className="focus:outline-none transition duration-300 ease-in-out hover:text-white hover:bg-dark-red-100 text-dark-red-100 text-xs font-bold border border-dark-red-100   rounded-full px-3 py-1"
                  >
                    DELETE
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="p-2 md:w-1/2 lg:w-1/3  rounded-lg flex-col flex ">
          <div className="flex flex-col bg-dark-black-400 rounded-lg p-6">
            <div className="flex  justify-center p-2">
              <h1 className="font-bold text-2xl">DETAILS</h1>
            </div>
            <div className="flex p-2 flex-col text-sm">
              <AttendanceField title="AUTHOR" value={author} />
              <AttendanceField
                title="DATE CREATED"
                value={moment(createdAt).format("MMM D, YYYY - h:mm a")}
              />
              <AttendanceField
                title="DATE UPDATED"
                value={moment(updatedAt).format("MMM D, YYYY - h:mm a")}
              />
              <AttendanceField title="PAYMENT" value={category} />
              <AttendanceField title="RESULT" value={result} />
              <AttendanceField title="STATUS" value={status} />
              <AttendanceField
                title="AP Type"
                value={`${activityPoint.name} (${activityPoint.ap})`}
              />
              <AttendanceField title="TOTAL AP" value={ap_total} />
              <AttendanceField title="TOTAL GP" value={gp_total} />
              <AttendanceField
                title="PARTICIPANTS"
                value={participants.length}
              />
              <AttendanceField title="DROPS" value={items.length} />
              <div className="flex py-2  w-full flex-col  justify-between">
                <p className="font-bold">REMARKS</p>
                <p className="text-opacity-75  text-white">
                  {remarks || "No remarks."}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="p-2 md:w-1/2  lg:w-1/3 rounded-lg flex-col flex ">
          <div className="flex flex-col bg-dark-black-400 rounded-lg p-6">
            <div className="flex justify-center p-2">
              <h1 className="font-bold text-2xl">DROPS</h1>
            </div>
            <div className="flex p-2 flex-col text-sm">
              {items.length > 0 ? (
                <AttendanceField title={"NAME"} value="QTY" />
              ) : (
                <p className="self-center">No Drops.</p>
              )}
              {items.map((item) => {
                return (
                  <AttendanceField
                    key={item.id}
                    value={item.qty}
                    url={`items/${item.itemId}`}
                    isAPI={true}
                  />
                );
              })}
            </div>
          </div>
          <div className="flex mt-4 flex-col bg-dark-black-400 rounded-lg p-6">
            <div className="flex justify-center p-2">
              <h1 className="font-bold text-2xl">PARTICIPANTS</h1>
            </div>
            <div className="flex p-2 flex-col text-sm">
              {participants.length > 0 ? (
                <AttendanceField title={"NAME"} value="STATUS" />
              ) : (
                <p className="self-center">No Participants.</p>
              )}

              {participants.map((participant) => {
                return (
                  <AttendanceField
                    key={participant.id}
                    url={`users/${participant.userId}`}
                    isAPI={true}
                    value={participant.mark}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

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

      {attendance ? (
        <AttendanceEdit
          attendance={attendance}
          setAttendance={setAttendance}
          isModalOpen={isEditing}
          setIsModalOpen={setIsEditing}
        />
      ) : null}
    </Fragment>
  );
};

export default AttendanceDetails;
