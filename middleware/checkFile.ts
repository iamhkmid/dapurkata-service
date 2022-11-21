import { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";

const checkFile = (req: Request, res: Response, next: NextFunction) => {
  fs.access(
    path.join(process.cwd(), `/server/static/uploads${req.path}`),
    fs.constants.R_OK,
    (error) => {
      if (error) {
        res.status(404).json({ message: "File not found" }).end;
      } else {
        next();
      }
    }
  );
};

export default checkFile;
