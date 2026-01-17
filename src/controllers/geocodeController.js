/**
 * 🗺️ Controlador para geocodificar usuarios existentes
 * 
 * TEMPORAL: Solo para migración inicial de datos
 */

import User from '../models/userModel.js';
import geocodingService from '../services/geocodingService.js';

/**
 * Geocodifica todos los usuarios con ciudad pero sin coordenadas
 * 
 * GET /api/geocode-all-users
 */
export async function geocodeAllUsers(req, res) {
  try {
    console.log('🚀 Iniciando geocodificación masiva de usuarios...');

    // 1️⃣ Buscar usuarios con town pero sin coordenadas
    const users = await User.findAll({
      where: {
        town: { [User.sequelize.Sequelize.Op.ne]: null },
        latitude: null
      }
    });

    console.log(`📊 Encontrados ${users.length} usuarios para geocodificar`);

    if (users.length === 0) {
      return res.json({
        success: true,
        message: 'No hay usuarios para geocodificar',
        total: 0
      });
    }

    // 2️⃣ Agrupar por ciudad para evitar requests duplicados
    const citiesMap = new Map();
    for (const user of users) {
      const key = `${user.town}_${user.country}`;
      if (!citiesMap.has(key)) {
        citiesMap.set(key, {
          town: user.town,
          country: user.country,
          users: []
        });
      }
      citiesMap.get(key).users.push(user);
    }

    console.log(`📍 Ciudades únicas a geocodificar: ${citiesMap.size}`);

    // 3️⃣ Geocodificar cada ciudad
    let successCount = 0;
    let failCount = 0;
    const results = [];

    for (const [key, data] of citiesMap) {
      console.log(`🌍 Geocodificando: ${data.town}, ${data.country}`);

      const coordinates = await geocodingService.geocodeTown(
        data.town,
        data.country
      );

      if (coordinates) {
        // Actualizar todos los usuarios de esta ciudad
        for (const user of data.users) {
          user.latitude = coordinates.latitude;
          user.longitude = coordinates.longitude;
          await user.save();
          successCount++;
        }

        results.push({
          city: `${data.town}, ${data.country}`,
          status: 'success',
          coordinates,
          usersUpdated: data.users.length
        });

        console.log(`✅ ${data.town}: ${coordinates.latitude}, ${coordinates.longitude} (${data.users.length} usuarios)`);
      } else {
        failCount += data.users.length;
        results.push({
          city: `${data.town}, ${data.country}`,
          status: 'failed',
          usersAffected: data.users.length
        });

        console.log(`❌ ${data.town}: No se pudo geocodificar`);
      }
    }

    // 4️⃣ Respuesta
    res.json({
      success: true,
      message: 'Geocodificación completada',
      summary: {
        totalUsers: users.length,
        citiesProcessed: citiesMap.size,
        usersGeocoded: successCount,
        usersFailed: failCount
      },
      results
    });

  } catch (error) {
    console.error('❌ Error en geocodificación masiva:', error);
    res.status(500).json({
      success: false,
      error: 'Error al geocodificar usuarios',
      message: error.message
    });
  }
}
