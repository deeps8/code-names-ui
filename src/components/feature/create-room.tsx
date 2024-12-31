"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { CreateNewRoom } from "@/actions/room";

function CreateRoom() {
  const [rm, setrm] = useState({ username: "", id: "" });
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!rm.username) return;

    // create the form with the creator - name
    /**
     * TODO:
     * 1. Create the room, with the playerID and nickname
     * 2. on success: redirect the user to roome/[roodId]
     * 3. on error: show error
     */
    const payload = { nickname: rm.username, id: window.crypto.getRandomValues(new Uint32Array(1))[0].toString(16) };
    const res = await CreateNewRoom(payload);
    if (res === undefined) {
      // store the data
      localStorage.setItem("player", JSON.stringify(payload));
    } else {
      return;
    }
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
        <Button type="submit" variant={"team-one"} className="font-minecraft text-lg h-auto py-4 w-full my-4">
          Create Room
        </Button>
      </form>
    </div>
  );
}

export default CreateRoom;
