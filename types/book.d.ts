import { TGQLAuthor } from "./author";
import { TGQLCategory } from "./category";
import { TGQLBookPic } from "./picture";

export type TGQLBook = {
  id: string;
  title: string;
  description: string;
  edition: string;
  series: string;
  condition: string;
  coverType: string;
  discount: number;
  releaseYear: string;
  numberOfPages: number;
  length: number;
  width: number;
  weight: number;
  stock: number;
  price: number;
  language: string;
  isbn: string;
  pictureDir: string;
  authorId: string;
  Category?: TGQLCategory[];
  Author?: TGQLAuthor;
  BookPicture?: TGQLBookPic[];
  createdAt: Date;
  updatedAt: Date;
};

export type TBooksWithFilter = {
  id: string;
  title: string;
  price: number;
  stock: number;
  discount: number;
  coverType: string;
  authorName: string;
  coverURL: string;
};

export type TDBBooksWithFilter = {
  id: string;
  title: string;
  price: number;
  stock: number;
  discount: number;
  coverType: string;
  authorName: string;
  categoryIds: string[];
  coverURL: string;
};

export type TGQLBooksWithFilter = {
  hasPrev: boolean;
  hasNext: boolean;
  skip: number;
  take: number;
  currentPage: number;
  numberOfPages: number;
  numberOfBooks: number;
  data: TBooksWithFilter[];
};

export type TArgsBooksWithFilter = {
  filter: { search: string; skip: number; take: number; categoryId: string };
};
export type TArgsCreateBookData = {
  title: string;
  description: string;
  edition: string;
  series: string;
  releaseYear: string;
  numberOfPages: number;
  condition: string;
  coverType: string;
  discount: number;
  length: number;
  weight: number;
  stock: number;
  price: number;
  width: number;
  language: string;
  isbn: string;
  authorId: string;
  publisherId: string;
  categoryIds: string[];
};
export type TArgsCreateBook = {
  data: TArgsCreateBookData;
  cover?: any;
  bookPics?: any[];
};

type TDBCreateBook = {
  title: string;
  description: string;
  edition: string;
  series: string;
  condition: string;
  coverType: string;
  releaseYear: string;
  numberOfPages: number;
  length: number;
  weight: number;
  width: number;
  stock: number;
  price: number;
  discount?: number;
  language: string;
  isbn: string;
  slug: string;
  pictureDir: string;
  Author: { connect: { id: string } };
  Publisher: { connect: { id: string } };
  Category: { connect: { id: string }[] };
  BookPicture?: { create: { type: string; url: string }[] };
};

export type TDBUpdateBook = {
  title: string;
  description: string;
  edition: string;
  series: string;
  condition: string;
  coverType: string;
  releaseYear: string;
  numberOfPages: number;
  length: number;
  width: number;
  weight: number;
  stock: number;
  price: number;
  discount?: number;
  language: string;
  isbn: string;
  slug: string;
  pictureDir?: string;
  Author: { connect: { id: string } };
  Publisher: { connect: { id: string } };
  Category: { set: { id: string }[] };
};

export type TArgsUpdateBook = {
  data: {
    bookId: string;
    title: string;
    description: string;
    edition: string;
    series: string;
    condition: string;
    coverType: string;
    discount: number;
    releaseYear: string;
    numberOfPages: number;
    length: number;
    width: number;
    weight: number;
    stock: number;
    price: number;
    language: string;
    isbn: string;
    pictureDir: string;
    authorId: string;
    publisherId: string;
    categoryIds: string[];
  };
};
