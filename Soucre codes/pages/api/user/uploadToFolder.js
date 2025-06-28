import { promises as fs } from "fs";
import formidable from "formidable";
import path from "path";


export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadDir = path.resolve(process.cwd(), "public/uploads/user"); 

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const form = formidable({ keepExtensions: true, uploadDir });

  
  await fs.mkdir(uploadDir, { recursive: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      
      return res.status(500).json({ message: "Error parsing form" });
    }

    const { UserId } = fields;
    if (!UserId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const userUploadDir = path.join(uploadDir, UserId.toString()); 

    
    await fs.mkdir(userUploadDir, { recursive: true });

    const file = files.file[0]; 
    if (!file || typeof file.newFilename !== "string") {
      return res
        .status(400)
        .json({ message: "File upload failed or filename is missing" });
    }

    const filePath = path.join(userUploadDir, file.newFilename);

    try {
      
      await fs.rename(file.filepath, filePath);
    } catch (moveError) {
      
      return res.status(500).json({ message: "Error saving file" });
    }

    return res.status(200).json({
      success: true,
      imageUrl: `/uploads/user/${UserId}/${file.newFilename}`,
    });
  });
}
