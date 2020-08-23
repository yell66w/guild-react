import React, { Fragment, useState, useEffect } from "react";
import Loader from "react-spinners/BeatLoader";
import API from "../../../../API/API";
import { ActivityPointInterface } from "../../../Activity/ActivityInterface";
import { toast } from "react-toastify";
import { AttendanceEditInterface } from "../../AttendanceInterface/AttendanceInterface";
import Modal from "../../../UI/Modal";
interface Props {
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
  attendance: AttendanceEditInterface | any;
  setAttendance: (value: any) => void;
}
const AttendanceEdit: React.FC<Props> = ({
  isModalOpen,
  setIsModalOpen,
  attendance,
  setAttendance,
}) => {
  const [isFetchingActivity, setIsFetchingActivity] = useState(false);
  const [activityPoints, setActivityPoints] = useState([]);
  const [errors, setErrors] = useState({
    activityId: false,
    remarks: false,
    result: false,
    status: false,
    activityPointId: false,
  });
  const [isCreatingAttendance, setIsCreatingAttendance] = useState(false);
  const [data, setData] = useState({
    activityId: attendance.activityId,
    remarks: attendance.remarks,
    result: attendance.result,
    status: attendance.status,
    activityPointId: attendance.activityPointId,
  });

  useEffect(() => {
    let isSubscribed = true;
    const getActivityPoints = async () => {
      try {
        setIsFetchingActivity(true);
        const res = await API.get(`activities/${attendance.activityId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (isSubscribed) {
          setActivityPoints(res.data.activityPoints);
          setIsFetchingActivity(false);
        }
      } catch (err) {
        console.log(err.message);
      }
    };
    if (isModalOpen) getActivityPoints();
    return () => {
      isSubscribed = false;
    };
  }, [attendance, isModalOpen]);

  const validateForm = () => {
    let error = false;
    if (!data.activityId) {
      setErrors({ ...errors, activityId: true });
      error = true;
    } else if (!data.activityPointId) {
      setErrors({ ...errors, activityPointId: true });
      error = true;
    } else if (!data.result) {
      setErrors({ ...errors, result: true });
      error = true;
    } else if (!data.status) {
      setErrors({ ...errors, status: true });
      error = true;
    }
    if (error) {
      throw new Error("Something went wrong!");
    }
  };
  const onFormSubmit = async (e: any) => {
    e.preventDefault();
    setIsCreatingAttendance(true);
    try {
      validateForm();
      const res = await API.put(`/attendances/${attendance.id}`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setIsModalOpen(false);
      setAttendance(res.data);
      toast.success("Successfully updated the attendance!", {
        className: "text-sm",
      });
    } catch (err) {
      console.log(err.message);
    } finally {
      setIsCreatingAttendance(false);
    }
  };
  const closeModal = async () => {
    if (!isCreatingAttendance) {
      setIsModalOpen(false);
    }
  };
  return (
    <Fragment>
      <Modal
        isOpen={isModalOpen}
        contentLabel="AttendanceEdit"
        onRequestClose={closeModal}
      >
        <div className="flex rounded-t-lg flex-row flex-wrap  py-4 justify-center">
          <h1 className="font-bold text-lg">
            {isCreatingAttendance ? "UPDATING ATTENDANCE" : "EDIT ATTENDANCE"}
          </h1>
        </div>
        <div
          className={`${
            isFetchingActivity || isCreatingAttendance ? "hidden" : "block"
          } flex items-center flex-wrap flex-row p-4`}
        >
          <form
            id="createAttendanceForm"
            className="flex w-full flex-col rounded-lg justify-center px-4 bg-transparent "
            onSubmit={(e) => onFormSubmit(e)}
          >
            <label className="text-sm font-semibold" htmlFor="activityId">
              Attendance
            </label>
            <input
              value={attendance.name}
              className={`cursor-not-allowed text-xs transition duration-150 ease-linear focus:border-teal-100  p-2 w-full  bg-dark-black-400 focus:outline-none border-b  mt-1`}
              name="activityId"
              id="activityId"
              disabled
            ></input>
            <div className={` mt-3`}>
              <label
                className="text-sm font-semibold"
                htmlFor="activityPointId"
              >
                Point Type
              </label>
              <select
                disabled={!!!data.activityId}
                value={data.activityPointId}
                onChange={function (e) {
                  setErrors({ ...errors, activityPointId: false });

                  setData({ ...data, activityPointId: e.target.value });
                }}
                className={`${
                  errors.activityPointId ? "border-dark-red-100" : ""
                } disabled:cursor-not-allowed text-xs transition duration-150 ease-linear focus:border-teal-100  p-2 w-full  bg-dark-black-400 focus:outline-none border-b  mt-1`}
                name="activityPointId"
                id="activityPointId"
              >
                <option value="">Select a point type</option>
                {activityPoints
                  ? activityPoints.map(
                      ({ id, name, ap }: ActivityPointInterface) => {
                        return (
                          <option key={id} value={id}>
                            {name} ({ap} AP)
                          </option>
                        );
                      }
                    )
                  : null}
              </select>
            </div>
            <div className={`mt-3`}>
              <label className="text-sm font-semibold" htmlFor="result">
                Result
              </label>
              <select
                onChange={function (e) {
                  setErrors({ ...errors, result: false });
                  setData({ ...data, result: e.target.value });
                }}
                value={data.result}
                className={`${
                  errors.result ? "border-dark-red-100" : ""
                } disabled:cursor-not-allowed text-xs transition duration-150 ease-linear focus:border-teal-100  p-2 w-full  bg-dark-black-400 focus:outline-none border-b  mt-1`}
                name="result"
                id="result"
              >
                <option value="">Select result</option>
                <option value="WON">WON</option>
                <option value="LOST">LOST</option>
              </select>
            </div>

            <div className={`mt-3`}>
              <label className="text-sm font-semibold" htmlFor="result">
                STATUS
              </label>
              <select
                onChange={function (e) {
                  setErrors({ ...errors, status: false });
                  setData({ ...data, status: e.target.value });
                }}
                value={data.status}
                className={`${
                  errors.status ? "border-dark-red-100" : ""
                } disabled:cursor-not-allowed text-xs transition duration-150 ease-linear focus:border-teal-100  p-2 w-full  bg-dark-black-400 focus:outline-none border-b  mt-1`}
                name="status"
                id="status"
              >
                <option value="">Select status</option>
                <option value="OPEN">OPEN</option>
                <option value="CLOSED">CLOSED</option>
              </select>
            </div>
            <div className={`mt-3`}>
              <label className="text-sm font-semibold" htmlFor="remarks">
                Remarks
              </label>
              <textarea
                maxLength={20}
                value={data.remarks}
                onChange={(e) => setData({ ...data, remarks: e.target.value })}
                className={`resize-none disabled:cursor-not-allowed text-xs transition duration-150 ease-linear focus:border-teal-100  p-2 w-full  bg-dark-black-400 focus:outline-none border-b  mt-1`}
                name="remarks"
                id="remarks"
                placeholder="Write your remarks."
              />
            </div>
          </form>
        </div>
        <div
          className={`${
            isFetchingActivity || isCreatingAttendance ? "block" : "hidden"
          } flex items-center justify-center flex-wrap flex-row p-4`}
        >
          <Loader color={"#fff"} />
        </div>
        <div
          className={`${
            isCreatingAttendance || isFetchingActivity ? "hidden" : "block"
          }
             flex rounded-b-lg flex-row-reverse flex-wrap pb-4 px-4 `}
        >
          <button
            onClick={closeModal}
            className="focus:outline-none hover:text-red-800 text-xs text-red-700"
          >
            Cancel
          </button>
          <button
            form="createAttendanceForm"
            className="mr-2 focus:outline-none transition duration-300 ease-in-out transform hover:scale-105 text-xs font-bold px-2 py-1 rounded-full  text-black bg-dark-teal-100"
            type="submit"
          >
            UPDATE
          </button>
        </div>
      </Modal>
    </Fragment>
  );
};

export default AttendanceEdit;
