import util from 'util';
import multer from 'multer';

// Tamaño máximo del archivo (2MB)
const maxSize = 2 * 1024 * 1024;

// Configuración de multer usando memoryStorage
const storage = multer.memoryStorage();

// Configuración del middleware multer
const upload = multer({
  storage: storage,
  limits: { fileSize: maxSize },
  fileFilter: (req, file, cb) => {
    // Verificar tipos de archivo permitidos
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed!'), false);
    }
  }
}).single('file');

// Exportar el middleware como promesa
export const uploadFileMiddleware = util.promisify(upload);