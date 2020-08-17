import React, { Fragment } from "react";

interface Props {
  total: number;
}
const AttendanceList: React.FC<Props> = ({ total, children }) => {
  return (
    <Fragment>
      <h1 className="font-medium text-sm px-4 mb-3 text-dark-teal-100">
        <span className="font-semibold">{total}</span> results found
      </h1>
      <ul className="flex flex-col flex-wrap sm:flex-row">{children}</ul>
    </Fragment>
  );
};

export default AttendanceList;
