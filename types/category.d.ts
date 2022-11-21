import { TGQLBook } from "./book";

export type TGQLCategory = {
  id: string;
  name: string;
  group: string;
  Book?: TGQLBook[];
  createdAt: Date;
  updatedAt: Date;
};

export type TArgsCreateCategory = {
  data: {
    name: string;
    group: string;
  };
};
export type TArgsUpdateCategory = {
  categoryId: string;
  data: {
    name: string;
    group: string;
  };
};
