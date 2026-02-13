#!/bin/bash

# 🧪 Script de prueba de geocodificación
# Ejecuta: chmod +x test-geocoding.sh && ./test-geocoding.sh

BASE_URL="http://localhost:3000"

echo "🧪 === PRUEBAS DE GEOCODIFICACIÓN ==="
echo ""

# ====================================
# 1. Probar autocomplete
# ====================================
echo "1️⃣ Probando autocomplete con 'Barc'..."
echo ""
curl -s "${BASE_URL}/api/geocode/autocomplete?query=Barc&limit=3" | jq '.'
echo ""
echo "---"
echo ""

# ====================================
# 2. Registro exitoso (CON coordenadas del autocomplete)
# ====================================
echo "2️⃣ Registro exitoso con coordenadas de autocomplete..."
echo ""
curl -s -X POST "${BASE_URL}/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test-barcelona@example.com",
    "password": "test12345",
    "name": "Test Usuario Barcelona",
    "title": "Técnico de iluminación con experiencia en eventos",
    "description": "Técnico especializado en iluminación para eventos corporativos y conciertos con más de 5 años de experiencia",
    "city": "Barcelona",
    "country": "ES",
    "latitude": 41.3851,
    "longitude": 2.1734,
    "can_move": true,
    "roles": ["user"]
  }' | jq '.'
echo ""
echo "---"
echo ""

# ====================================
# 3. Registro fallido (SIN coordenadas - debe fallar)
# ====================================
echo "3️⃣ Registro sin coordenadas (debe FALLAR)..."
echo ""
curl -s -X POST "${BASE_URL}/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test-fail@example.com",
    "password": "test12345",
    "name": "Test Fallo",
    "title": "Este registro debe fallar porque no tiene coordenadas",
    "description": "Técnico especializado en iluminación para eventos corporativos y conciertos con más de 5 años de experiencia",
    "city": "Madrid",
    "country": "ES",
    "can_move": true,
    "roles": ["user"]
  }' | jq '.'
echo ""
echo "---"
echo ""

# ====================================
# 4. Probar geocodificación manual
# ====================================
echo "4️⃣ Geocodificación manual de Madrid..."
echo ""
curl -s -X POST "${BASE_URL}/api/geocode" \
  -H "Content-Type: application/json" \
  -d '{
    "location": "Madrid, ES"
  }' | jq '.'
echo ""
echo "---"
echo ""

# ====================================
# 5. Calcular distancia entre dos puntos
# ====================================
echo "5️⃣ Calcular distancia Barcelona-Madrid..."
echo ""
curl -s -X POST "${BASE_URL}/api/geocode/distance" \
  -H "Content-Type: application/json" \
  -d '{
    "from": {"latitude": 41.3851, "longitude": 2.1734},
    "to": {"latitude": 40.4168, "longitude": -3.7038}
  }' | jq '.'
echo ""
echo "---"
echo ""

echo "✅ Pruebas completadas!"
echo ""
echo "💡 Revisa los logs del servidor para ver el flujo del middleware"
