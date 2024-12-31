import Room from "@/components/feature/room";
import RoomHeader from "@/components/feature/room-header";
import { RoomProvider } from "@/components/provider/room-provider";
import React from "react";

function PlayRoom({ params }: { params: { roomId: string } }) {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <RoomProvider roomid={params.roomId}>
        <div className="sticky top-0 z-50 w-full">
          <RoomHeader />
        </div>
        <div className="flex-1 max-w-7xl px-4 py-2 mx-auto w-full">
          <Room />
        </div>
      </RoomProvider>
    </div>
  );
}

export default PlayRoom;
