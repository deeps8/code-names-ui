import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

function Custom404() {
  return (
    <div className="max-w-96 text-center mx-auto py-10">
      <h1 className="font-minecraft text-2xl text-team-two my-8 mt-0">404 : Room Not Found</h1>
      <Link href={"/"}>
        <Button type="button" variant={"team-one"} className="font-minecraft text-lg h-auto py-4 w-full my-4">
          Home
        </Button>
      </Link>
    </div>
  );
}

export default Custom404;
