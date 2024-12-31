type RoomState = {
  roomid: string;
  owner: PlayerType;
  cards: CardType[];
  teamred: PlayerType[];
  teamblue: PlayerType[];
  gamelogs: MessageType[];
  redspy: PlayerType;
  bluespy: PlayerType;
  score: {
    66: number;
    82: number;
  };
  turn: number;
  hint: {
    word: string;
    count: number;
  };
};

type PlayerType = {
  id: string;
  nickname: string;
};

type CardType = {
  name: string;
  team: number;
};

type MessageType = {
  playerid: string;
  text: string;
  type: string;
};

type JoinRoomType = "join-red" | "join-blue" | "join-red-spy" | "join-blue-spy";

export const TeamCssVar: Record<number, string> = {
  82: "var(--team-one)",
  66: "var(--team-two)",
  79: "var(--team-neutral)",
  71: "var(--ring)",
  65: "var(--black)",
};

export type { RoomState, PlayerType, CardType, MessageType, JoinRoomType };
