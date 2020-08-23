import React from "react";
import UIAttendanceField from "../../AttendanceUI/UI-Attendance-Field";
import { AttendanceParticipantInterface } from "../../../Users/UsersInterface";

interface Props {
  participants: AttendanceParticipantInterface[];
}

const AttendanceParticipantDetail: React.FC<Props> = ({ participants }) => {
  return (
    <div className="flex mt-4 flex-col bg-dark-black-400 rounded-lg p-6">
      <div className="flex justify-center p-2">
        <h1 className="font-bold text-2xl">PARTICIPANTS</h1>
      </div>
      <div className="flex p-2 flex-col text-sm">
        {participants.length > 0 ? (
          <UIAttendanceField title={"NAME"} value="STATUS" />
        ) : (
          <p className="self-center">No Participants.</p>
        )}

        {participants.map((participant) => {
          return (
            <UIAttendanceField
              key={participant.id}
              url={`users/${participant.userId}`}
              isAPI={true}
              value={participant.mark}
            />
          );
        })}
      </div>
    </div>
  );
};

export default AttendanceParticipantDetail;
