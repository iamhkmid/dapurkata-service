import Document from "next/document";
import { ServerStyleSheet } from "styled-components";

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }
}

// import Document, { Head, Html, Main, NextScript } from "next/document";
// import { ServerStyleSheet } from "styled-components";

// interface Props {
//   styleTags: any;
// }

// export default class MyDocument extends Document<Props> {
//   static getInitialProps({ renderPage }) {
//     const sheet = new ServerStyleSheet();

//     function handleCollectStyles(App) {
//       return (props) => {
//         return sheet.collectStyles(<App {...props} />);
//       };
//     }

//     const page = renderPage((App) => handleCollectStyles(App));
//     const styleTags = sheet.getStyleElement();
//     return { ...page, styleTags };
//   }

//   render() {
//     return (
//       <Html lang="id">
//         <meta charSet="UTF-8" />
//         <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//         <Head>{this.props.styleTags}</Head>
//         <body>
//           <Main />
//         </body>
//         <NextScript />
//       </Html>
//     );
//   }
// }
