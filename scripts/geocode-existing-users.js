/**
 * 🗺️ Script de Migración: Geocodificar Usuarios Existentes
 * 
 * Este script geocodifica todos los usuarios que tienen ciudad pero no coordenadas.
 * Útil para migrar datos existentes después de agregar las nuevas columnas.
 * 
 * Uso:
 *   node scripts/geocode-existing-users.js
 * 
 * ⚠️ IMPORTANTE:
 * - Respeta el límite de 1 request/segundo de Nominatim
 * - Puede tardar varios minutos si hay muchos usuarios
 * - Se puede ejecutar varias veces de forma segura (skip usuarios ya geocodificados)
 */

import { sequelize } from '../src/db.js';
import User from '../src/models/userModel.js';
import geocodingService from '../src/services/geocodingService.js';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config({ path: './environment.env' });

/**
 * Detecta el país basado en la ciudad
 */
function detectCountry(town) {
  const townLower = (town || '').toLowerCase();

  // Ciudades españolas comunes
  const spanishCities = [
    'madrid', 'barcelona', 'valencia', 'sevilla', 'zaragoza',
    'málaga', 'murcia', 'palma', 'bilbao', 'alicante',
    'córdoba', 'valladolid', 'vigo', 'gijón', 'hospitalet',
    'coruña', 'granada', 'vitoria', 'elche', 'oviedo',
    'badalona', 'cartagena', 'terrassa', 'jerez', 'sabadell'
  ];
  if (spanishCities.some(city => townLower.includes(city))) {
    return 'ES';
  }

  // Ciudades argentinas comunes
  const argentinianCities = [
    'buenos aires', 'córdoba', 'rosario', 'mendoza',
    'tucumán', 'la plata', 'mar del plata', 'salta',
    'santa fe', 'san juan', 'resistencia', 'santiago del estero'
  ];
  if (argentinianCities.some(city => townLower.includes(city))) {
    return 'AR';
  }

  // Ciudades mexicanas comunes
  const mexicanCities = [
    'méxico', 'cdmx', 'guadalajara', 'monterrey', 'puebla',
    'tijuana', 'león', 'juárez', 'zapopan', 'mérida',
    'toluca', 'chihuahua', 'aguascalientes', 'querétaro'
  ];
  if (mexicanCities.some(city => townLower.includes(city))) {
    return 'MX';
  }

  // Por defecto, España
  return 'ES';
}

/**
 * Función principal de migración
 */
async function migrateUsers() {
  console.log('🚀 Iniciando migración de geocodificación...\n');

  try {
    // 1️⃣ Conectar a la base de datos
    await sequelize.authenticate();
    console.log('✅ Conectado a la base de datos\n');

    // 2️⃣ Buscar usuarios que necesitan geocodificación
    const usersToGeocode = await User.findAll({
      where: {
        town: { [sequelize.Sequelize.Op.ne]: null },
        [sequelize.Sequelize.Op.or]: [
          { latitude: null },
          { longitude: null }
        ]
      },
      attributes: ['id_user', 'name', 'town', 'latitude', 'longitude']
    });

    console.log(`📊 Usuarios encontrados: ${usersToGeocode.length}\n`);

    if (usersToGeocode.length === 0) {
      console.log('✅ No hay usuarios para geocodificar. ¡Todo listo!');
      return;
    }

    // 3️⃣ Agrupar por ciudad para evitar geocodificar la misma ciudad varias veces
    const citiesMap = new Map();
    for (const user of usersToGeocode) {
      const town = user.town.trim();
      if (!citiesMap.has(town)) {
        citiesMap.set(town, []);
      }
      citiesMap.get(town).push(user);
    }

    console.log(`📍 Ciudades únicas a geocodificar: ${citiesMap.size}\n`);
    console.log('⏱️  Esto tomará aproximadamente', Math.ceil(citiesMap.size * 1.2), 'segundos\n');
    console.log('─'.repeat(70));

    // 4️⃣ Geocodificar cada ciudad
    let successCount = 0;
    let failCount = 0;
    let cityIndex = 0;

    for (const [town, users] of citiesMap) {
      cityIndex++;
      
      console.log(`\n[${cityIndex}/${citiesMap.size}] 🌍 Geocodificando: "${town}"`);
      console.log(`   👥 ${users.length} usuario(s) con esta ciudad`);

      // Detectar país
      const country = detectCountry(town);
      console.log(`   🌐 País detectado: ${country}`);

      // Geocodificar
      const coordinates = await geocodingService.geocodeTown(town, country);

      if (coordinates) {
        // Actualizar todos los usuarios de esta ciudad
        for (const user of users) {
          user.latitude = coordinates.latitude;
          user.longitude = coordinates.longitude;
          await user.save();
        }

        console.log(`   ✅ Coordenadas: ${coordinates.latitude}, ${coordinates.longitude}`);
        successCount += users.length;
      } else {
        console.log(`   ❌ No se pudo geocodificar`);
        failCount += users.length;
      }

      // Mostrar progreso cada 10 ciudades
      if (cityIndex % 10 === 0) {
        console.log('\n' + '─'.repeat(70));
        console.log(`📊 Progreso: ${cityIndex}/${citiesMap.size} ciudades procesadas`);
        console.log(`   ✅ Exitosos: ${successCount} usuarios`);
        console.log(`   ❌ Fallidos: ${failCount} usuarios`);
        console.log('─'.repeat(70));
      }
    }

    // 5️⃣ Resumen final
    console.log('\n' + '═'.repeat(70));
    console.log('🎉 MIGRACIÓN COMPLETADA');
    console.log('═'.repeat(70));
    console.log(`📊 Total de usuarios procesados: ${usersToGeocode.length}`);
    console.log(`✅ Geocodificados exitosamente: ${successCount}`);
    console.log(`❌ Fallidos: ${failCount}`);
    console.log(`📍 Ciudades únicas procesadas: ${citiesMap.size}`);
    
    if (failCount > 0) {
      console.log('\n⚠️  Algunos usuarios no se pudieron geocodificar.');
      console.log('   Puedes ejecutar el script nuevamente más tarde.');
    }

    console.log('\n📊 Estadísticas de cache:');
    const cacheStats = geocodingService.getCacheStats();
    console.log(`   Entradas en cache: ${cacheStats.size}`);
    
    console.log('\n✅ ¡Listo! Los usuarios ahora tienen coordenadas.');
    console.log('═'.repeat(70) + '\n');

  } catch (error) {
    console.error('\n❌ ERROR EN LA MIGRACIÓN:', error);
    console.error('\nDetalles:', error.message);
    process.exit(1);
  } finally {
    // 6️⃣ Cerrar conexión
    await sequelize.close();
    console.log('👋 Conexión a la base de datos cerrada\n');
  }
}

// Ejecutar migración
console.log('\n' + '═'.repeat(70));
console.log('🗺️  SCRIPT DE GEOCODIFICACIÓN DE USUARIOS');
console.log('═'.repeat(70) + '\n');

migrateUsers()
  .then(() => {
    console.log('✅ Script finalizado exitosamente');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script finalizado con errores:', error);
    process.exit(1);
  });
