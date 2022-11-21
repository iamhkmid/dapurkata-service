import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { db } from "../graphql/services/db";

const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.AuthToken;
  const usePrisma = async (decoded) => {
    try {
      const user = await db.user.findUnique({
        where: {
          id: decoded.id,
        },
        select: {
          role: true,
        },
      });
      if (user && user.role === "ADMIN") {
        next();
      } else {
        res.status(401).json({ message: "Access Denied" }).end;
      }
    } catch (err) {
      res.status(401).json({ message: "database error" }).end;
      throw err;
    }
  };
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      err
        ? res.status(401).json({ message: err.message }).end
        : usePrisma(decoded);
    });
  } else {
    res.status(401).json({ message: "Access Denied" }).end;
  }
};

export default requireAuth;
