import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { base64Image, userId, fileName } = req.body;

    if (!base64Image || !userId || !fileName) {
      return res
        .status(400)
        .json({ success: false, message: "ข้อมูลไม่ครบถ้วน" });
    }

    try {
      
      const imageBuffer = Buffer.from(base64Image.split(",")[1], "base64");

      
      const folderPath = path.join(
        process.cwd(),
        "public",
        "uploads",
        "foot_images",
        userId
      );
      if (!fs.existsSync(folderPath))
        fs.mkdirSync(folderPath, { recursive: true });

      
      const filePath = path.join(folderPath, fileName);
      fs.writeFileSync(filePath, imageBuffer);

      
      const imageUrl = `/uploads/foot_images/${userId}/${fileName}`;
      res.status(200).json({ success: true, imageUrl });
    } catch (error) {
      
      res
        .status(500)
        .json({ success: false, message: "เกิดข้อผิดพลาดในการจัดเก็บรูปภาพ" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
