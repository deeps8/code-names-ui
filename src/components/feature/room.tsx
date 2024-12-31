"use client";

import React, { useCallback, useContext } from "react";
import { Button } from "../ui/button";
import { RoomContext } from "../provider/room-provider";
import { JoinRoomType, PlayerType, TeamCssVar } from "@/types/room-types";

function Room() {
  const { ws, data, currPlayer } = useContext(RoomContext);

  const checkIfJoined = useCallback(
    (team: PlayerType | undefined, type: JoinRoomType) => {
      if (!team) return false;
      if (type === "join-red") return data?.teamred?.findIndex((p) => p.id === team.id) === -1;
      if (type === "join-blue") return data?.teamblue?.findIndex((p) => p.id === team.id) === -1;
      if (type === "join-red-spy") return !data?.redspy?.id;
      if (type === "join-blue-spy") return !data?.bluespy?.id;
      return false;
    },
    [data]
  );

  const isCurrentSpy = useCallback(() => {
    if (data?.redspy?.id === currPlayer?.id || data?.bluespy?.id === currPlayer?.id) return true;
    return false;
  }, [data, currPlayer]);

  const isTurnPlayer = useCallback(
    (turn: number) => {
      if (turn === 82) return data?.teamred?.findIndex((p) => p.id === currPlayer?.id) === -1;
      if (turn === 66) return data?.teamblue?.findIndex((p) => p.id === currPlayer?.id) === -1;
      return true;
    },
    [data, currPlayer]
  );

  const handleJoinTeam = (msg: JoinRoomType) => {
    if (!ws.current) return;
    ws.current.send(JSON.stringify({ msgType: msg, data: null }));
  };

  const handleCardClick = (e: EventTarget) => {
    if (!ws.current) return;

    if (data.hint.word === "" || data.hint.count === 0) return;
    if (!(e instanceof HTMLElement)) return;
    if (isTurnPlayer(data.turn)) return;
    const card = { name: e.dataset.cardName, idx: parseInt(e.dataset.cardIdx || "-1"), team: 79 };

    if (card.idx === -1) return;
    ws.current.send(JSON.stringify({ data: { idx: card.idx }, msgType: "card-click" }));
  };

  const handleHint = (word: string, count: number) => {
    if (!ws.current) return;
    if (data?.redspy?.id === currPlayer?.id && data.turn === 82) {
      ws.current.send(JSON.stringify({ data: { word, count }, msgType: "hint" }));
    }
    if (data?.bluespy?.id === currPlayer?.id && data.turn === 66) {
      ws.current.send(JSON.stringify({ data: { word, count }, msgType: "hint" }));
    }
    return;
  };

  const handleHintSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    //  get the form values
    const formData = new FormData(form);
    const word = formData.get("word") as string;
    const count = parseInt(formData.get("count") as string, 10);

    handleHint(word, count ? count : 1);
  };

  return (
    <div className="flex gap-5">
      <div className="min-w-52 max-w-60">
        <div className="bg-team-one p-3 rounded-sm space-y-4">
          <div className="font-minecraft text-6xl">{data.score[82]}</div>
          <div className="relative border border-white/20 p-2 rounded-sm text-xs text-red-200">
            <span className="absolute -top-2 bg-team-one px-1 text-white/35">Operatives : {data.teamred.length}</span>
            <ul className="flex flex-wrap gap-2">
              {data?.teamred?.map((p) => (
                <li className="bg-red-300/15 px-1" key={p.id}>
                  {p.nickname}
                </li>
              ))}
            </ul>
            {checkIfJoined(currPlayer, "join-red") && (
              <Button
                className="p-1 px-2 bg-yellow-500 rounded-sm h-auto text-xs mt-1"
                onClick={() => handleJoinTeam("join-red")}
              >
                Join Operative
              </Button>
            )}
          </div>
          <div className="relative border border-white/20 p-2 rounded-sm text-xs text-red-200">
            <span className="absolute -top-2 bg-team-one px-1 text-white/35">Spy</span>
            <p>{data?.redspy?.nickname}</p>
            {checkIfJoined(data?.redspy, "join-red-spy") && (
              <Button
                className="p-1 px-2 bg-yellow-500 rounded-sm h-auto text-xs mt-1"
                onClick={() => handleJoinTeam("join-red-spy")}
              >
                Join Spy
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="flex-1">
        <div className="grid grid-cols-5 gap-4" onClick={(e) => handleCardClick(e.target)}>
          {data?.cards?.map((c, i) => {
            return (
              <div
                className="relative bg-secondary/20 border rounded-sm p-2 h-24  grid content-end cursor-pointer"
                key={c.name + i}
                style={{ backgroundColor: `hsl(${TeamCssVar[c.team]}/0.2)`, borderColor: `hsl(${TeamCssVar[c.team]})` }}
              >
                {c.team === 79 && (
                  <div className="absolute inset-0 z-10" data-card-name={c.name} data-card-idx={i}></div>
                )}
                <div
                  className="h-auto w-full bg-background text-center rounded-sm"
                  style={{ backgroundColor: `hsl(${TeamCssVar[c.team]}/0.7)` }}
                >
                  <span className="text-sm font-mono font-semibold">{c.name}</span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-5">
          {isCurrentSpy() ? (
            <div>
              <form className="hint-form" onSubmit={handleHintSubmit}>
                <input className="word-input" type="text" name="word" placeholder="type hint here..." />
                <div className="count-input">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="relative">
                      <input
                        type="radio"
                        className="opacity-0 absolute inset-0"
                        name="count"
                        id={`count-${i}`}
                        value={i}
                      />
                      <label htmlFor={`count-${i}`}>{i}</label>
                    </div>
                  ))}
                </div>
                <Button type="submit" size={"sm"} className="bg-yellow-500 font-bold h-auto font-minecraft">
                  Send
                </Button>
              </form>
            </div>
          ) : (
            <div className="hint">
              {data.hint.count === 0 ? (
                <h3 className="wait">Waiting for hint ...</h3>
              ) : (
                <h3 className="word">
                  {data.hint.word} - <span className="font-minecraft">{data.hint.count}</span>
                </h3>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="min-w-52 max-w-60">
        <div className=" bg-team-two text-primary-foreground p-3 rounded-sm space-y-4">
          <div className="font-minecraft text-6xl">{data.score[66]}</div>
          <div className="relative border border-black/35 p-2 rounded-sm text-xs">
            <span className="absolute -top-2 bg-team-two px-1 text-black/50">Operatives : {data.teamblue.length}</span>
            <ul className="flex flex-wrap gap-2">
              {data?.teamblue?.map((p) => (
                <li className="bg-blue-800/15 px-1" key={p.id}>
                  {p.nickname}
                </li>
              ))}
            </ul>
            {checkIfJoined(currPlayer, "join-blue") && (
              <Button
                className="p-1 px-2 bg-yellow-500 rounded-sm h-auto text-xs mt-1"
                onClick={() => handleJoinTeam("join-blue")}
              >
                Join Operative
              </Button>
            )}
          </div>
          <div className="relative border border-black/35 p-2 rounded-sm text-xs">
            <span className="absolute -top-2 bg-team-two px-1 text-black/50">Spy</span>
            <p>{data?.bluespy?.nickname}</p>
            {checkIfJoined(data?.bluespy, "join-blue-spy") && (
              <Button
                className="p-1 px-2 bg-yellow-500 rounded-sm h-auto text-xs mt-1"
                onClick={() => handleJoinTeam("join-blue-spy")}
              >
                Join Spy
              </Button>
            )}
          </div>
        </div>
        <div
          id="chat-log"
          className="relative h-80 overflow-y-auto overflow-x-hidden mt-4 pb-2 bg-secondary/20 rounded-sm"
        >
          <p className="sticky top-0 bg-secondary text-center py-1 text-xs font-minecraft">GameLogs</p>
          <ul>
            {data.gamelogs.map((log, i) => {
              return (
                <li key={i} data-log-type={log.type}>
                  {log.text}
                </li>
              );
            })}
            <li className="invisible h-8" id="chat-last-el"></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Room;
