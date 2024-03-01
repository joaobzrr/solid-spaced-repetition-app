import { For, type Component } from "solid-js";
import { Button } from "@/components/button";
import { cn } from "@/lib/utils";
import { store } from "./store";

export const GRID_CHAMPION_IMAGE_SIZE = 64;
export const GRID_CHAMPION_BUTTON_BORDER_WIDTH = 2;
export const GRID_GAP = 4;
export const GRID_CHAMPION_BUTTON_SIZE =
  GRID_CHAMPION_IMAGE_SIZE +
  GRID_CHAMPION_BUTTON_BORDER_WIDTH * 2 +
  GRID_GAP * 2;
export const PICKED_CHAMPION_IMAGE_SIZE = 256;

const App: Component = () => {
  return (
    <div
      class="flex h-full items-center justify-center overflow-auto"
    >
      <div class="flex justify-between gap-x-8">
        <ChampionList />
      </div>
    </div>
  );
};

const ChampionList: Component<{ class?: string; }> = (props) => {
  const champions = () => store.champions.filter((champion) => !champion.removed);

  return (
    <div class={props.class}>
      <div
        class={cn("rounded-t-md bg-primary/10 p-4", {
          "rounded-b-md": champions.length === 0
        })}
      >
        <span class="font-bold">List</span>
      </div>
      <div class="relative flex">
        <div
          class="grid p-4 pt-0"
          style={{
            "grid-template-rows": `repeat(10, ${GRID_CHAMPION_BUTTON_SIZE}px)`,
            "grid-template-columns": `repeat(6, ${GRID_CHAMPION_BUTTON_SIZE}px)`
          }}
        />
        <div
          class={cn("absolute grid rounded-b-md bg-primary/10", {
            "p-4 pt-0": champions().length > 0
          })}
          style={{
            "grid-auto-rows": `${GRID_CHAMPION_BUTTON_SIZE}px`,
            "grid-template-columns": `repeat(6, ${GRID_CHAMPION_BUTTON_SIZE}px)`
          }}
        >
          <For each={champions()}>{(champion) => (
            <Button
              onClick={() => store.toggleChampionById(champion.data.id, !champion.removed)}
              class="p-1"
            >
              <ChampionImage championId={champion.data.id} />
            </Button>
          )}</For>
        </div>
      </div>
    </div>
  );
}

const ChampionImage: Component<{ championId: string }> = (props) => {
  const championId = props.championId;
  const champion = store.champions.find((champion) => champion.data.id === championId);
  if (!champion) {
    throw new Error("Unexpected error");
  }

  const url = new URL(`./assets/images/${champion.data.imagePath}`, import.meta.url).href;
  return <img src={url} alt={champion.data.name} />;
}

export default App;
