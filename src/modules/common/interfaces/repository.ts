// export type RepositoryCreate<PAYLOAD, RES = void> = {
//   create(props: PAYLOAD): Promise<RES>;
// };

export type RepositorySave<PAYLOAD, RES = void> = {
  save(props: PAYLOAD): Promise<RES>;
};

export type RepositoryUpdate<PAYLOAD> = {
  update(props: PAYLOAD): Promise<void>;
};

export type RepositoryRemove = {
  remove(id: string): Promise<void>;
};

export type RepositoryGetById<RES> = {
  getById(id: string): Promise<RES | undefined>;
};

export type RepositoryGetAll<RES> = {
  getAll(): Promise<RES[]>;
};

export type RepositoryFind<QUERY, RES> = {
  find(query: QUERY): Promise<RES>;
};

export type RepositoryReset = {
  reset(): Promise<void>;
};
