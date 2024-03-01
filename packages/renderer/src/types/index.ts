export type DataRow<T extends Record<string, unknown>> = {
  data: T;
};

export type EntityState<T extends Record<string, unknown>> = {
  ids: string[];
  entities: Record<string, T>;
};

export type EntityIdSelector<T extends Record<string, unknown>> = (
  entity: T
) => string;
