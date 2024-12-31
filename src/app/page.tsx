import CreateRoom from "@/components/feature/create-room";

export default function Home() {
  return (
    <main className="grid min-h-screen place-content-center">
      <div className="text-center my-8">
        <h1 className="font-minecraft text-8xl text-team-two my-8">CODENAMES</h1>
        <div className="tag-line text-lg font-mono text-muted-foreground">
          <h2>Decode the Clues, Uncover the Spies - A Game of Wits!</h2>
        </div>
      </div>
      <CreateRoom />
    </main>
  );
}
