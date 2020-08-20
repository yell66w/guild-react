import React, { useState, useEffect, Fragment } from "react";
import { useParams } from "react-router-dom";
import API from "../../API/API";
import moment from "moment";
import AttendanceField from "./AttendanceField";
import Loader from "react-spinners/BeatLoader";
const AttendanceDetails = () => {
  let { id } = useParams();
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
  } = attendance;
  return (
    <Fragment>
      <div className="flex flex-col md:flex-row flex-wrap justify-center">
        <div className="p-2 md:w-1/2 lg:w-1/3  rounded-lg flex-col flex ">
          <div className="flex flex-col bg-dark-black-400 rounded-lg p-6">
            <div className="flex  justify-center p-2">
              <h1 className="font-bold text-2xl">{name}</h1>
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
    </Fragment>
  );
};

export default AttendanceDetails;
