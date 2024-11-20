import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import Game from "../components/Game";

export default component$(() => {
  return (
    <div>
      <Game />
    </div>
  );
});

export const head: DocumentHead = {
  title: "2048 Game",
  meta: [
    {
      name: "description",
      content: "A 2048 game built with Qwik",
    },
  ],
};