import Head from "next/head";
import { useRouter } from "next/router";
import BooksComp from "../../src/components/User/Books";
import BookDetailPage from "../../src/components/User/Books/BookDetailPage";

const BookById = () => {
  const router = useRouter()
  const { id } = router.query
  return (
    <>
      <Head>
        <title>Buku</title>
        <link rel="icon" href="/dklogo.svg" />
      </Head>
      <BookDetailPage bookId={id as string} />
    </>
  );
};

export default BookById;
