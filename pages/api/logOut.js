
import { serialize } from "cookie";

export default function handler(req, res) {
  if (req.method === "POST") {
    
    const { sessionType } = req.body;

    
    if (!sessionType) {
      return res.status(400).json({ message: "Session type is required" });
    }

    
    res.setHeader("Set-Cookie", serialize(sessionType, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", 
      maxAge: 0, 
      path: "/",
    }));

    return res.status(200).json({ message: `${sessionType} logout successful` });
  }

  res.status(405).json({ message: "Method Not Allowed" });
}
