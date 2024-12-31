"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { PlayerType } from "@/types/room-types";

type JoinRoomPropsType = {
  roomid: string;
  handleJoinRoom: (cm: PlayerType & { roomid: string }) => void;
  closeDialog: () => void;
};

function JoinRoom(data: JoinRoomPropsType) {
  const [rm, setrm] = useState({ username: "", id: window.crypto.getRandomValues(new Uint32Array(1))[0].toString(16) });
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!rm.username) return;

    const payload = { nickname: rm.username, id: rm.id };
    localStorage.setItem("player", JSON.stringify(payload));
    data.handleJoinRoom({ ...payload, roomid: data.roomid });
    data.closeDialog();
  };
  return (
    <div>
      <form onSubmit={(e) => handleSubmit(e)}>
        <Input
          type="text"
          required
          className="h-auto text-base py-4 border-0 bg-primary/10 font-mono"
          placeholder="enter your nickname..."
          minLength={5}
          pattern="^[a-zA-Z0-9_]*$"
          onChange={(e) => setrm({ ...rm, username: e.target.value })}
        />
        <Button type="submit" variant={"team-two"} className="font-minecraft text-lg h-auto py-4 w-full my-4">
          Join Room
        </Button>
      </form>
    </div>
  );
}

export default JoinRoom;
