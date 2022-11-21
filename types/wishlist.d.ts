export type TWishlistBook = {
  id: string;
  title: string;
  coverURL: string;
  Author: {
    id: string;
    name: string;
  };
};

export type TGQLWishlist = {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  Book: TWishlistBook[];
};

export type TGQLAddWishlist = {
  message: string;
};

export type TGQLAddWishlist = {
  message: string;
};
export type TGQLDeleteWishlist = {
  message: string;
};
