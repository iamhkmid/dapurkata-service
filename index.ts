import express, { Application } from "express";
import * as http from "http";
import cors from "cors";
import morgan from "morgan";
import altairRoute from "./routes/altairRoute";
import authRoute from "./routes/authRoute";
import notificationRoute from "./routes/notificationRoute";
import cookieParser from "cookie-parser";
import path from "path";
import graphql from "./graphql";
import { graphqlUploadExpress } from "graphql-upload";
import checkFile from "./middleware/checkFile";
import useragent from "express-useragent";
import rateLimit from "express-rate-limit";

const PORT = parseInt(process.env.PORT || "3000");
const dev = process.env.NODE_ENV !== "production";
const corsOptions = { credentials: true, origin: process.env.CLIENT_URL };
const gqlUploadOptions = { maxFileSize: 10000000, maxFiles: 3 };

const apiRequestLimiter = rateLimit({
  windowMs: 1000, // 1 minute
  max: 100, // limit each IP to 2 requests per windowMs
  handler: function (req, res /*next*/) {
    return res.status(429).json({
      error: "You sent too many requests. Please wait a while then try again",
    });
  },
});

const main = async () => {
  const app: Application = express();

  if (process.env.NODE_ENV === "production") {
    app.use((req, res, next) => {
      if (req.header("x-forwarded-proto") !== "https")
        res.redirect(`https://${req.header("host")}${req.url}`);
      else next();
    });
  }

  // app.use(express.static(path.join(__dirname, "../public")));
  // app.use("/_next", express.static(path.join(__dirname, "../.next")));
  app.use(cookieParser());
  app.use(express.json());
  app.use(cors(corsOptions));
  app.use(express.urlencoded({ extended: true }));
  app.use(useragent.express());
  app.use(apiRequestLimiter);

  app.use(
    "/uploads",
    express.static(path.join(process.cwd(), "/server/static/uploads"), {
      fallthrough: true,
      index: false,
      redirect: false,
    })
  );
  app.use("/auth", authRoute);
  app.use("/graphql", graphqlUploadExpress(gqlUploadOptions));
  app.use("/altair", altairRoute);
  app.use("/notification", notificationRoute);

  const httpServer = http.createServer(app);
  await graphql({ app, httpServer });
  httpServer.listen(PORT, (err?: any) => {
    if (err) throw err;
    console.log(`Server is listening on port ${PORT}`);
    console.log(`GraphQL path: "/graphql"`);
  });

  process.on("warning", (warning) => {
    console.warn(warning.name); // Print the warning name
    console.warn(warning.message); // Print the warning message
    console.warn(warning.stack); // Print the stack trace
  });
};

main().catch((ex) => {
  console.error(ex.stack);
  process.exit(1);
});
