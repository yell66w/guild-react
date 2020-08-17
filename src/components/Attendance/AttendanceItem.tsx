import React, { Fragment, useState, useEffect } from "react";
import API from "../../API/API";
import Loader from "react-spinners/BounceLoader";
import moment from "moment";
import { AttendanceInterface } from "./AttendanceInterface";
import ReactModal from "react-modal";

interface Props extends AttendanceInterface {
  setOnMarkChange: (value: boolean) => void;
  onMarkChange: boolean;
}
ReactModal.setAppElement("body");

const AttendanceItem: React.FC<Props> = ({
  id,
  status,
  name,
  createdAt,
  author,
  gp_total,
  ap_total,
  onMarkChange,
  setOnMarkChange,
}) => {
  const [color, setColor] = useState("bg-gray-100");
  const [buttonStyle, setButtonStyle] = useState("bg-gray-100");
  const [marked, setMarked] = useState(false);
  const [markType, setMarkType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onMarkSelect = async (mark: string) => {
    const data = { mark };
    try {
      setMarked(!marked);
      setMarkType(data.mark.toUpperCase());
      setIsModalOpen(false);

      await API.post(`auth/${id}/attend`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setOnMarkChange(!onMarkChange);
    } catch (err) {
      setIsModalOpen(false);

      console.log(err.message);
    }
  };
  const onMarkClick = async () => {
    if (marked) {
      try {
        const data = { mark: markType.toLowerCase() };
        setMarked(!marked);
        setMarkType("");
        await API.post(`auth/${id}/attend`, data, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setOnMarkChange(!onMarkChange);
      } catch (err) {
        console.log(err.message);
      }
    } else setIsModalOpen(true);
  };

  useEffect(() => {
    const getMarkStatus = async () => {
      setIsLoading(true);
      try {
        const res = await API.get(`auth/${id}/check-mark-status`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setMarked(res.data.status);
        if (res.data.status) {
          setMarkType(res.data.type);
        }
      } catch (err) {
        console.log(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    getMarkStatus();
  }, [id]);

  useEffect(() => {
    marked
      ? setButtonStyle(
          "text-dark-black-400 bg-dark-teal-100 hover:bg-teal-300 hover:border-teal-300 "
        )
      : setButtonStyle(
          "text-dark-teal-100 hover:bg-dark-teal-100 hover:text-dark-black-400"
        );
  }, [marked]);

  useEffect(() => {
    switch (status) {
      case "OPEN":
        setColor("bg-green-600");
        break;
      case "CLOSED":
        setColor("bg-red-600");
        setButtonStyle(
          "cursor-not-allowed text-white bg-dark-red-100 border-dark-red-100 hover:bg-dark-red-100 hover:border-dark-red-100 "
        );
        break;
      case "PAID":
        setColor("bg-dark-orange-100");
        setButtonStyle(
          "cursor-not-allowed  text-white bg-dark-red-100 border-dark-red-100 hover:bg-dark-red-100 hover:border-dark-red-100 "
        );
        break;

      default:
        setColor("bg-gray-100");

        break;
    }
  }, [status]);

  if (isLoading) {
    return (
      <li className="sm:w-1/2 lg:w-1/3  px-1 w-full my-1">
        <div className="flex bg-dark-black-400 h-24 rounded-lg flex-col items-center justify-center">
          <Loader color={"#4e4e50"} />
        </div>
      </li>
    );
  }

  return (
    <Fragment>
      <li className="sm:w-1/2 lg:w-1/3  animate__animated animate__fadeIn my-1 px-1 ">
        <div className="flex flex-col bg-dark-black-400 rounded-lg p-4">
          <div className="items-center w-full flex flex-row">
            <div
              className={`w-3 h-3 rounded-full ${color} ${
                status === "OPEN" ? "animate-pulse" : ""
              }`}
            ></div>
            <div className="ml-1">
              <p className="text-xs font-medium text-gray-300">{status}</p>
            </div>
          </div>
          <div className="justify-between items-center flex flex-row">
            <div className="">
              <h1 className="font-bold text-lg">{name}</h1>
            </div>
            <div className="">
              <button
                onClick={onMarkClick}
                disabled={status !== "OPEN"}
                className={`transition duration-300 ease-linear focus:outline-none px-3 py-1 border border-dark-teal-100 font-bold rounded-full text-xs ${buttonStyle}`}
              >
                {status === "OPEN"
                  ? marked
                    ? markType
                    : "MARK"
                  : marked
                  ? markType
                  : "ABSENT"}
              </button>
            </div>
          </div>
          <div>
            <p className="font-bold text-xs text-dark-black-100">{author}</p>
          </div>
          <div className="flex flex-row  justify-between">
            <small className="text-xs text-dark-black-100 text-opacity-50">
              {moment(createdAt).format("MMM D, YYYY - h:mm a")}
            </small>
            <div className="flex flex-row">
              <div className="mr-1 bg-dark-yellow-100 w-4 h-4 rounded-full"></div>

              <small className="mr-2 text-xs font-bold text-opacity-50 text-white">
                {gp_total.toFixed(2)}
              </small>

              <div className="mr-1 bg-purple-700 w-4 h-4 rounded-full"></div>
              <small className="text-xs font-bold text-opacity-50 text-white">
                {ap_total.toFixed(2)}
              </small>
            </div>
          </div>
        </div>
      </li>

      <ReactModal
        isOpen={isModalOpen}
        contentLabel={`AttendanceMark`}
        onRequestClose={() => setIsModalOpen(false)}
        className="animate__animated animate__bounceInDown text-white  rounded-lg  w-10/12 sm:w-8/12 md:w-1/2  lg:w-1/3  focus:outline-none bg-dark-black-400"
        overlayClassName="animate__animated animate_fadeIn flex justify-center items-center fixed inset-0 bg-black bg-opacity-75"
      >
        <div className="h-full  flex flex-col flex-wrap ">
          <div className="flex rounded-t-lg flex-row flex-wrap bg-dark-black-500 py-4 justify-center">
            <h1 className="font-bold text-lg">{name}</h1>
          </div>
          <div className="flex  items-center flex-wrap flex-row p-4">
            <div className="w-1/2  px-2">
              <button
                onClick={() => onMarkSelect("ontime")}
                className="focus:outline-none transition duration-300 ease-in-out transform hover:scale-105 text-white w-full  text-xl rounded-full py-4 px-6 font-bold  bg-dark-green-100"
              >
                ONTIME
              </button>
            </div>
            <div className=" w-1/2 px-2">
              <button
                onClick={() => onMarkSelect("late")}
                className="focus:outline-none transition duration-300 ease-in-out transform hover:scale-105 text-white w-full  text-xl rounded-full py-4 px-6 font-bold  bg-dark-orange-100"
              >
                LATE
              </button>
            </div>
          </div>
          <div className=" flex rounded-b-lg flex-row flex-wrap  pb-2 px-4 justify-end">
            <button
              onClick={() => setIsModalOpen(false)}
              className="focus:outline-none hover:text-red-800 text-sm text-red-700"
            >
              Cancel
            </button>
          </div>
        </div>
      </ReactModal>
    </Fragment>
  );
};

export default AttendanceItem;
