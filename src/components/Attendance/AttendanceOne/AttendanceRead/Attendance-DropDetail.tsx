import React, { Fragment, useState, useEffect } from "react";
import UIAttendanceField from "../../AttendanceUI/UI-Attendance-Field";
import {
  AttendanceDropInterface,
  DropInterface,
} from "../../../Items/ItemsInterface";
import AttendanceDropEdit from "../AttendanceEdit/Attendance-DropEdit";
import UIAttendanceEditDropField from "../../AttendanceUI/UI-Attendance-EditDropField";
import API from "../../../../API/API";
interface Props {
  drops: AttendanceDropInterface[];
  setDrops: (value: any) => void;
  gp_total: number;
  setGp_total: (value: number) => void;
}

const AttendanceDropDetail: React.FC<Props> = ({
  drops,
  setDrops,
  gp_total,
  setGp_total,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [items, setitems] = useState([]);
  const [isMutating, setIsMutating] = useState(false);

  useEffect(() => {
    let isSubscribed = true;
    const getDrops = async () => {
      try {
        const res = await API.get("items", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          params: {
            type: "DROP",
          },
        });
        if (isSubscribed) setitems(res.data);
      } catch (err) {}
    };
    getDrops();

    return () => {
      isSubscribed = false;
    };
  }, []);
  return (
    <Fragment>
      <div className="flex flex-col bg-dark-black-400 rounded-lg p-6">
        <div className="flex flex-col items-center p-2">
          <h1 className="font-bold text-2xl">DROPS</h1>
          <div className="mt-1 flex flex-row justify-around">
            <div className="px-1">
              <button
                onClick={() => setIsEditing(true)}
                className="focus:outline-none transition duration-300 ease-in-out hover:text-white hover:bg-dark-orange-100 text-dark-orange-100 text-xs font-bold border border-dark-orange-100   rounded-full px-3 py-1"
              >
                EDIT
              </button>
            </div>
          </div>
        </div>
        <div className="flex p-2 flex-col text-sm">
          {drops.length > 0 ? (
            <UIAttendanceField title={"NAME"} value="QTY" />
          ) : (
            <p className="self-center">No Drops.</p>
          )}
          {drops.map((drop) => {
            return (
              <UIAttendanceField
                key={drop.id}
                value={drop.qty}
                url={`items/${drop.itemId}`}
                isAPI={true}
              />
            );
          })}
        </div>
      </div>
      <AttendanceDropEdit
        isMutating={isMutating}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
      >
        {items
          ? items.map((item: DropInterface) => {
              return (
                <UIAttendanceEditDropField
                  gp_total={gp_total}
                  setGp_total={setGp_total}
                  isMutating={isMutating}
                  setIsMutating={setIsMutating}
                  drops={drops}
                  setDrops={setDrops}
                  id={item.id}
                  qty={item.qty} //? issue
                  gp_price={item.gp_price}
                  key={item.id}
                  name={item.name}
                />
              );
            })
          : null}
      </AttendanceDropEdit>
    </Fragment>
  );
};

export default AttendanceDropDetail;
