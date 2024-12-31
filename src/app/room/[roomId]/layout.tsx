import React from "react";

function RoomLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <main>{children}</main>;
}

export default RoomLayout;
