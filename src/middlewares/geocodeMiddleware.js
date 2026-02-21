/**
 * 🗺️ Middleware de Geocodificación Automática
 * 
 * Intercepta las peticiones de creación/actualización de usuarios
 * y geocodifica automáticamente la ciudad si no tiene coordenadas.
 * 
 * Se ejecuta ANTES del controlador para enriquecer req.body con coordenadas.
 */

import geocodingService from '../services/geocodingService.js';

/**
 * Geocodifica automáticamente la ubicación del usuario
 * 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object  
 * @param {NextFunction} next - Express next middleware
 * 
 * Lógica:
 * - Solo geocodifica si hay 'city' y NO hay coordenadas
 * - No bloquea la petición si falla el geocoding
 * - Enriquece req.body con latitude y longitude
 */
async function geocodeUserLocation(req, res, next) {
  try {
    // 1️⃣ Verificar si ya tiene coordenadas válidas (del autocomplete del frontend)
    const hasCoordinates = 
      req.body.latitude !== undefined && 
      req.body.latitude !== null &&
      req.body.longitude !== undefined && 
      req.body.longitude !== null &&
      !isNaN(req.body.latitude) &&
      !isNaN(req.body.longitude);

    if (hasCoordinates) {
      console.log('✅ Coordenadas recibidas del frontend (autocomplete):', 
        `${req.body.latitude}, ${req.body.longitude}`);
      return next(); // Ya tiene coordenadas válidas, continuar
    }

    // 2️⃣ FALLBACK: Si no hay coordenadas, intentar geocodificar
    // (esto no debería pasar si el frontend usa el autocomplete correctamente)
    console.warn('⚠️ No hay coordenadas en la petición, geocodificando como fallback...');

    if (!req.body.city) {
      console.log('❌ No hay ciudad para geocodificar');
      return next(); // Dejar que el validator rechace la petición
    }

    // Asegurar que hay país
    if (!req.body.country) {
      req.body.country = detectCountry(req.body);
    }

    // 3️⃣ Geocodificar como fallback
    console.log(`🗺️ Geocodificando (fallback): ${req.body.city}, ${req.body.country}`);
    
    const coordinates = await geocodingService.geocodeTown(
      req.body.city,
      req.body.country
    );

    // 4️⃣ Agregar coordenadas si se geocodificó correctamente
    if (coordinates) {
      req.body.latitude = coordinates.latitude;
      req.body.longitude = coordinates.longitude;
      
      console.log(
        `✅ Geocodificado (fallback): ${req.body.city} (${req.body.country}) -> ` +
        `${coordinates.latitude}, ${coordinates.longitude}`
      );
    } else {
      console.warn(`⚠️ No se pudo geocodificar: ${req.body.city}`);
      // El validator rechazará la petición por falta de coordenadas
    }

    next();

  } catch (error) {
    // Si hay error, registrar pero NO bloquear (el validator se encargará)
    console.error('❌ Error en middleware de geocodificación:', error.message);
    next();
  }
}

/**
 * Detecta el país basado en la ciudad o datos del usuario
 * 
 * @param {Object} userData - Datos del usuario (req.body)
 * @returns {string} Nombre del pais (ej: Espana, Argentina, Mexico)
 * 
 * Puedes mejorar esta función según tu lógica de negocio:
 * - Agregar un campo 'country' en el formulario de registro
 * - Usar geolocalización por IP
 * - Tener una lista de ciudades conocidas por país
 */
function detectCountry(userData) {
  // 1️⃣ Si el usuario ya tiene un campo 'country', usarlo
  if (userData.country) {
    return userData.country.trim();
  }

  // 2️⃣ Detectar por nombre de ciudad (básico)
  const city = userData.city?.toLowerCase() || '';

  // Ciudades españolas comunes
  const spanishCities = [
    'madrid', 'barcelona', 'valencia', 'sevilla', 'zaragoza',
    'málaga', 'murcia', 'palma', 'bilbao', 'alicante',
    'córdoba', 'valladolid', 'vigo', 'gijón', 'hospitalet'
  ];
  if (spanishCities.some((knownCity) => city.includes(knownCity))) {
    return 'Espana';
  }

  // Ciudades argentinas comunes
  const argentinianCities = [
    'buenos aires', 'córdoba', 'rosario', 'mendoza', 
    'tucumán', 'la plata', 'mar del plata', 'salta'
  ];
  if (argentinianCities.some((knownCity) => city.includes(knownCity))) {
    return 'Argentina';
  }

  // Ciudades mexicanas comunes
  const mexicanCities = [
    'méxico', 'cdmx', 'guadalajara', 'monterrey', 'puebla',
    'tijuana', 'león', 'juárez', 'zapopan', 'mérida'
  ];
  if (mexicanCities.some((knownCity) => city.includes(knownCity))) {
    return 'Mexico';
  }

  // 3️⃣ Por defecto, España (ajusta según tu región principal)
  return 'Espana';
}

export default geocodeUserLocation;
