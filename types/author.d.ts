import { TGQLBook } from "./book";

export type TGQLAuthor = {
  id: string;
  name: string;
  Book?: TGQLBook[];
  createdAt: Date;
  updatedAt: Date;
};

export type TArgsCreateAuthor = {
  data: {
    name: string;
  };
};
export type TArgsUpdateAuthor = {
  authorId: string;
  data: {
    name: string;
  };
};
