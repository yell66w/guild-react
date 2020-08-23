import React, { useState, useEffect, Fragment } from "react";
import { useParams } from "react-router-dom";
import API from "../../../../API/API";
import moment from "moment";
import UIAttendanceField from "../../AttendanceUI/UI-Attendance-Field";
import AttendanceEdit from "../AttendanceEdit/Attendance-Edit";
import AttendanceDelete from "../AttendanceDelete/AttendanceDelete";
import { AttendanceInit } from "../../AttendanceInterface/AttendanceInterface";
import LoadingScreen from "../../../UI/LoadingScreen";
import AttendanceDropDetail from "./Attendance-DropDetail";
import AttendanceParticipantDetail from "./Attendance-ParticipantDetail";

const AttendanceDetails = () => {
  let { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [attendance, setAttendance] = useState(AttendanceInit);
  const [drops, setDrops] = useState([]);
  const [gp_total, setGp_total] = useState(0);
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
          setDrops(res.data.items);
          setGp_total(res.data.gp_total);
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
    return <LoadingScreen />;
  }
  if (!attendance.id) return <p>Attendance not found</p>;
  const {
    name,
    ap_total,
    author,
    createdAt,
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
              <UIAttendanceField title="AUTHOR" value={author} />
              <UIAttendanceField
                title="DATE CREATED"
                value={moment(createdAt).format("MMM D, YYYY - h:mm a")}
              />
              <UIAttendanceField
                title="DATE UPDATED"
                value={moment(updatedAt).format("MMM D, YYYY - h:mm a")}
              />
              <UIAttendanceField title="PAYMENT" value={category} />
              <UIAttendanceField title="RESULT" value={result} />
              <UIAttendanceField title="STATUS" value={status} />
              <UIAttendanceField
                title="AP Type"
                value={`${activityPoint.name} (${activityPoint.ap})`}
              />
              <UIAttendanceField title="TOTAL AP" value={ap_total} />
              <UIAttendanceField title="TOTAL GP" value={gp_total} />
              <UIAttendanceField
                title="PARTICIPANTS"
                value={participants.length}
              />
              <UIAttendanceField title="DROPS" value={drops.length} />
              <div className="flex py-2  w-full flex-col  justify-between">
                <p className="font-bold">REMARKS</p>
                <p className="text-opacity-75  text-white">
                  {remarks || "No remarks."}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="p-2 md:w-1/2  lg:w-1/3 rounded-lg flex-col flex">
          <AttendanceDropDetail
            gp_total={gp_total}
            setGp_total={setGp_total}
            drops={drops}
            setDrops={setDrops}
          />
          <AttendanceParticipantDetail participants={participants} />
        </div>
      </div>

      <AttendanceDelete
        isDeleting={isDeleting}
        setIsDeleting={setIsDeleting}
        id={id}
      />

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
