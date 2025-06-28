import { parse } from "cookie";

export default function handler(req, res) {
  if (req.method === "GET") {
    try {
      const cookie = req.headers.cookie;

      
      if (!cookie) {
        return res.status(401).json({ message: "No session found" });
      }

      const { session: userId } = parse(cookie); 

      if (!userId) {
        return res.status(401).json({ message: "No userId in session" });
      }

      
      return res.status(200).json({ isAuthenticated: true, userId });
    } catch (error) {
      
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  
  return res.status(405).json({ message: "Method not allowed" });
}
