import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary.js"; // 🔁 Certifique-se de que o arquivo também usa `export default`

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "os-fotos",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 1600, height: 1600, crop: "limit" }],
  },
});

export const upload = multer({ storage });
