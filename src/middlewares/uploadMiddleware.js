
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary.js"; 

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "os-fotos",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 1600, height: 1600, crop: "limit" }],
  },
});

export const upload = multer({ storage });


export const uploadFields = upload.fields([
  { name: "fotosIniciaisInput", maxCount: 10 },   
  { name: "fotosAntesInput", maxCount: 10 },       
  { name: "fotosDuranteInput", maxCount: 10 },     
  { name: "fotosDepoisInput", maxCount: 10 },      
  { name: "fotosMedicaoInput", maxCount: 10 },     
]);