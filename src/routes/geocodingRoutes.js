/**
 * 🗺️ Rutas de Geocodificación
 * 
 * Endpoints para geocodificar ciudades y calcular distancias.
 * Útil para testing y para que el frontend pueda geocodificar manualmente.
 */

import express from 'express';
import geocodingService from '../services/geocodingService.js';

const router = express.Router();

/**
 * GET /api/geocode/autocomplete
 * Autocompletado de ciudades y países
 * 
 * Query: ?query=Barc
 * Response: [{ display_name: "Barcelona, España", latitude: 41.3851, longitude: 2.1734, city: "Barcelona", country: "España" }, ...]
 * 
 * @swagger
 * /api/geocode/autocomplete:
 *   get:
 *     summary: Autocompletado de ciudades
 *     tags: [Geocoding]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Texto de búsqueda (mínimo 2 caracteres)
 *         example: Barc
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Número máximo de resultados
 *         example: 5
 *     responses:
 *       200:
 *         description: Lista de ubicaciones sugeridas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   display_name:
 *                     type: string
 *                     example: Barcelona, Cataluña, España
 *                   city:
 *                     type: string
 *                     example: Barcelona
 *                   country:
 *                     type: string
 *                     example: España
 *                   latitude:
 *                     type: number
 *                     example: 41.3851
 *                   longitude:
 *                     type: number
 *                     example: 2.1734
 *       400:
 *         description: Parámetros inválidos
 */
router.get('/geocode/autocomplete', async (req, res) => {
  try {
    const { query, limit } = req.query;

    // Validación
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ 
        error: 'El parámetro "query" es obligatorio' 
      });
    }

    if (query.length < 2) {
      return res.status(400).json({ 
        error: 'El parámetro "query" debe tener al menos 2 caracteres' 
      });
    }

    const maxResults = limit ? parseInt(limit) : 5;
    if (isNaN(maxResults) || maxResults < 1 || maxResults > 20) {
      return res.status(400).json({ 
        error: 'El parámetro "limit" debe ser un número entre 1 y 20' 
      });
    }

    console.log(`🔍 Autocompletado para: "${query}" (max: ${maxResults})`);

    // Buscar sugerencias
    const suggestions = await geocodingService.autocomplete(query, maxResults);

    // Respuesta exitosa
    res.json(suggestions);

  } catch (error) {
    console.error('❌ Error en autocompletado:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      message: error.message 
    });
  }
});

/**
 * POST /api/geocode
 * Geocodifica una ciudad a coordenadas
 * 
 * Body: { "location": "Barcelona" }
 * Response: { "latitude": 40.4168, "longitude": -3.7038 }
 * 
 * @swagger
 * /api/geocode:
 *   post:
 *     summary: Geocodifica una ciudad
 *     tags: [Geocoding]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               location:
 *                 type: string
 *                 example: Barcelona
 *             required:
 *               - location
 *     responses:
 *       200:
 *         description: Coordenadas obtenidas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 latitude:
 *                   type: number
 *                   example: 40.4168
 *                 longitude:
 *                   type: number
 *                   example: -3.7038
 *       404:
 *         description: Ubicación no encontrada
 *       400:
 *         description: Parámetros inválidos
 */
router.post('/geocode', async (req, res) => {
  try {
    const { location } = req.body;

    // Validación
    if (!location || typeof location !== 'string') {
      return res.status(400).json({ 
        error: 'El campo "location" es obligatorio y debe ser una cadena de texto' 
      });
    }

    console.log(`📍 Request de geocodificación: ${location}`);

    // Geocodificar usando el método genérico
    const coordinates = await geocodingService.geocodeLocation(location);

    if (!coordinates) {
      return res.status(404).json({ 
        error: `No se encontró la ubicación: ${location}`
      });
    }

    // Respuesta exitosa - solo latitud y longitud
    res.json({
      latitude: coordinates.latitude,
      longitude: coordinates.longitude
    });

  } catch (error) {
    console.error('❌ Error en geocodificación:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      message: error.message 
    });
  }
});

/**
 * POST /api/geocode/batch
 * Geocodifica múltiples ciudades (respetando rate limit)
 * 
 * Body: { "locations": ["Madrid", "Barcelona", "Valencia"] }
 * Response: [{ "location": "Madrid", "coordinates": {...} }, ...]
 */
router.post('/geocode/batch', async (req, res) => {
  try {
    const { locations } = req.body;

    // Validación
    if (!Array.isArray(locations) || locations.length === 0) {
      return res.status(400).json({ 
        error: 'El campo "locations" debe ser un array no vacío' 
      });
    }

    // Límite de 50 ubicaciones por request (para evitar timeout)
    if (locations.length > 50) {
      return res.status(400).json({ 
        error: 'Máximo 50 ubicaciones por request',
        received: locations.length,
        max: 50
      });
    }

    console.log(`📍 Request de geocodificación batch: ${locations.length} ubicaciones`);

    // Geocodificar todas
    const results = await geocodingService.geocodeBatch(locations);

    res.json({
      total: results.length,
      successful: results.filter(r => r.coordinates !== null).length,
      failed: results.filter(r => r.coordinates === null).length,
      results
    });

  } catch (error) {
    console.error('❌ Error en geocodificación batch:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      message: error.message 
    });
  }
});

/**
 * POST /api/geocode/distance
 * Calcula la distancia entre dos puntos
 * 
 * Body: {
 *   from: { latitude: 40.4168, longitude: -3.7038 },
 *   to: { latitude: 41.3851, longitude: 2.1734 }
 * }
 * Response: { distance: 504.2, unit: "km" }
 */
router.post('/geocode/distance', async (req, res) => {
  try {
    const { from, to } = req.body;

    // Validación
    if (!from?.latitude || !from?.longitude || !to?.latitude || !to?.longitude) {
      return res.status(400).json({ 
        error: 'Se requieren coordenadas válidas para "from" y "to"',
        example: {
          from: { latitude: 40.4168, longitude: -3.7038 },
          to: { latitude: 41.3851, longitude: 2.1734 }
        }
      });
    }

    // Calcular distancia
    const distance = geocodingService.calculateDistance(
      from.latitude,
      from.longitude,
      to.latitude,
      to.longitude
    );

    res.json({
      from,
      to,
      distance,
      unit: 'km'
    });

  } catch (error) {
    console.error('❌ Error en cálculo de distancia:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      message: error.message 
    });
  }
});

/**
 * GET /api/geocode/cache/stats
 * Obtiene estadísticas de la cache de geocodificación
 * 
 * Response: { size: 10, entries: ["madrid_es", "barcelona_es", ...] }
 */
router.get('/geocode/cache/stats', (req, res) => {
  try {
    const stats = geocodingService.getCacheStats();
    
    res.json({
      message: 'Estadísticas de cache de geocodificación',
      ...stats,
      note: 'La cache se reinicia cuando se reinicia el servidor'
    });

  } catch (error) {
    console.error('❌ Error obteniendo estadísticas de cache:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      message: error.message 
    });
  }
});

/**
 * DELETE /api/geocode/cache
 * Limpia la cache de geocodificación (útil para desarrollo/testing)
 * 
 * Response: { message: "Cache limpiada" }
 */
router.delete('/geocode/cache', (req, res) => {
  try {
    const statsBefore = geocodingService.getCacheStats();
    geocodingService.clearCache();
    
    res.json({
      message: 'Cache de geocodificación limpiada',
      entriesRemoved: statsBefore.size
    });

  } catch (error) {
    console.error('❌ Error limpiando cache:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      message: error.message 
    });
  }
});

export default router;
