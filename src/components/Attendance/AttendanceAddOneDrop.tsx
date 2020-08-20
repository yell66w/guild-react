import React, { Fragment, useState, useEffect } from "react";
import { DropInterface } from "../Items/ItemsInterface";
import _ from "lodash";
interface Props extends DropInterface {
  selectedDrops: any;
  setSelectedDrops: (value: any) => void;
  reset: boolean;
}
const AttendanceAddOneDrop: React.FC<Props> = ({
  name,
  id,
  selectedDrops,
  setSelectedDrops,
  reset,
}) => {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    let isSubscribed = true;
    if (isSubscribed) setAdded(false);
    return () => {
      isSubscribed = false;
    };
  }, [reset]);

  const onToggleDrop = () => {
    if (!added) {
      const newDrops = [...selectedDrops, { itemId: id, qty }];
      setSelectedDrops(newDrops);
    } else {
      let clonedDrops = [...selectedDrops];
      _.remove(clonedDrops, (drop) => {
        return drop["itemId"] === id;
      });
      setSelectedDrops(clonedDrops);
    }
    setAdded(!added);
  };

  return (
    <Fragment>
      <div className="border-b flex flex-wrap w-full py-1 border-white border-opacity-50">
        <div className="w-1/2">
          <h1 className="">{name}</h1>
        </div>
        <div className=" w-1/2 justify-between flex flex-wrap flex-row">
          <input
            placeholder="qty"
            min={1}
            onChange={function (e) {
              if (!added) setQty(parseInt(e.target.value));
            }}
            value={qty}
            className="focus:outline-none bg-dark-black-400 text-center w-1/2"
            type="number"
            name=""
            id=""
          />
          <button
            type="button"
            onClick={onToggleDrop}
            className="focus:outline-none transition duration-300 ease-linear w-1/2  text-dark-teal-100 transform hover:scale-105"
          >
            {added ? "ADDED" : "ADD"}
          </button>
        </div>
      </div>
    </Fragment>
  );
};

export default AttendanceAddOneDrop;
