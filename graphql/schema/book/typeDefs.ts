import { gql } from "apollo-server-express";

const typeDefs = gql`
  type Query {
    book(bookId: ID!): Book
    books: [Book]
    booksWithFilter(filter: BookFilter!): BooksWithFilter
  }

  type Mutation {
    createBook(data: cBookData!, cover: Upload, otherImgs: [Upload]): Book
      @auth(requires: ADMIN)
    updateBook(data: uBookData!): Book @auth(requires: ADMIN)
    deleteBook(bookId: ID!): Book @auth(requires: ADMIN)
  }

  input BookFilter {
    search: String
    skip: Int!
    take: Int!
    categoryId: String
  }
  input cBookData {
    title: String!
    description: String!
    edition: String
    series: String
    releaseYear: String!
    numberOfPages: Int!
    condition: String!
    discount: Int
    coverType: String!
    length: Float!
    width: Float!
    weight: Int!
    stock: Int!
    price: Int!
    language: String!
    isbn: String
    categoryIds: [String]
    authorId: String!
    publisherId: String!
  }

  input uBookData {
    bookId: ID!
    title: String
    description: String
    edition: String
    series: String
    releaseYear: String
    numberOfPages: Int
    condition: String
    discount: Int
    coverType: String
    length: Float
    width: Float
    weight: Int
    stock: Int
    price: Int
    language: String
    isbn: String
    categoryIds: [String]
    authorId: String
    publisherId: String
  }

  type BooksWithFilter {
    hasPrev: Boolean
    hasNext: Boolean
    skip: Int
    take: Int
    currentPage: Int
    numberOfPages: Int
    numberOfBooks: Int
    data: [DataBooksWithFilter]
  }
  type DataBooksWithFilter {
    id: ID
    title: String
    price: Int
    stock: Int
    discount: Int
    coverType: String
    authorName: String
    coverURL: String
  }
  type Book {
    id: ID
    title: String
    description: String
    edition: String
    series: String
    releaseYear: String
    numberOfPages: Int
    length: Int
    width: Float
    weight: Float
    stock: Int
    price: Int
    condition: String
    discount: Int
    coverType: String
    language: String
    isbn: String
    slug: String
    pictureDir: String
    Category: [Category]
    authorId: String
    Author: Author
    Publisher: Publisher
    BookPicture: [BookPicture]
    createdAt: Date
    updatedAt: Date
  }

  type BookPicture {
    id: ID
    url: String
    type: String
    createdAt: Date
    updatedAt: Date
  }
`;

export default typeDefs;
