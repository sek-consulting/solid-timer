import { createEffect, createSignal, on } from "solid-js";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/input";

export default function Home() {
  const [time, setTime] = createSignal(30);

  const [remaining, setRemaining] = createSignal(0);
  const [text, setText] = createSignal("00:00");

  let ref: NodeJS.Timeout;

  function pad(i: number): string {
    const pre = i < 10 ? "0" : "";
    return `${pre}${i}`;
  }

  createEffect(
    on(
      remaining,
      () => {
        if (remaining() === 0) {
          clearInterval(ref);
          alert("FERTIG!");
        }

        var hh = Math.floor(remaining() / 3600);
        var mm = Math.floor(remaining() / 60) % 60;
        var ss = remaining() % 60;
        setText((hh > 0 ? `${pad(hh)}:` : "") + `${pad(mm)}:${pad(ss)}`);
      },
      { defer: true }
    )
  );

  function set() {
    if (ref) {
      clearInterval(ref);
    }
    setRemaining(time() * 60);
  }

  function start() {
    ref = setInterval(() => {
      setRemaining(remaining() - 1);
    }, 1000);
  }

  function pause() {
    clearInterval(ref);
  }

  return (
    <main class="w-full min-h-screen flex items-center justify-center">
      <Card class="flex flex-col gap-4 p-4 items-center">
        <div class="flex items-center gap-2">
          <Input
            value={time()}
            onChange={(e) => setTime(Number(e.target.value))}
            class="w-16"
          />
          Minuten
        </div>
        <div class="text-6xl font-bold">{text()}</div>
        <div class="flex gap-2">
          <Button onClick={set}>Set</Button>
          <Button onClick={start}>Start</Button>
          <Button onClick={pause}>Pause</Button>
        </div>
      </Card>
    </main>
  );
}
