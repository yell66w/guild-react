import React, { Fragment, useState, useEffect } from "react";
import { DropInterface } from "../../Items/ItemsInterface";
import API from "../../../API/API";
import { useParams } from "react-router-dom";
import _ from "lodash";
import Loader from "react-spinners/BeatLoader";
interface Props extends DropInterface {
  reset?: boolean;
  drops: any;
  setDrops: (value: any) => void;
  isMutating: boolean;
  setIsMutating: (value: any) => void;
  gp_total: number;
  setGp_total: (value: number) => void;
}
const UIAttendanceEditDropField: React.FC<Props> = ({
  name,
  id,
  reset,
  drops,
  setDrops,
  isMutating,
  setIsMutating,
  gp_total,
  setGp_total,
}) => {
  let { id: attendanceId } = useParams();
  const [relationshipId, setRelationshipId] = useState("");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    let isSubscribed = true;
    setIsMounted(true);
    const found = drops.find((drop: any) => {
      if (drop["itemId"] === id) {
        setRelationshipId(drop["id"]);
      }
      return drop["itemId"] === id;
    });
    if (found) {
      if (isSubscribed) {
        setQty(found["qty"]);
        setAdded(true);
      }
    }
    return () => {
      isSubscribed = false;
      setIsMounted(false);
    };
  }, [drops, id]);

  useEffect(() => {
    let isSubscribed = true;
    if (isSubscribed && reset) {
      setAdded(false);
    }
    return () => {
      isSubscribed = false;
    };
  }, [reset]);

  const onToggleDrop = async () => {
    if (!isMutating) {
      setIsMutating(true);
      setIsLoading(true);
      if (!added) {
        //ADD TO ATTENDANCE

        const data = { attendanceId, itemId: id, qty };
        try {
          const res = await API.post(`attendances/drops`, data, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          if (isMounted) setAdded(!added);
          const newDrop = res.data;
          const newGPTotal = gp_total + newDrop.gp_price * newDrop.qty;
          setGp_total(newGPTotal);

          setDrops([...drops, newDrop]);
        } catch (err) {
          console.error(err.message);
        }
      } else if (isUpdating) {
        //UPDATE DROP TO ATTENDANCE
        try {
          const res = await API.put(
            `attendances/drops/${relationshipId}`,
            { qty },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          const foundIdx = drops.findIndex((drop: any) => {
            return drop["id"] === relationshipId;
          });
          const clonedDrops = [...drops];
          /** OLD GP */
          let newGPTotal =
            gp_total -
            clonedDrops[foundIdx].gp_price * clonedDrops[foundIdx].qty;

          clonedDrops[foundIdx] = res.data;

          /** NEW GP */
          newGPTotal +=
            clonedDrops[foundIdx].gp_price * clonedDrops[foundIdx].qty;

          setGp_total(newGPTotal);

          setDrops(clonedDrops);
        } catch (err) {
          console.error(err.message);
        }
        setIsUpdating(false);
      } else if (added) {
        try {
          await API.delete(`attendances/drops/${relationshipId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          if (isMounted) setAdded(!added);

          let clonedDrops = [...drops];
          _.remove(clonedDrops, (drop) => {
            if (drop["id"] === relationshipId) {
              let newGPTotal = gp_total - drop.gp_price * drop.qty;
              setGp_total(newGPTotal);
            }
            return drop["id"] === relationshipId;
          });
          setDrops(clonedDrops);
        } catch (err) {
          console.error(err.message);
        }
      }

      setIsMutating(false);
      setIsLoading(false);
    }
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
              if (added) setIsUpdating(true);
              setQty(parseInt(e.target.value));
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
            className={`focus:outline-none transition duration-300 ease-linear w-1/2 ${
              added
                ? isUpdating
                  ? "text-dark-teal-100"
                  : "text-dark-teal-200"
                : "text-dark-teal-100"
            } transform hover:scale-105`}
          >
            {isLoading ? (
              <Loader size={10} color={"#66fcf1"} />
            ) : added ? (
              isUpdating ? (
                "UPDATE"
              ) : (
                "ADDED"
              )
            ) : (
              "ADD"
            )}
          </button>
        </div>
      </div>
    </Fragment>
  );
};

export default UIAttendanceEditDropField;
