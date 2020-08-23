import React, { Fragment } from "react";
import Modal from "../../../UI/Modal";

interface Props {
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  isMutating: boolean;
}

const AttendanceDropEdit: React.FC<Props> = ({
  isEditing,
  setIsEditing,
  children,
  isMutating,
}) => {
  const closeModal = async () => {
    if (!isMutating) setIsEditing(false);
  };
  return (
    <Fragment>
      <Modal
        onRequestClose={closeModal}
        isOpen={isEditing}
        contentLabel={"AttendanceDropEdit"}
      >
        <div className="flex rounded-t-lg flex-row flex-wrap  py-4 justify-center">
          <h1 className="font-bold text-lg">EDIT DROPS</h1>
        </div>
        <form
          id="createAttendanceForm"
          className="flex w-full flex-col rounded-lg justify-center px-6  bg-transparent "
          //   onSubmit={(e) => onFormSubmit(e)}
        >
          {/* <input
            className="disabled:cursor-not-allowed text-xs transition duration-150 ease-linear focus:border-teal-100  p-2 w-full  bg-dark-black-400 focus:outline-none border-b  "
            type="search"
            placeholder="Search drop..."
            //   value={searchDropField}
            //   onChange={(e) => setSearchDropField(e.target.value)}
          /> issue implement this */}
          <div
            className={`flex flex-row flex-wrap disabled:cursor-not-allowed text-xs transition duration-150 ease-linear   p-2 w-full  bg-dark-black-400 focus:outline-none  mt-1`}
          >
            {children}
          </div>
        </form>

        <div
          className={`
             flex rounded-b-lg flex-row-reverse flex-wrap pb-4 px-10 `}
        >
          <button
            onClick={closeModal}
            className="focus:outline-none hover:text-red-800 text-xs text-red-700"
          >
            {isMutating ? "Please Wait..." : "CLOSE"}
          </button>
        </div>
      </Modal>
    </Fragment>
  );
};

export default AttendanceDropEdit;
