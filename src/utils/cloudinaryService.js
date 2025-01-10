import cloudinary from '../cloudinaryConfig.js';
import { Readable } from 'stream';

// Función para subir archivo a Cloudinary
export const uploadToCloudinary = async (file, publicId) => {
  try {
    let uploadResult;
    
    if (Buffer.isBuffer(file)) {
      // Si es un buffer, crear un stream y usar upload_stream
      uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { public_id: publicId },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        
        // Convertir buffer a stream y enviarlo
        Readable.from(file).pipe(stream);
      });
    } else {
      // Si es una ruta de archivo, usar upload normal
      uploadResult = await cloudinary.uploader.upload(file, {
        public_id: publicId,
      });
    }

    console.log('Archivo subido:', uploadResult);
    return uploadResult;
  } catch (error) {
    console.error('Error al subir archivo a Cloudinary:', error);
    throw error;
  }
};

// Generar URL optimizada para entrega
export const getOptimizedUrl = (publicId) => {
  return cloudinary.url(publicId, {
    fetch_format: 'auto',
    quality: 'auto',
    secure: true
  });
};

// Generar URL transformada con más opciones de optimización
export const getTransformedUrl = (publicId, width = 500, height = 500) => {
  return cloudinary.url(publicId, {
    crop: 'fill',
    gravity: 'auto',
    width: width,
    height: height,
    fetch_format: 'auto',
    quality: 'auto',
    secure: true
  });
};