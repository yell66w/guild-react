import React, { Fragment } from "react";
import AttendanceItem from "./AttendanceItem";

const AttendanceList = () => {
  return (
    <Fragment>
      <div>Attendance List</div>
      <AttendanceItem />
      <AttendanceItem />
      <AttendanceItem />
      <AttendanceItem />
    </Fragment>
  );
};

export default AttendanceList;
