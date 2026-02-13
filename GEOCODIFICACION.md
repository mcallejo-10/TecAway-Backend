# 🗺️ Geocodificación en TecAway Backend

Sistema de geocodificación para convertir ciudades en coordenadas geográficas y calcular distancias entre usuarios.

## 📋 Tabla de Contenidos

1. [Qué se ha implementado](#qué-se-ha-implementado)
2. [Cómo funciona](#cómo-funciona)
3. [Instalación y Configuración](#instalación-y-configuración)
4. [Uso](#uso)
5. [API Endpoints](#api-endpoints)
6. [Testing](#testing)

---

## ✅ Qué se ha implementado

### 1. **Servicio de Geocodificación** (`src/services/geocodingService.js`)
- Convierte nombres de ciudades en coordenadas (latitud/longitud)
- Usa la API de Nominatim (OpenStreetMap) - **GRATIS**
- Incluye cache en memoria para evitar requests repetidos
- Respeta límite de 1 request/segundo
- Incluye función de cálculo de distancias (fórmula de Haversine)
- **NO requiere dependencias adicionales** (usa `fetch` nativo de Node.js 20+)

### 2. **Modelo de Usuario Actualizado** (`src/models/userModel.js`)
Se agregaron 4 campos nuevos:
```javascript
latitude: DECIMAL(10, 8)      // Ej: 40.41675000 (solo si hay city)
longitude: DECIMAL(11, 8)     // Ej: -3.70379000 (solo si hay city)
country: VARCHAR(2)           // ⭐ OBLIGATORIO - Código ISO (ES, AR, MX, etc.)
postal_code: VARCHAR(10)      // Código postal (opcional)
```

**Lógica:**
- `country`: **OBLIGATORIO** - Siempre se debe especificar
- `city`: **OPCIONAL** - Solo si el técnico trabaja en una ciudad específica
- `latitude/longitude`: **AUTOMÁTICAS** - Solo se generan si hay `city`

### 3. **Migración de Base de Datos** (`migrations/20250110000000-add-geolocation-to-users.cjs`)
Script SQL para agregar las columnas a la tabla Users existente.

### 4. **Middleware de Geocodificación Automática** (`src/middlewares/geocodeMiddleware.js`)
- Se ejecuta automáticamente en registro y actualización de usuarios
- Solo geocodifica si hay `city` y NO hay coordenadas
- No bloquea la petición si falla
- Detecta el país automáticamente

### 5. **Rutas de API** (`src/routes/geocodingRoutes.js`)
Endpoints para geocodificar manualmente y calcular distancias:
- `POST /api/geocode` - Geocodificar una ciudad
- `POST /api/geocode/batch` - Geocodificar múltiples ciudades
- `POST /api/geocode/distance` - Calcular distancia entre dos puntos
- `GET /api/geocode/cache/stats` - Ver estadísticas de cache
- `DELETE /api/geocode/cache` - Limpiar cache

### 6. **Script de Migración** (`scripts/geocode-existing-users.js`)
Para geocodificar usuarios existentes que ya tienen ciudad pero no coordenadas.

---

## 🔧 Cómo funciona

### Flujo Automático (al crear/actualizar usuario):

```
1. Usuario envía datos → { country: "ES", city: "Madrid", ... }
2. Middleware verifica → ¿Hay city? → SÍ
3. Servicio geocodifica → Nominatim API
4. Coordenadas agregadas → { country: "ES", city: "Madrid", latitude: 40.4168, longitude: -3.7038 }
5. Controlador guarda → Base de datos
```

**Si NO hay ciudad:**
```
1. Usuario envía datos → { country: "ES", ... }  (sin city)
2. Middl 1: Técnico local
{ country: "ES", city: "Madrid" }

// Output (automático)
{
  country: "ES",
  city: "Madrid",
  latitude: 40.4168,
  longitude: -3.7038
}

// Input 2: Técnico nacional
{ country: "ES" }  // Sin city

// Output (automático)
{
  country: "ES",
  city: null,
  latitude: null,
  longitude: null
// Input
{ city: "Madrid" }

// Output (automático)
{
  city: "Madrid",
  latitude: 40.4168,
  longitude: -3.7038
}
```

---

## 📦 Instalación y Configuración

### 1. **Aplicar Migración de Base de Datos**

```bash
# Ejecutar migración de Sequelize
npx sequelize-cli db:migrate
```

Esto agregará las columnas `latitude`, `longitude`, `country` y `postal_code` a la tabla `Users`.

### 2. **Configurar User-Agent (IMPORTANTE)**

Edita [src/services/geocodingService.js](src/services/geocodingService.js#L21):

```javascript
// ⚠️ CAMBIA ESTO POR TU EMAIL REAL
this.userAgent = 'TecAway-Backend/1.0 (tu-email@tecaway.com)';
```

Nominatim requiere un User-Agent válido con email de contacto.

### 3️⃣ **Normalizar y Geocodificar Usuarios Existentes** (opcional)

Si ya tienes usuarios con ubicaciones inconsistentes:

```bash
# 1. Primero normaliza las ubicaciones
node scripts/normalize-user-locations.js

# 2. Luego geocodifica
node scripts/geocode-existing-users.js
```

El script de normalización limpia:
- "Capital federal", "CABA" → "Buenos Aires", AR
- "barcelona" → "Barcelona", ES
- "Madrid" → "Madrid", ES
- etc.

El script:
- ✅ Encuentra usuarios con ciudad pero sin coordenadas
- ✅ Geocodifica cada ciudad única (1 vez por ciudad)
- ✅ Actualiza todos los usuarios de esa ciudad
- ✅ Respeta límite de 1 request/segundo
- ✅ Muestra progreso en tiempo real

---

## 🚀 Uso

### Geocodificación Automática

**Al registrar un usuario:**
```javascript
// POST /auth/register

// Opción 1: Técnico local
{
  "email": "user@example.com",
  "password": "123456",
  "name": "Juan",
  "country": "ES",        // ⭐ OBLIGATORIO
  "city": "Barcelona"     // OPCIONAL
}
// Backend automáticamente agrega:
// latitude: 41.3851, longitude: 2.1734

// Opción 2: Técnico nacional
{
  "email": "tech@example.com",
  "password": "123456",
  "name": "María",
  "country": "AR",        // ⭐ OBLIGATORIO
  "can_move": true
}
// Sin city → sin coordenadas (trabaja en todo el país)
```

**Al actualizar un usuario:**
```javascript
// PATCH /user
{
  "city": "Valencia"
  // Backend automáticamente geocodifica
}
```

### Geocodificación Manual (desde Frontend)

```typescript
// Si el frontend necesita geocodificar antes de enviar
const geocode = async (city: string, country: string = 'ES') => {
  const response = await fetch('http://localhost:3000/api/geocode', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ city, country })
  });
  
  const data = await response.json();
  // { latitude: 40.4168, longitude: -3.7038 }
  return data;
};
```

### Calcular Distancia entre Usuarios

```typescript
// Desde el frontend
const calculateDistance = async (user1: User, user2: User) => {
  const response = await fetch('http://localhost:3000/api/geocode/distance', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: { latitude: user1.latitude, longitude: user1.longitude },
      to: { latitude: user2.latitude, longitude: user2.longitude }
    })
  });
  
  const data = await response.json();
  // { distance: 504.2, unit: "km" }
  return data.distance;
};
```

### Filtrar Usuarios por Distancia (Frontend)

```typescript
// Ejemplo: mostrar técnicos a menos de 50km
const nearbyTechnicians = users.filter(user => {
  if (!user.latitude || !user.longitude || !currentUser.latitude || !currentUser.longitude) {
    return false; // Excluir usuarios sin coordenadas
  }
  
  const distance = calculateDistance(currentUser, user);
  return distance <= 50; // 50km
});

// Ordenar por distancia
nearbyTechnicians.sort((a, b) => {
  const distA = calculateDistance(currentUser, a);
  const distB = calculateDistance(currentUser, b);
  return distA - distB;
});
```

---

## 🌐 API Endpoints

### 1. Geocodificar una ciudad

```http
POST /api/geocode
Content-Type: application/json

{
  "city": "Madrid",
  "country": "ES"  // Opcional
}
```

**Respuesta:**
```json
{
  "city": "Madrid",
  "country": "ES",
  "latitude": 40.4168,
  "longitude": -3.7038
}
```

### 2. Geocodificar múltiples ciudades

```http
POST /api/geocode/batch
Content-Type: application/json

{
  "locations": [
    { "city": "Madrid", "country": "ES" },
    { "city": "Barcelona", "country": "ES" }
  ]
}
```

**Respuesta:**
```json
{
  "total": 2,
  "successful": 2,
  "failed": 0,
  "results": [
    {
      "city": "Madrid",
      "country": "ES",
      "coordinates": { "latitude": 40.4168, "longitude": -3.7038 }
    },
    {
      "city": "Barcelona",
      "country": "ES",
      "coordinates": { "latitude": 41.3851, "longitude": 2.1734 }
    }
  ]
}
```

### 3. Calcular distancia

```http
POST /api/geocode/distance
Content-Type: application/json

{
  "from": { "latitude": 40.4168, "longitude": -3.7038 },
  "to": { "latitude": 41.3851, "longitude": 2.1734 }
}
```

**Respuesta:**
```json
{
  "from": { "latitude": 40.4168, "longitude": -3.7038 },
  "to": { "latitude": 41.3851, "longitude": 2.1734 },
  "distance": 504.2,
  "unit": "km"
}
```

### 4. Estadísticas de cache

```http
GET /api/geocode/cache/stats
```

**Respuesta:**
```json
{
  "message": "Estadísticas de cache de geocodificación",
  "size": 15,
  "entries": ["madrid_es", "barcelona_es", "valencia_es", ...],
  "note": "La cache se reinicia cuando se reinicia el servidor"
}
```

### 5. Limpiar cache

```http
DELETE /api/geocode/cache
```

**Respuesta:**
```json
{
  "message": "Cache de geocodificación limpiada",
  "entriesRemoved": 15
}
```

---

## 🧪 Testing

### Test Manual con curl

```bash
# Geocodificar Madrid
curl -X POST http://localhost:3000/api/geocode \
  -H "Content-Type: application/json" \
  -d '{"city": "Madrid", "country": "ES"}'

# Calcular distancia Madrid-Barcelona
curl -X POST http://localhost:3000/api/geocode/distance \
  -H "Content-Type: application/json" \
  -d '{
    "from": {"latitude": 40.4168, "longitude": -3.7038},
    "to": {"latitude": 41.3851, "longitude": 2.1734}
  }'

# Ver cache
curl http://localhost:3000/api/geocode/cache/stats
```

### Test de Registro con Geocodificación

```bash
# Registrar usuario con ciudad
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "123456",
    "name": "Test User",
    "city": "Barcelona",
    "roles": ["user"]
  }'

# Verificar que tiene coordenadas
curl http://localhost:3000/user/get-user/:id
# Debe incluir: "latitude": 41.3851, "longitude": 2.1734
```

---

## ⚠️ Límites y Consideraciones

### Límites de Nominatim
- **1 request por segundo** máximo
- Para uso intensivo, considera cachear permanentemente
- Lee los [términos de uso](https://operations.osmfoundation.org/policies/nominatim/)

### Cache
- Actualmente es en memoria (se pierde al reiniciar el servidor)
- Para producción, considera usar Redis
- Las ciudades geocodificadas se cachean automáticamente

### Precisión
- La geocodificación es aproximada (centro de la ciudad)
- Para direcciones exactas, considera usar Google Maps Geocoding API
- Nominatim puede no encontrar ciudades muy pequeñas

---

## 🔮 Próximos Pasos (Frontend)

1. **Filtro por distancia:**
   - Agregar slider "Mostrar técnicos a menos de X km"
   - Calcular distancias con `geocodingService.calculateDistance()`

2. **Ordenar por cercanía:**
   - Ordenar lista de técnicos por distancia al usuario actual
   - Mostrar distancia en cada tarjeta

3. **Mostrar en mapa:**
   - Integrar Leaflet o Google Maps
   - Marcar técnicos en el mapa según coordenadas

4. **Autocompletar ciudad:**
   - Usar Nominatim autocomplete
   - Validar que la ciudad existe antes de enviar

---

## 📞 Soporte

Si tienes problemas:
1. Verifica que las columnas existan: `SHOW COLUMNS FROM Users;`
2. Revisa logs del servidor: `console.log` muestra geocodificaciones
3. Verifica User-Agent en `geocodingService.js`
4. Prueba endpoints manualmente con curl/Postman

---

**¡Todo listo para calcular distancias! 🎉**
