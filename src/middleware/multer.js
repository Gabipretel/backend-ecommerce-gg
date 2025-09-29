import path from "path";
import multer from "multer";
import fs from "fs";

// Photo Storage 
const photoStorage = multer.diskStorage({
    destination: function(req, file, cb){
        const uploadPath = path.join(process.cwd(), "src/images");
        
        // Crear el directorio si no existe
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        
        cb(null, uploadPath);
    },
    filename: function(req, file, cb){
        if(file){
            cb(null, new Date().toISOString().replace(/:/g, "-") 
         + file.originalname);
        }else {
            cb(null, false);
          }
    }
});

// Photo Upload Middleware
const photoUpload = multer({
    storage: photoStorage,
    fileFilter: function (req, file, cb) {
        if (file.mimetype.startsWith("image")) {
          cb(null, true);
        } else {
          cb({ message: "Formato de archivo no soportado" }, false);
        }
      },
      limits: { fileSize: 1024 * 1024 * 5 }, // 5 megabytes
    });

export default photoUpload;
