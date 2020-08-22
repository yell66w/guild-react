import React, { useState, useEffect } from "react";
import AttendanceList from "./AttendanceList";
import API from "../../API/API";
import Paginate from "react-paginate";
import Loader from "react-spinners/BeatLoader";
import AttendanceItem from "./AttendanceItem";
import { AttendanceInterface } from "./AttendanceInterface";
import AttendanceCreate from "./AttendanceCreate";
const Attendance = () => {
  const [attendances, setAttendances] = useState([]);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [searchField, setSearchField] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingAttendance, setIsCreatingAttendance] = useState(false);
  useEffect(() => {
    let isSubscribed = true;
    const getAttendance = async () => {
      try {
        const res = await API.get("attendances", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          params: {
            page,
            search,
            limit: 12,
          },
        });
        if (isSubscribed) {
          setAttendances(res.data.data);
          setTotalPages(res.data.totalPages);
          setTotal(res.data.total);
        }
        if (page) window.scrollTo({ top: 0, behavior: "smooth" });
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
    getAttendance();
    return function cleanup() {
      isSubscribed = false;
    };
  }, [page, search]);

  const searchSubmit = (e: any) => {
    e.preventDefault();
    setPage(0);
    setSearch(searchField);
  };
  const onPageChange = (selected: number) => {
    setPage(selected);
  };

  if (isLoading) {
    return (
      <div
        className={`bg-black flex justify-center items-center absolute inset-0`}
      >
        <Loader color={"#fff"} />
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-wrap ">
      <div className="sm:flex sm:flex-row sm:flex-wrap sm:px-2">
        <div className=" sm:items-center sm:flex sm:w-2/3 sm:px-2">
          <h1 className="font-bold text-2xl text-center">Attendance</h1>
        </div>
        <div className={`my-3 sm:w-1/3  sm:px-2`}>
          <form onSubmit={(e) => searchSubmit(e)}>
            <input
              type="search"
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
              placeholder="Search an attendance..."
              className="focus:outline-none  w-full p-3 text-sm border-b-2 border-dark-teal-100 text-white bg-transparent"
            />
          </form>
        </div>
      </div>

      <div
        className={`${
          isLoading ? "hidden" : "block"
        } animate__animated animate__fadeIn`}
      >
        {attendances.length > 0 ? (
          <AttendanceList
            setIsCreatingAttendance={setIsCreatingAttendance}
            total={total}
          >
            {attendances.map((attendance: AttendanceInterface) => {
              return <AttendanceItem key={attendance.id} {...attendance} />;
            })}
            <AttendanceCreate
              attendances={attendances}
              setAttendances={setAttendances}
              isModalOpen={isCreatingAttendance}
              setIsModalOpen={setIsCreatingAttendance}
            />
          </AttendanceList>
        ) : (
          <p className="text-sm text-center">No results found.</p>
        )}
      </div>

      <div
        className={`${
          attendances.length > 0 && !isLoading ? "block" : "hidden"
        } flex justify-center mt-12`}
      >
        <Paginate
          onPageChange={(e) => onPageChange(e.selected)}
          forcePage={page}
          initialPage={page}
          pageCount={totalPages}
          containerClassName="flex flex-row"
          pageClassName="p-1 flex flex-col justify-center bg-transparent w-10 h-10 rounded-full focus:outline-none text-center"
          pageLinkClassName="flex hover:text-black hover:bg-white bg-transparent text-white transition duration-200 ease-in-out focus:outline-none text-xs font-bold rounded-full p-3 w-8 h-8 items-center justify-center "
          activeLinkClassName="bg-white text-dark-black-400"
          breakClassName="mr-1"
          nextLabel=">"
          previousLabel="<"
          nextClassName="text-xs font-bold  flex items-center w-10 h-10 bg-transparent rounded-full justify-center"
          nextLinkClassName="transition duration-200 ease-in-out hover:bg-white hover:text-black focus:outline-none bg-transparent w-8 h-8 flex justify-center items-center rounded-full "
          previousClassName="text-xs font-bold  flex items-center w-10 h-10 bg-transparent rounded-full justify-center"
          previousLinkClassName="transition duration-200 ease-in-out hover:bg-white hover:text-black focus:outline-none bg-transparent w-8 h-8 flex justify-center items-center rounded-full "
          pageRangeDisplayed={2}
          marginPagesDisplayed={2}
        />
      </div>
    </div>
  );
};

export default Attendance;
