import React, { Fragment, useState, useEffect } from "react";
import ReactModal from "react-modal";
import Loader from "react-spinners/BeatLoader";
import API from "../../../../API/API";
import {
  ActivityInterface,
  ActivityPointInterface,
} from "../../../Activity/ActivityInterface";
import UIAttendanceAddOneDrop from "../../AttendanceUI/UI-Attendance-AddOneDrop";
import { DropInterface } from "../../../Items/ItemsInterface";
import { toast } from "react-toastify";
import { AttendanceInterface } from "../../AttendanceInterface/AttendanceInterface";
interface Props {
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
  attendances: AttendanceInterface[];
  setAttendances: (value: any) => void;
}
const AttendanceCreate: React.FC<Props> = ({
  isModalOpen,
  setIsModalOpen,
  attendances,
  setAttendances,
}) => {
  const [isFetchingActivity, setIsFetchingActivity] = useState(false);
  const [activityPoints, setActivityPoints] = useState([]);
  const [drops, setDrops] = useState([]);
  const [filteredDrops, setFilteredDrops] = useState([]);
  const [selectedDrops, setSelectedDrops] = useState([]);
  const [errors, setErrors] = useState({
    activityId: false,
    remarks: false,
    result: false,
    activityPointId: false,
  });
  const [isCreatingAttendance, setIsCreatingAttendance] = useState(false);
  const [searchDropField, setSearchDropField] = useState("");
  const [toReset, setToReset] = useState(false);
  const [data, setData] = useState({
    activityId: "",
    remarks: "",
    result: "",
    activityPointId: "",
  });
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    let isSubscribed = true;
    const getDrops = async () => {
      try {
        const res = await API.get("items", {
          params: {
            type: "DROP",
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (isSubscribed) {
          setDrops(res.data);
        }
      } catch (err) {
        if (isSubscribed) console.log(err.message);
      }
    };
    if (isModalOpen) getDrops();
    return () => {
      isSubscribed = false;
    };
  }, [isModalOpen]);

  useEffect(() => {
    let isSubscribed = true;
    const filterDrops = () => {
      const filtered = drops.filter((drop: DropInterface) => {
        return drop.name.toLowerCase().includes(searchDropField.toLowerCase());
      });

      if (isSubscribed) setFilteredDrops(filtered);
    };
    if (isModalOpen && drops.length > 0) filterDrops();
    return () => {
      isSubscribed = false;
    };
  }, [searchDropField, isModalOpen, drops]);

  useEffect(() => {
    let isSubscribed = true;
    const getActivities = async () => {
      setIsFetchingActivity(true);
      try {
        const res = await API.get("activities", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (isSubscribed) {
          setActivities(res.data);
        }
      } catch (err) {
        if (isSubscribed) {
          console.log(err.message);
        }
      } finally {
        if (isSubscribed) {
          setIsFetchingActivity(false);
        }
      }
    };

    if (isModalOpen) getActivities();

    return () => {
      isSubscribed = false;
    };
  }, [isModalOpen]);

  const reset = () => {
    setData({
      activityId: "",
      remarks: "",
      result: "",
      activityPointId: "",
    });
    setActivityPoints([]);
    setSelectedDrops([]);
    setSearchDropField("");
    setFilteredDrops([]);
  };

  const onActivityChange = (value: string) => {
    if (value) {
      const activity = activities.find(
        (el: ActivityInterface) => el.id === value
      );
      if (activity) {
        setData({ ...data, activityId: value });
        setActivityPoints(activity["activityPoints"]);
      } else {
        console.log("Activity Not Found");
      }
    } else {
      reset();
    }
  };

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
      const res = await API.post("attendances", data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const attendanceId = res.data.id;
      const attendance = res.data;
      if (selectedDrops) {
        for (let idx = 0; idx < selectedDrops.length; idx++) {
          const selectedDrop: DropInterface = selectedDrops[idx];
          const modDrop = { ...selectedDrop, attendanceId };
          try {
            const response = await API.post("attendances/drops", modDrop, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            });
            attendance.gp_total += response.data.gp_price * response.data.qty;
          } catch (error) {
            console.log(error.message);
          }
        }
      }

      const newAttendance = [...attendances];
      newAttendance[0] = attendance;
      setToReset(true);
      reset();
      setIsModalOpen(false);
      toast.success("Successfully created an attendance!", {
        className: "text-sm",
      });
      setAttendances(newAttendance);
    } catch (err) {
      console.log(err.message);
    } finally {
      setIsCreatingAttendance(false);
    }
  };
  const closeModal = async () => {
    if (!isCreatingAttendance) {
      setIsModalOpen(false);
      reset();
    }
  };
  return (
    <Fragment>
      <ReactModal
        isOpen={isModalOpen}
        contentLabel={`AttendanceMark`}
        onRequestClose={closeModal}
        className="max-h-full animate__animated animate__bounceInDown overflow-auto text-white  rounded-lg  w-10/12 sm:w-8/12 md:w-1/2  lg:w-1/3  focus:outline-none bg-dark-black-400"
        overlayClassName="animate__animated animate_fadeIn flex flex-wrap py-5 justify-center items-center fixed inset-0 bg-black bg-opacity-75"
      >
        <div className="h-full  flex flex-col flex-wrap ">
          <div className="flex rounded-t-lg flex-row flex-wrap  py-4 justify-center">
            <h1 className="font-bold text-lg">
              {isCreatingAttendance
                ? "CREATING ATTENDANCE"
                : "CREATE ATTENDANCE"}
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
              <select
                value={data.activityId}
                onChange={function (e) {
                  setErrors({ ...errors, activityId: false });
                  onActivityChange(e.target.value);
                }}
                className={`${
                  errors.activityId ? "border-dark-red-100" : ""
                } text-xs transition duration-150 ease-linear focus:border-teal-100  p-2 w-full  bg-dark-black-400 focus:outline-none border-b  mt-1`}
                name="activityId"
                id="activityId"
              >
                <option value="">Select an attendance</option>
                {activities.map(({ id, name }: ActivityInterface) => {
                  return (
                    <option key={id} value={id}>
                      {name}
                    </option>
                  );
                })}
              </select>
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
                <label className="text-sm font-semibold" htmlFor="remarks">
                  Remarks
                </label>
                <textarea
                  value={data.remarks}
                  onChange={(e) =>
                    setData({ ...data, remarks: e.target.value })
                  }
                  className={`disabled:cursor-not-allowed text-xs transition duration-150 ease-linear focus:border-teal-100  p-2 w-full  bg-dark-black-400 focus:outline-none border-b  mt-1`}
                  name="remarks"
                  id="remarks"
                  placeholder="Write your remarks."
                />
              </div>

              <div className={`mt-3`}>
                <label className="text-sm font-semibold" htmlFor="drops">
                  DROPS
                </label>
                <input
                  className="disabled:cursor-not-allowed text-xs transition duration-150 ease-linear focus:border-teal-100  p-2 w-full  bg-dark-black-400 focus:outline-none border-b  "
                  type="search"
                  placeholder="Search drop..."
                  value={searchDropField}
                  onChange={(e) => setSearchDropField(e.target.value)}
                />
                <div
                  className={`flex flex-row flex-wrap disabled:cursor-not-allowed text-xs transition duration-150 ease-linear   p-2 w-full  bg-dark-black-400 focus:outline-none  mt-1`}
                >
                  {filteredDrops
                    ? filteredDrops.slice(0, 5).map((drop: DropInterface) => {
                        return (
                          <UIAttendanceAddOneDrop
                            reset={toReset}
                            id={drop.id}
                            qty={drop.qty} //? issue
                            gp_price={drop.gp_price}
                            selectedDrops={selectedDrops}
                            setSelectedDrops={setSelectedDrops}
                            key={drop.id}
                            name={drop.name}
                          />
                        );
                      })
                    : null}
                </div>
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
              SUBMIT
            </button>
          </div>
        </div>
      </ReactModal>
    </Fragment>
  );
};

export default AttendanceCreate;
