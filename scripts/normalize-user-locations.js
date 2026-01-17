/**
 * 🧹 Script de Normalización de Usuarios Existentes
 * 
 * Limpia y normaliza los datos de ubicación de los usuarios existentes:
 * - "Capital federal" → town: "Buenos Aires", country: "AR"
 * - "CABA" → town: "Buenos Aires", country: "AR"
 * - "Argentina" → country: "AR" (deja town null para que lo complete)
 * - "barcelona" → town: "Barcelona", country: "ES"
 * - "Madrid" → town: "Madrid", country: "ES"
 * 
 * Uso:
 *   node scripts/normalize-user-locations.js
 */

import { sequelize } from '../src/db.js';
import User from '../src/models/userModel.js';
import dotenv from 'dotenv';

dotenv.config({ path: './environment.env' });

/**
 * Reglas de normalización de ubicaciones
 */
const normalizationRules = [
  // Argentina - Buenos Aires
  {
    match: (town) => ['capital federal', 'caba', 'c.a.b.a', 'ciudad autónoma de buenos aires'].includes(town?.toLowerCase()),
    normalized: { town: 'Buenos Aires', country: 'AR' }
  },
  // Argentina genérico
  {
    match: (town) => town?.toLowerCase() === 'argentina',
    normalized: { town: null, country: 'AR' }
  },
  // España - Madrid
  {
    match: (town) => town?.toLowerCase() === 'madrid',
    normalized: { town: 'Madrid', country: 'ES' }
  },
  // España - Barcelona
  {
    match: (town) => town?.toLowerCase() === 'barcelona',
    normalized: { town: 'Barcelona', country: 'ES' }
  },
  // España - Valencia
  {
    match: (town) => town?.toLowerCase() === 'valencia',
    normalized: { town: 'Valencia', country: 'ES' }
  },
  // España - Sevilla
  {
    match: (town) => town?.toLowerCase() === 'sevilla',
    normalized: { town: 'Sevilla', country: 'ES' }
  },
  // México - Ciudad de México
  {
    match: (town) => ['cdmx', 'ciudad de méxico', 'mexico city', 'méxico df'].includes(town?.toLowerCase()),
    normalized: { town: 'Ciudad de México', country: 'MX' }
  }
];

/**
 * Normaliza la ubicación de un usuario
 */
function normalizeLocation(town) {
  for (const rule of normalizationRules) {
    if (rule.match(town)) {
      return rule.normalized;
    }
  }
  
  // Si no hay regla específica, capitalizar primera letra
  if (town) {
    const normalized = town
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
    
    // Intentar detectar país por palabras clave
    const townLower = town.toLowerCase();
    let country = null;
    
    if (townLower.includes('buenos aires') || townLower.includes('cordoba') || townLower.includes('rosario')) {
      country = 'AR';
    } else if (townLower.includes('barcelona') || townLower.includes('madrid') || townLower.includes('valencia')) {
      country = 'ES';
    } else if (townLower.includes('guadalajara') || townLower.includes('monterrey')) {
      country = 'MX';
    }
    
    return { town: normalized, country };
  }
  
  return { town: null, country: null };
}

/**
 * Función principal de normalización
 */
async function normalizeUsers() {
  console.log('🧹 Iniciando normalización de ubicaciones de usuarios...\n');

  try {
    // 1️⃣ Conectar a la base de datos
    await sequelize.authenticate();
    console.log('✅ Conectado a la base de datos\n');

    // 2️⃣ Obtener todos los usuarios
    const users = await User.findAll({
      attributes: ['id_user', 'name', 'email', 'town', 'country']
    });

    console.log(`📊 Total de usuarios: ${users.length}\n`);
    console.log('─'.repeat(80));

    let updatedCount = 0;
    let skippedCount = 0;

    // 3️⃣ Normalizar cada usuario
    for (const user of users) {
      const originalTown = user.town;
      const originalCountry = user.country;

      // Si ya tiene country y town bien formateado, saltar
      if (originalCountry && originalTown && originalTown === originalTown.trim()) {
        console.log(`⏭️  [${user.id_user}] ${user.name} - Ya normalizado (${originalTown}, ${originalCountry})`);
        skippedCount++;
        continue;
      }

      // Normalizar
      const normalized = normalizeLocation(originalTown);
      
      let changed = false;
      const changes = [];

      // Actualizar town si cambió
      if (normalized.town !== originalTown) {
        user.town = normalized.town;
        changed = true;
        changes.push(`town: "${originalTown}" → "${normalized.town}"`);
      }

      // Actualizar country si no existía o cambió
      if (normalized.country && normalized.country !== originalCountry) {
        user.country = normalized.country;
        changed = true;
        changes.push(`country: "${originalCountry || 'null'}" → "${normalized.country}"`);
      }

      if (changed) {
        await user.save();
        console.log(`✅ [${user.id_user}] ${user.name} - ${changes.join(', ')}`);
        updatedCount++;
      } else {
        console.log(`⏭️  [${user.id_user}] ${user.name} - Sin cambios necesarios`);
        skippedCount++;
      }
    }

    // 4️⃣ Resumen
    console.log('\n' + '═'.repeat(80));
    console.log('🎉 NORMALIZACIÓN COMPLETADA');
    console.log('═'.repeat(80));
    console.log(`📊 Total procesados: ${users.length}`);
    console.log(`✅ Actualizados: ${updatedCount}`);
    console.log(`⏭️  Sin cambios: ${skippedCount}`);

    // 5️⃣ Mostrar usuarios que necesitan atención manual
    const usersWithoutCountry = await User.findAll({
      where: {
        [sequelize.Sequelize.Op.or]: [
          { country: null },
          { town: null }
        ]
      },
      attributes: ['id_user', 'name', 'email', 'town', 'country']
    });

    if (usersWithoutCountry.length > 0) {
      console.log('\n⚠️  USUARIOS QUE NECESITAN ATENCIÓN MANUAL:');
      console.log('─'.repeat(80));
      for (const user of usersWithoutCountry) {
        console.log(`   [${user.id_user}] ${user.name} (${user.email})`);
        console.log(`   Town: ${user.town || 'NULL'} | Country: ${user.country || 'NULL'}`);
        console.log('');
      }
      console.log('   💡 Estos usuarios necesitan completar su ubicación manualmente.');
    }

    console.log('\n✅ ¡Listo! Ahora puedes ejecutar el script de geocodificación.');
    console.log('   → node scripts/geocode-existing-users.js\n');

  } catch (error) {
    console.error('\n❌ ERROR EN LA NORMALIZACIÓN:', error);
    console.error('\nDetalles:', error.message);
    process.exit(1);
  } finally {
    await sequelize.close();
    console.log('👋 Conexión cerrada\n');
  }
}

// Ejecutar
console.log('\n' + '═'.repeat(80));
console.log('🧹 SCRIPT DE NORMALIZACIÓN DE UBICACIONES');
console.log('═'.repeat(80) + '\n');

normalizeUsers()
  .then(() => {
    console.log('✅ Script finalizado exitosamente');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script finalizado con errores:', error);
    process.exit(1);
  });
