"use client";
import React, { useContext } from "react";
import { RoomContext } from "../provider/room-provider";

function RoomHeader() {
  const { currPlayer, data } = useContext(RoomContext);
  const copyRoomLink = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    (e.target as HTMLButtonElement).innerText = "copied!";
    navigator.clipboard.writeText(window.location.href);
    setTimeout(() => {
      (e.target as HTMLButtonElement).innerText = "copy link";
    }, 2000);
  };

  return (
    <header className="px-4 py-2 flex flex-row max-w-7xl mx-auto bg-background items-center justify-between">
      <div className="">
        <h2 className="font-minecraft text-xl">CODENAMES</h2>
      </div>
      <div>
        <h2 className="text-xl font-minecraft bg-white/5 px-3 py-1 rounded-sm">
          {data.turn === 66 ? (
            <span className="text-team-two">Blue&apos;s</span>
          ) : (
            <span className="text-team-one">Red&apos;s</span>
          )}{" "}
          turn
        </h2>
      </div>
      <div>
        {currPlayer && (
          <div className="flex flex-row items-center space-x-2">
            <button
              onClick={copyRoomLink}
              className="bg-white text-black px-2 py-1 font-semibold mr-5 font-mono text-xs"
            >
              copy link
            </button>
            <span className="font-minecraft">{currPlayer.nickname}</span>
          </div>
        )}
      </div>
    </header>
  );
}

export default RoomHeader;
