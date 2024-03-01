import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";
import { EntityState, EntityIdSelector } from "../types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function makeEntityState<T extends Record<string, unknown>>(
  entities: T[],
  selectId?: EntityIdSelector<T>
): EntityState<T> {
  return {
    ids: entities.map((c) => getEntityId(c, selectId)),

    entities: entities.reduce((acc, entity) => {
      const id = getEntityId(entity, selectId);
      return {
        ...acc,
        [id]: entity
      };
    }, {})
  };
}

function getEntityId<T extends Record<string, unknown>>(
  entity: T,
  selectId?: EntityIdSelector<T>
) {
  return selectId?.(entity) ?? (entity as unknown as { id: string }).id;
}


