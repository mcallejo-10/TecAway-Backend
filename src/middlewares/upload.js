import util from 'util';
import multer from 'multer';

// Tamaño máximo del archivo (5MB para mejor compatibilidad con fotos de móviles)
const maxSize = 5 * 1024 * 1024;

// Configuración de multer usando memoryStorage
const storage = multer.memoryStorage();

// Configuración del middleware multer
const upload = multer({
  storage: storage,
  limits: { 
    fileSize: maxSize,
    fieldSize: maxSize,
    fields: 10
  },
  fileFilter: (req, file, cb) => {
    console.log('Archivo recibido:', {
      fieldname: file.fieldname,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size
    });
    
    // Verificar tipos de archivo permitidos - más permisivo para iOS
    const allowedMimeTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/gif',
      'image/webp',
      'image/heic', // Formato nativo de iOS
      'image/heif'  // Formato nativo de iOS
    ];
    
    if (allowedMimeTypes.includes(file.mimetype) || file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      console.error('Tipo de archivo no permitido:', file.mimetype);
      cb(new Error(`Tipo de archivo no permitido: ${file.mimetype}. Solo se permiten imágenes.`), false);
    }
  }
}).single('file');

// Exportar el middleware como promesa
export const uploadFileMiddleware = util.promisify(upload);