import React, { useState, useEffect } from "react";
import API from "../../API/API";
import Loader from "react-spinners/BounceLoader";

interface Props {
  title?: string;
  value: any;
  isAPI?: boolean;
  url?: string;
}

const AttendanceField: React.FC<Props> = ({
  title,
  value,
  isAPI = false,
  url = "",
}) => {
  const [name, setName] = useState(""); //refactor
  const [isLoading, setIsLoading] = useState(isAPI);
  useEffect(() => {
    let isSubscribed = true;
    const getName = async () => {
      try {
        const res = await API.get(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (isSubscribed) {
          if (res.data.IGN) setName(res.data.IGN);
          else setName(res.data.name);
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
    if (isAPI) getName();

    return function cleanup() {
      isSubscribed = false;
    };
  }, [isAPI, url]);

  if (isLoading)
    return (
      <div className="flex py-2 border-b border-opacity-25 border-white  w-full flex-row  justify-center">
        <Loader size={20} color={"#fff"} />
      </div>
    );

  return (
    <div className="flex py-2 border-b border-opacity-25 border-white  w-full flex-row  justify-between">
      <p className="font-bold">{title || name}</p>
      <p className="text-opacity-75 text-white">{value}</p>
    </div>
  );
};

export default AttendanceField;
