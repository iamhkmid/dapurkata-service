import {
  TBooksWithFilter,
  TDBBooksWithFilter,
  TGQLBook,
  TGQLBooksWithFilter,
} from "../../../types/book";
import { TSaveBookPic } from "../../../types/picture";
import { saveImg } from "../../utils/uploadFIle";

const addCover = async ({ cover, pictureDir }) => {
  const { pathFile } = await saveImg({ pictureDir, file: cover });
  return { type: "COVER", url: pathFile.split("static")[1] };
};

type TAddBookPics = {
  bookPics: any[];
  pictureDir: string;
};
const addBookPics = async ({ bookPics, pictureDir }: TAddBookPics) => {
  return bookPics.map(async (img, index) => {
    const { pathFile } = await saveImg({ pictureDir, file: img });
    return {
      type: `OTHER${new Date().getTime()}`,
      url: pathFile.split("static")[1],
    };
  });
};

export const saveBookPic = async (options: TSaveBookPic) => {
  const { cover, bookPics, pictureDir } = options;
  if (cover && bookPics) {
    const img1 = await addCover({ cover, pictureDir });
    const img2 = await Promise.all(await addBookPics({ bookPics, pictureDir }));
    return [img1, ...img2];
  } else if (cover) {
    return [await addCover({ cover, pictureDir })];
  } else if (bookPics) {
    return await Promise.all(await addBookPics({ bookPics, pictureDir }));
  } else {
    return null;
  }
};

// export const saveImgEditBook = async (options: TSaveImg) => {
//   const { image, pictureDir, db } = options;
//   const currImg =
//     image && image.id
//       ? await db.Image.getImage({ where: { id: image.id } })
//       : null;
//   //save file
//   const { pathFile } = await saveFile({ pictureDir, image }).catch((err) => {
//     //delete dir if error
//     removeDir(pictureDir);
//     throw err;
//   });
//   //delete old file
//   const oldImgPath = path.join(process.cwd(), `public${currImg.url}`);
//   fs.access(oldImgPath, fs.constants.F_OK, (err) => {
//     if (!err)
//       fs.unlink(oldImgPath, (unlinkErr) => {
//         if (unlinkErr) throw unlinkErr;
//       });
//   });
//   return {
//     id: image.id || undefined,
//     type: image.type,
//     url: pathFile.split("public")[1],
//   };
// };

type TBookfilter = (p: {
  books: TDBBooksWithFilter[];
  filter: { search: string; skip: number; take: number; categoryId: string };
}) => TGQLBooksWithFilter;

export const bookFilter: TBookfilter = ({ filter, books }) => {
  const { search, skip, take, categoryId } = filter;
  let data = books;
  let numberOfPages = Math.ceil(books.length / take);
  let hasNext = (skip + 1) * take < books.length;
  let numberOfBooks = books.length;

  if (!!search) {
    data = data.filter(
      (book) =>
        book.title.toLowerCase().includes(search.toLowerCase()) ||
        book.authorName.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (!!categoryId) {
    data = data.filter(
      (book) => categoryId === "all" || book.categoryIds.includes(categoryId)
    );
  }

  hasNext = (skip + 1) * take < data.length;
  numberOfPages = Math.ceil(data.length / take);
  numberOfBooks = data.length;
  data = data.slice(skip * take, (skip + 1) * take);

  return {
    hasPrev: skip > 0,
    hasNext,
    currentPage: data.length > 0 ? skip + 1 : 0,
    numberOfPages,
    numberOfBooks,
    skip,
    take,
    data,
  };
};
