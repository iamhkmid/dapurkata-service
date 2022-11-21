import { TDBBook } from "./book";
import { TDBGetUser } from "./user";

export type TGQLSCart = {
  id: string;
  Book: {
    id: string;
    title: string;
    price: number;
    weight: number;
    discount: number;
    Author: {
      id: string;
      name: string;
    };
    coverURL: string;
  };
  amount: number;
  createdAt: Date;
  updatedAt: Date;
};
export type TGQLCreateSCart = {
  id: string;
  message: string;
};
export type TGQLUpdateSCart = {
  id: string;
  message: string;
};
export type TGQLDeleteSCart = {
  id: string;
  message: string;
};
type TArgsCreateSChart = {
  bookId: string;
  amount: number;
};
type TArgsUpdateSChart = {
  cartId: string;
  amount: number;
};
