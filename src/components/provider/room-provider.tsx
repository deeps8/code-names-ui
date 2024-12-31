"use client";

import Loading from "@/app/room/[roomId]/loading";
import { PlayerType, RoomState } from "@/types/room-types";
import { useRouter } from "next/navigation";
import React, { createContext, useCallback, useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import JoinRoom from "../feature/join-room";

type RoomContextType = {
  ws: React.MutableRefObject<WebSocket | undefined>;
  data: RoomState;
  setData: React.Dispatch<React.SetStateAction<RoomState | undefined>>;
  currPlayer: PlayerType | undefined;
};

type RoomProviderType = {
  children: React.ReactNode;
  roomid: string;
};

export const RoomContext = createContext<RoomContextType>({} as RoomContextType);

export const RoomProvider: React.FC<RoomProviderType> = ({ children, roomid }) => {
  const ws = useRef<WebSocket>();
  const [data, setData] = useState<RoomState>();
  const [currPlayer, setCurrPlayer] = useState<PlayerType>();
  const [loading, setLoading] = useState<boolean>(true);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const router = useRouter();

  const handleJoinRoom = useCallback(
    (cm: PlayerType & { roomid: string }) => {
      if (window && window["WebSocket"]) {
        setCurrPlayer({ id: cm.id, nickname: cm.nickname });
        const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
        const url = new URL(process.env.NEXT_PUBLIC_API_BASE_PATH || "");

        ws.current = new WebSocket(
          `${protocol}//${url.host}/api/room/join?roomid=${cm.roomid}&playerid=${cm.id}&nickname=${cm.nickname}`
        );

        ws.current.onopen = function () {
          // ws.current?.send("Hello from client");
        };

        ws.current.onclose = function (e) {
          if (e.code === 1000) {
            // show message that the room is not found and redirect to home.
            router.replace("/404");
          }
        };

        ws.current.onerror = function () {};

        ws.current.onmessage = function (e) {
          try {
            const res = JSON.parse(e.data || "");
            if (res?.roomid) {
              setData(res);
              const chatLog = document.getElementById("chat-log");
              if (chatLog) chatLog.scrollTo(0, chatLog.scrollHeight + 1000);
            }
          } catch (err) {
            console.error(err);
          }
        };
      }
    },
    [router]
  );

  useEffect(() => {
    if (ws.current && ws.current.readyState === ws.current.OPEN) {
      setLoading(false);
      return;
    }

    const player: PlayerType = JSON.parse(localStorage.getItem("player") || "{}");
    if (!player?.id || !player?.nickname) {
      setLoading(false);
      setIsDialogOpen(true);
      return;
    }

    handleJoinRoom({ ...player, roomid });

    setLoading(false);

    return () => {
      // window.removeEventListener("beforeunload", handleBeforeUnload);
      if (!ws.current) return;
      if (ws.current.readyState === ws.current.OPEN) {
        ws.current.send("con-closed");
      }
      ws.current.close();
    };
  }, [handleJoinRoom, roomid, router]);

  if (loading) return <Loading />;

  return (
    <>
      <Dialog open={isDialogOpen}>
        <DialogContent hideCloseBtn className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Players List</DialogTitle>
          </DialogHeader>
          <JoinRoom roomid={roomid} handleJoinRoom={handleJoinRoom} closeDialog={() => setIsDialogOpen(false)} />
        </DialogContent>
      </Dialog>
      {data && <RoomContext.Provider value={{ data, setData, ws, currPlayer }}>{children}</RoomContext.Provider>}
    </>
  );
};

/**
 * TODO:
 * 1. Add a way to handle if the player is not registered in the room (no present in localstorage)
 * 2. Add a way to handle if the room is not found
 * 3. Handle loading state of room
 *
 * First it shows the loading screen and
 *  check for the player in the localstorage
 *  then it checks for the room in the server
 *  then it shows the room.
 */
