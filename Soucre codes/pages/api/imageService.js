

export const fetchSessionData = async () => {
  try {
    const sessionRes = await fetch("/api/getSession");
    if (!sessionRes.ok) throw new Error("Failed to fetch session data");
    return await sessionRes.json();
  } catch (error) {
    
    return null;
  }
};
export const saveImageToDatabase = async (
  base64Image,
  userId,
  imageCategoryId,
  side,
  fileName,
  orderId
) => {
  try {
    
    const imageSaveResponse = await fetch("/api/user/uploadFootImageToFolder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        base64Image,
        userId,
        fileName,
      }),
    });

    const { imageUrl, success } = await imageSaveResponse.json();
    if (!success || !imageUrl) throw new Error("Failed to upload image");
    const Datetime = new Date().toISOString();
    
    const dbSaveResponse = await fetch("/api/user/saveFootImage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        imageCategoryId,
        side,
        pathUrl: imageUrl,
        Datetime,
        orderId,
      }),
    });

    const dbSaveData = await dbSaveResponse.json();
    if (!dbSaveData.id) throw new Error("Failed to save image to database");

    return dbSaveData;
  } catch (error) {
    
    return null;
  }
};
