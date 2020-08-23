import React from "react";
import Loader from "react-spinners/BeatLoader";

const LoadingScreen = () => {
  return (
    <div
      className={`bg-black flex justify-center items-center absolute inset-0`}
    >
      <Loader color={"#fff"} />
    </div>
  );
};

export default LoadingScreen;
