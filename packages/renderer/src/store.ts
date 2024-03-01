import { createStore } from "solid-js/store";
import { makeEntityState } from "@/lib/utils";
import { EntityState, DataRow } from "./types";
import { champions as championItems } from "@/data/champions.json";
import { championClasses as championClassItems } from "@/data/championClasses.json";

export type ChampionItem = typeof championItems[number];
export type ChampionClassItem = typeof championClassItems[number];

export type ChampionUiState = {
  id: string;
  removed: boolean;
  disabled: boolean;
};

export type Champion = Omit<ChampionUiState, "id"> & {
  data: ChampionItem;
};

type LocalStorageState = {
  currRandomizedChampionId?: string;
  championUiState: ChampionUiState[];
}

function getFromLocalStorage<K extends keyof LocalStorageState>(key: K) {
  const value = localStorage.getItem(key);
  return value ? (JSON.parse(value) as LocalStorageState[K]) : undefined;
}

function saveToLocalStorage<K extends keyof LocalStorageState>(
  key: K,
  value: LocalStorageState[K]
) {
  if (value === undefined) {
    localStorage.removeItem(key);
  } else {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

function updateOne(
  championEntityState: EntityState<Champion>,
  championId: string,
  data: Partial<Champion>
) {
  const champion = championEntityState.entities[championId];
  return {
    ...championEntityState,
    entities: {
      ...championEntityState.entities,
      [championId]: {
        ...champion,
        ...data
      }
    }
  };
}

function updateMany(
  championEntityState: EntityState<Champion>,
  championIds: string[],
  data: Partial<Champion>
) {
  const newChampionEntityState = Object.assign({}, championEntityState);
  for (const championId of championIds) {
    const champion = championEntityState.entities[championId];
    championEntityState.entities[championId] = {
      ...champion,
      ...data
    };
  }
  return newChampionEntityState;
}

function saveChampionUiState(championEntityState: EntityState<Champion>) {
  const championUiState = championEntityState.ids.map((id) => {
    const { removed, disabled } = championEntityState.entities[id];
    return { id, removed, disabled };
  });
  saveToLocalStorage("championUiState", championUiState);
}

function selectRowId<T extends Record<string, unknown>>(row: T) {
  return (row as unknown as DataRow<{ id: string }>).data.id;
}

function makeChampion(item: ChampionItem) {
  return {
    data: item,
    removed: false,
    disabled: false
  };
}

function makeInitialChampionEntityState(championClassEntityState: EntityState<ChampionClassItem>) {
  const savedChampionUiState = getFromLocalStorage("championUiState");
  let champions: Champion[] = [];
  if (savedChampionUiState) {
    const idToChampionItemMap = new Map(
      championItems.map((item) => [item.id, item])
    );
    for (const { id, ...uiData } of savedChampionUiState) {
      const championItem = idToChampionItemMap.get(id);
      if (!championItem) {
        throw new Error("Unexpected error");
      }
      champions.push({ ...uiData, data: championItem });
      idToChampionItemMap.delete(id);
    }

    for (const item of idToChampionItemMap.values()) {
      champions.push(makeChampion(item));
    }
  } else {
    champions = championItems.map((item) => makeChampion(item));
  }

  champions.sort((champion1, champion2) => {
    if (champion1.data.classId === champion2.data.classId) {
      return champion1.data.name.localeCompare(champion2.data.name);
    } else {
      const classIndex1 = championClassEntityState.ids.indexOf(
        champion1.data.classId
      );
      const classIndex2 = championClassEntityState.ids.indexOf(
        champion2.data.classId
      );
      return classIndex1 - classIndex2;
    }
  });

  const championEntityState = makeEntityState(champions, selectRowId);
  return championEntityState;
}

const makeInitialState = () => {
  const championClassEntityState = makeEntityState(championClassItems);
  const championEntityState = makeInitialChampionEntityState(championClassEntityState);
  const currRandomizedChampionId = getFromLocalStorage("currRandomizedChampionId");
  const prevRandomizedChampionId = undefined as string | undefined;
  const hoveredChampionId = undefined as string | undefined;
  const keyboardState = {
    ctrl: false,
    shift: false
  };

  return {
    championClassEntityState,
    championEntityState,
    currRandomizedChampionId,
    prevRandomizedChampionId,
    hoveredChampionId,
    keyboardState
  };
}

const [data, setData] = createStore(makeInitialState());

export const store = {
  get champions() {
    return data.championEntityState.ids.map((id) => data.championEntityState.entities[id]);
  },
  toggleChampionById(championId: string, removed: boolean) {
    setData("championEntityState", updateOne(
      data.championEntityState,
      championId,
      { removed }
    ));
  }
}
