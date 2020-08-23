import React, { Fragment } from "react";

interface Props {
  total: number;
  setIsCreatingAttendance: (value: boolean) => void;
}

const AttendanceList: React.FC<Props> = ({
  total,
  children,
  setIsCreatingAttendance,
}) => {
  return (
    <Fragment>
      <div className="flex items-center ">
        <h1 className="w-1/2 font-medium text-sm px-4 mb-3 text-dark-teal-100">
          <span className="font-semibold">{total}</span> results found
        </h1>
        <div
          className={`w-1/2 justify-end flex flex-wrap my-5 items-center sm:px-2`}
        >
          <button
            onClick={() => setIsCreatingAttendance(true)}
            className="focus:outline-none transition duration-300 ease-in-out transform hover:scale-105 text-center  items-center text-xs font-bold py-2 px-3 rounded-full bg-dark-teal-100 text-dark-black-400"
          >
            CREATE ATTENDANCE
          </button>
        </div>
      </div>
      <ul className="flex flex-col flex-wrap sm:flex-row">{children}</ul>

      {/* Listen to updates issue, maybe adding this attendance create as a child */}
    </Fragment>
  );
};

export default AttendanceList;
