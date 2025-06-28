import { serialize } from "cookie";

export default function handler(req, res) {
  if (req.method === "POST") {
    const { userId } = req.body;

    
    if (!userId) {
      return res.status(400).json({ message: "UserId is required" });
    }

    
    res.setHeader(
      "Set-Cookie",
      serialize("session", userId, {
        httpOnly: true, 
        secure: process.env.NODE_ENV === "production", 
        maxAge: 60 * 60 * 24, 
        path: "/", 
      })
    );

    return res.status(200).json({ message: "Session created" });
  }

  
  return res.status(405).json({ message: "Method not allowed" });
}
