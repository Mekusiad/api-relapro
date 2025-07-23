
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary.js"; 

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const [campo, numeroOs] = file.fieldname.split("__");

    return {
      folder: `os-fotos/${numeroOs}`,
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      transformation: [{ width: 1600, height: 1600, crop: "limit" }],
    };
  }
});

export const upload = multer({ storage });



export const uploadFields = upload.any();

// export const uploadFields = upload.fields([
//   { name: "fotosIniciaisInput", maxCount: 5 },   
//   { name: "fotosAntesInput", maxCount: 5 },       
//   { name: "fotosDuranteInput", maxCount: 5 },     
//   { name: "fotosDepoisInput", maxCount: 5 },      
//   { name: "fotosPontoAtencaoInput", maxCount: 5 },     
//   { name: "fotosMedicaoInput", maxCount: 5 },     
// ]);
