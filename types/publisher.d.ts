import { TGQLBook } from "./book";

export type TGQLPublisher = {
  id: string;
  name: string;
  Book?: TGQLBook[];
  createdAt: Date;
  updatedAt: Date;
};

export type TArgsCreatePublisher = {
  data: {
    name: string;
  };
};
export type TArgsUpdatePublisher = {
  publisherId: string;
  data: {
    name: string;
  };
};
