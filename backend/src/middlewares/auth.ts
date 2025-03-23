import { Request, Response, NextFunction } from "express";

export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session?.isLoggedIn) {
    res.status(401).send("Unauthorized");
    return;
  }
  next();
};
