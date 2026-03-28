import jwt, { JwtPayload } from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";

interface AuthJwtPayload extends JwtPayload {
  userId?: string;
  id?: string;
}

type AuthRequest = Request & { user?: AuthJwtPayload; userId?: string };

const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized access" });
  }

  const token = authHeader.split(" ")[1];
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({ message: "JWT_SECRET is not set" });
  }

  try {
    const decoded = jwt.verify(token, secret) as AuthJwtPayload;
    req.user = decoded;
    req.userId = decoded.userId || decoded.id || (decoded as any)._id;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

const requireAuthForFilters = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const { name, type } = req.query;

  if (!name && !type) {
    return next();
  }

  return verifyToken(req, res, next);
};

export { verifyToken, requireAuthForFilters };
