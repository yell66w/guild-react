import React, { Fragment, useState, useEffect } from "react";
import API from "../../API/API";
import Loader from "react-spinners/BounceLoader";
import BeatLoader from "react-spinners/BeatLoader";
import moment from "moment";
import { AttendanceInterface } from "./AttendanceInterface";
import ReactModal from "react-modal";
import { Link } from "react-router-dom";

ReactModal.setAppElement("body");

const AttendanceItem: React.FC<AttendanceInterface> = ({
  id,
  status,
  name,
  createdAt,
  author,
  gp_total,
  ap_total,
}) => {
  const [color, setColor] = useState("bg-gray-100");
  const [buttonStyle, setButtonStyle] = useState("bg-gray-100");
  const [marked, setMarked] = useState(false);
  const [markType, setMarkType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [onClickLoading, setOnClickLoading] = useState(false);
  const [totalAP, setTotalAP] = useState(ap_total);

  const setMarkTypes = async (mark: string, remove?: boolean) => {
    const data = { mark };
    try {
      setMarked(!marked);
      if (remove) setMarkType("");
      else setMarkType(data.mark.toUpperCase());

      const res = await API.post(`auth/${id}/attend`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.data.received) {
        setTotalAP(totalAP + res.data.received);
      } else if (res.data.taken) {
        setTotalAP(totalAP - res.data.taken);
      }
      setIsModalOpen(false);

      setOnClickLoading(false);
    } catch (err) {
      setIsModalOpen(false);
      console.log(err.message);
    }
  };

  const checkMark = async () => {
    if (marked) {
      setOnClickLoading(true);
      setIsModalOpen(true);
      setMarkTypes("ontime", true);
    } else {
      setIsModalOpen(true);
    }
  };

  const onMarkSelect = async (mark: string) => {
    setOnClickLoading(true);
    setMarkTypes(mark || "ontime");
  };

  const closeModal = () => {
    if (!onClickLoading) setIsModalOpen(false);
  };

  useEffect(() => {
    let isSubscribed = true;
    const getMarkStatus = async () => {
      if (isSubscribed) {
        setIsLoading(true);
      }
      try {
        const res = await API.get(`auth/${id}/check-mark-status`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (isSubscribed) {
          setMarked(res.data.status);
          if (res.data.status) {
            setMarkType(res.data.type);
          }
        }
      } catch (err) {
        if (isSubscribed) {
          console.log(err.message);
        }
      } finally {
        if (isSubscribed) {
          setIsLoading(false);
        }
      }
    };

    getMarkStatus();

    return function cleanup() {
      isSubscribed = false;
    };
  }, [id]);

  useEffect(() => {
    let isSubscribed = true;
    if (isSubscribed) {
      marked
        ? setButtonStyle(
            "text-dark-black-400 bg-dark-teal-100 hover:bg-teal-300 hover:border-teal-300 "
          )
        : setButtonStyle(
            "text-dark-teal-100 hover:bg-dark-teal-100 hover:text-dark-black-400"
          );
    }

    return function cleanup() {
      isSubscribed = false;
    };
  }, [marked]);

  useEffect(() => {
    let isSubscribed = true;

    if (isSubscribed) {
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
    }

    return function cleanup() {
      isSubscribed = false;
    };
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
      <li className="transition duration-300 ease-in-out  sm:w-1/2 lg:w-1/3  animate__animated animate__fadeIn my-1 px-1 ">
        <div className="flex flex-col bg-dark-black-400 rounded-lg p-4">
          <div className="items-center cursor-default w-full flex flex-row">
            <div
              className={`w-3 h-3  rounded-full ${color} ${
                status === "OPEN" ? "animate-pulse" : ""
              }`}
            ></div>
            <div className="ml-1">
              <p className="text-xs font-medium text-gray-300">{status}</p>
            </div>
          </div>
          <div className="justify-between items-center flex flex-row">
            <div className="cursor-pointer">
              <Link to={`attendance/${id}`} className="font-bold text-lg">
                {name}
              </Link>
            </div>
            <div className="">
              <button
                onClick={() => checkMark()}
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
          <div className="cursor-default">
            <p className="font-bold text-xs text-dark-black-100">{author}</p>
          </div>
          <div className="flex cursor-default flex-row  justify-between">
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
                {totalAP.toFixed(2)}
              </small>
            </div>
          </div>
        </div>
      </li>

      <ReactModal
        isOpen={isModalOpen}
        contentLabel={`AttendanceMark`}
        onRequestClose={closeModal}
        className="animate__animated animate__bounceInDown text-white  rounded-lg  w-10/12 sm:w-8/12 md:w-1/2  lg:w-1/3  focus:outline-none bg-dark-black-400"
        overlayClassName="animate__animated animate_fadeIn flex justify-center items-center fixed inset-0 bg-black bg-opacity-75"
      >
        <div className="h-full  flex flex-col flex-wrap ">
          <div className="flex rounded-t-lg flex-col flex-wrap py-4 items-center">
            <h1 className="font-bold text-lg">
              {onClickLoading
                ? marked
                  ? "Attending..."
                  : "Cancelling..."
                : name}
            </h1>
            <p
              className={`${
                onClickLoading ? "hidden" : "block"
              } text-xs mt-1 text-gray-300`}
            >
              Honesty is the best policy!
            </p>
          </div>
          <div className="flex justify-center  items-center flex-wrap flex-row">
            <div className={`${onClickLoading ? "hidden" : "block"} px-1`}>
              <button
                onClick={() => onMarkSelect("ontime")}
                className="focus:outline-none transition duration-300 ease-in-out hover:text-white hover:bg-dark-green-100 text-dark-green-100 text-xs font-bold border border-dark-green-100   rounded-full px-3 py-1"
              >
                ONTIME
              </button>
            </div>
            <div className={`${onClickLoading ? "hidden" : "block"} px-1`}>
              <button
                onClick={() => onMarkSelect("late")}
                className="focus:outline-none transition duration-300 ease-in-out hover:text-white hover:bg-dark-orange-100 text-dark-orange-100 text-xs font-bold border border-dark-orange-100   rounded-full px-3 py-1"
              >
                LATE
              </button>
            </div>

            <div
              className={`${
                !onClickLoading ? "hidden" : "block"
              } flex justify-center w-full px-2 pb-5`}
            >
              <BeatLoader color={"#4e4e50"} />
            </div>
          </div>
          <div
            className={`${
              onClickLoading ? "hidden" : "block"
            } flex rounded-b-lg flex-row flex-wrap  pb-2 px-4 justify-end`}
          >
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
