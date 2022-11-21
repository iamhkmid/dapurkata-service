"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookFilter = exports.saveBookPic = void 0;
const uploadFIle_1 = require("../../utils/uploadFIle");
const addCover = async ({ cover, pictureDir }) => {
    const { pathFile } = await (0, uploadFIle_1.saveImg)({ pictureDir, file: cover });
    return { type: "COVER", url: pathFile.split("static")[1] };
};
const addBookPics = async ({ bookPics, pictureDir }) => {
    return bookPics.map(async (img, index) => {
        const { pathFile } = await (0, uploadFIle_1.saveImg)({ pictureDir, file: img });
        return {
            type: `OTHER${new Date().getTime()}`,
            url: pathFile.split("static")[1],
        };
    });
};
const saveBookPic = async (options) => {
    const { cover, bookPics, pictureDir } = options;
    if (cover && bookPics) {
        const img1 = await addCover({ cover, pictureDir });
        const img2 = await Promise.all(await addBookPics({ bookPics, pictureDir }));
        return [img1, ...img2];
    }
    else if (cover) {
        return [await addCover({ cover, pictureDir })];
    }
    else if (bookPics) {
        return await Promise.all(await addBookPics({ bookPics, pictureDir }));
    }
    else {
        return null;
    }
};
exports.saveBookPic = saveBookPic;
const bookFilter = ({ filter, books }) => {
    const { search, skip, take, categoryId } = filter;
    let data = books;
    let numberOfPages = Math.ceil(books.length / take);
    let hasNext = (skip + 1) * take < books.length;
    let numberOfBooks = books.length;
    if (!!search) {
        data = data.filter((book) => book.title.toLowerCase().includes(search.toLowerCase()) ||
            book.authorName.toLowerCase().includes(search.toLowerCase()));
    }
    if (!!categoryId) {
        data = data.filter((book) => categoryId === "all" || book.categoryIds.includes(categoryId));
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
exports.bookFilter = bookFilter;
