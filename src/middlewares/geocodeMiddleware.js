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
 * - Solo geocodifica si hay 'town' y NO hay coordenadas
 * - No bloquea la petición si falla el geocoding
 * - Enriquece req.body con latitude y longitude
 */
async function geocodeUserLocation(req, res, next) {
  try {
    // 1️⃣ Verificar que haya país (obligatorio)
    if (!req.body.country) {
      // Si no hay país, intentar detectar
      req.body.country = req.body.town ? detectCountry(req.body) : 'ES';
    }

    // 2️⃣ Solo geocodificar si hay ciudad (town es opcional)
    if (!req.body.town) {
      console.log('ℹ️ Usuario sin ciudad específica, solo país:', req.body.country);
      return next(); // No hay ciudad, continuar sin geocodificar
    }

    // 3️⃣ Verificar si ya tiene coordenadas (no sobrescribir)
    const hasCoordinates = 
      req.body.latitude !== undefined && 
      req.body.latitude !== null &&
      req.body.longitude !== undefined && 
      req.body.longitude !== null;

    if (hasCoordinates) {
      console.log('📍 Usuario ya tiene coordenadas, saltando geocodificación');
      return next(); // Ya tiene coordenadas, no geocodificar
    }

    // 4️⃣ Geocodificar la ciudad
    console.log(`🗺️ Geocodificando automáticamente: ${req.body.town}`);
    
    // Usar country del body o detectar automáticamente si no está presente
    const country = req.body.country || detectCountry(req.body);
    
    const coordinates = await geocodingService.geocodeTown(
      req.body.town,
      country
    );

    // 5️⃣ Agregar coordenadas a req.body si se geocodificó correctamente
    if (coordinates) {
      req.body.latitude = coordinates.latitude;
      req.body.longitude = coordinates.longitude;
      
      console.log(
        `✅ Geocodificado: ${req.body.town} (${country}) -> ` +
        `${coordinates.latitude}, ${coordinates.longitude}`
      );
    } else {
      console.warn(`⚠️ No se pudo geocodificar: ${req.body.town}`);
      // No bloqueamos la petición, continuar sin coordenadas
    }

    next();

  } catch (error) {
    // 6️⃣ Si hay error, registrar pero NO bloquear la petición
    console.error('❌ Error en middleware de geocodificación:', error.message);
    next(); // Continuar aunque falle el geocoding
  }
}

/**
 * Detecta el país basado en la ciudad o datos del usuario
 * 
 * @param {Object} userData - Datos del usuario (req.body)
 * @returns {string} Código del país (ES, AR, MX, etc.)
 * 
 * Puedes mejorar esta función según tu lógica de negocio:
 * - Agregar un campo 'country' en el formulario de registro
 * - Usar geolocalización por IP
 * - Tener una lista de ciudades conocidas por país
 */
function detectCountry(userData) {
  // 1️⃣ Si el usuario ya tiene un campo 'country', usarlo
  if (userData.country) {
    return userData.country.toUpperCase();
  }

  // 2️⃣ Detectar por nombre de ciudad (básico)
  const town = userData.town?.toLowerCase() || '';

  // Ciudades españolas comunes
  const spanishCities = [
    'madrid', 'barcelona', 'valencia', 'sevilla', 'zaragoza',
    'málaga', 'murcia', 'palma', 'bilbao', 'alicante',
    'córdoba', 'valladolid', 'vigo', 'gijón', 'hospitalet'
  ];
  if (spanishCities.some(city => town.includes(city))) {
    return 'ES';
  }

  // Ciudades argentinas comunes
  const argentinianCities = [
    'buenos aires', 'córdoba', 'rosario', 'mendoza', 
    'tucumán', 'la plata', 'mar del plata', 'salta'
  ];
  if (argentinianCities.some(city => town.includes(city))) {
    return 'AR';
  }

  // Ciudades mexicanas comunes
  const mexicanCities = [
    'méxico', 'cdmx', 'guadalajara', 'monterrey', 'puebla',
    'tijuana', 'león', 'juárez', 'zapopan', 'mérida'
  ];
  if (mexicanCities.some(city => town.includes(city))) {
    return 'MX';
  }

  // 3️⃣ Por defecto, España (ajusta según tu región principal)
  return 'ES';
}

export default geocodeUserLocation;
