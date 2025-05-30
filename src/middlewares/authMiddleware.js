import jwt, { verify } from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token)
    return res.status(403).json({ status: false, message: "Token inválido" });

  jwt.verify(
    token.replace("Bearer", ""),
    process.env.JWT_SECRET,
    (err, decoded) => {
      if (err)
        return res
          .status(401)
          .json({ status: false, message: "Token inválido" });

      req.user = decoded;
      next();
    }
  );
};
