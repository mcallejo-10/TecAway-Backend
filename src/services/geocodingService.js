/**
 * 🗺️ Servicio de Geocodificación usando Nominatim (OpenStreetMap)
 * 
 * Convierte nombres de ciudades en coordenadas geográficas (latitud/longitud)
 * para poder calcular distancias entre usuarios.
 * 
 * ⚠️ IMPORTANTE: 
 * - Respeta límite de 1 request/segundo de Nominatim
 * - Incluye cache en memoria para evitar requests repetidos
 * - Usa fetch nativo de Node.js 20+ (no requiere dependencias)
 */

class GeocodingService {
  constructor() {
    this.baseUrl = 'https://nominatim.openstreetmap.org';

    this.userAgent = 'TecAway-Backend/1.0 (info.tecaway@gmail.com)';
    
    // Cache simple en memoria: Map de "ciudad_país" -> {latitude, longitude}
    this.cache = new Map();
    
    // Control de rate limiting (última petición)
    this.lastRequestTime = 0;
  }

  /**
   * 🌍 Geocodifica una ciudad a coordenadas
   * 
   * @param {string} town - Nombre de la ciudad (ej: "Madrid", "Barcelona")
   * @param {string} country - Código del país (ej: "ES", "AR", "MX")
   * @returns {Promise<{latitude: number, longitude: number} | null>}
   * 
   * @example
   * const coords = await geocodingService.geocodeTown('Madrid', 'ES');
   * // { latitude: 40.4168, longitude: -3.7038 }
   */
  async geocodeTown(town, country = '') {
    // 1️⃣ Verificar si está en cache
    const cacheKey = `${town}_${country}`.toLowerCase();
    if (this.cache.has(cacheKey)) {
      console.log(`📍 Cache hit para: ${cacheKey}`);
      return this.cache.get(cacheKey);
    }

    try {
      //  Respetar límite de 1 request/segundo
      await this.rateLimit();

      const query = country ? `${town}, ${country}` : town;
      const url = `${this.baseUrl}/search?` +
        `q=${encodeURIComponent(query)}` +
        `&format=json` +
        `&limit=1` +
        `&addressdetails=1`;

      console.log(`🌍 Geocodificando: ${query}`);

       const response = await fetch(url, {
        headers: {
          'User-Agent': this.userAgent
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.length > 0) {
        const result = {
          latitude: parseFloat(data[0].lat),
          longitude: parseFloat(data[0].lon)
        };

        // 6️⃣ Guardar en cache
        this.cache.set(cacheKey, result);
        
        console.log(`✅ Geocodificado: ${query} -> ${result.latitude}, ${result.longitude}`);
        return result;
      }

      console.warn(`⚠️ No se encontraron resultados para: ${query}`);
      return null;

    } catch (error) {
      console.error('❌ Error en geocodificación:', error.message);
      return null;
    }
  }

  /**
   * ⏱️ Rate limiting: espera 1 segundo entre requests
   * 
   * Nominatim requiere máximo 1 request por segundo.
   * Esta función asegura que se respete ese límite.
   */
  async rateLimit() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;

    if (timeSinceLastRequest < 1000) {
      const waitTime = 1000 - timeSinceLastRequest;
      console.log(`⏱️ Rate limiting: esperando ${waitTime}ms`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }

    this.lastRequestTime = Date.now();
  }

  /**
   * 📦 Geocodifica múltiples ciudades respetando rate limit
   * 
   * @param {Array<{town: string, country?: string}>} locations
   * @returns {Promise<Array<{town: string, country: string, coordinates: object | null}>>}
   * 
   * @example
   * const results = await geocodingService.geocodeBatch([
   *   { town: 'Madrid', country: 'ES' },
   *   { town: 'Barcelona', country: 'ES' }
   * ]);
   */
  async geocodeBatch(locations) {
    const results = [];

    for (const location of locations) {
      const coordinates = await this.geocodeTown(location.town, location.country);
      results.push({
        town: location.town,
        country: location.country || '',
        coordinates
      });
    }

    return results;
  }

  /**
   * 📏 Calcula la distancia entre dos puntos (fórmula de Haversine)
   * 
   * @param {number} lat1 - Latitud del punto 1
   * @param {number} lon1 - Longitud del punto 1
   * @param {number} lat2 - Latitud del punto 2
   * @param {number} lon2 - Longitud del punto 2
   * @returns {number} Distancia en kilómetros
   * 
   * @example
   * const distancia = geocodingService.calculateDistance(40.4168, -3.7038, 41.3851, 2.1734);
   * // Aprox 504 km (Madrid a Barcelona)
   */
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radio de la Tierra en km
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return Math.round(distance * 10) / 10; // Redondear a 1 decimal
  }

  /**
   * Convierte grados a radianes
   */
  toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  /**
   * 🗑️ Limpia la cache (útil para testing o reinicio)
   */
  clearCache() {
    this.cache.clear();
    console.log('🗑️ Cache limpiada');
  }

  /**
   * 📊 Obtiene estadísticas de la cache
   */
  getCacheStats() {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys())
    };
  }
}

// Exportar una instancia única (singleton)
export default new GeocodingService();
