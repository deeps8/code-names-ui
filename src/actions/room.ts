"use server";
import { PlayerType } from "@/types/room-types";
import { randomUUID } from "crypto";
import { isRedirectError } from "next/dist/client/components/redirect";
import { redirect } from "next/navigation";

export async function CreateNewRoom(cm: PlayerType) {
  try {
    const roomId = randomUUID().toString();
    const url = `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/room/create?roomid=${roomId}&nickname=${cm.nickname}&playerid=${cm.id}`;
    const res = await fetch(url, {
      method: "GET",
    });

    if (res.status === 200) {
      return redirect(`/room/${roomId}`);
    }
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return { message: "Something went wrong while creating room", ok: false, data: null };
  }
}
