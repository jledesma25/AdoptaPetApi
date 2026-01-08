#!/bin/bash

# Script para probar la API de AdoptaPet

API_URL="https://adoptapetapi-production.up.railway.app"

echo "🧪 Probando API de AdoptaPet"
echo "================================"
echo ""

# 1. Probar endpoint ping
echo "1️⃣ Probando endpoint /ping..."
curl -k -X GET "$API_URL/ping"
echo ""
echo ""

# 2. Probar login con usuario de prueba
echo "2️⃣ Probando login..."
echo "Usuario: 12345678"
echo "Contraseña: 123456"
echo ""
curl -k -X POST "$API_URL/login" \
  -H "Content-Type: application/json" \
  -d '{
    "numero_documento": "12345678",
    "password": "123456"
  }' | python3 -m json.tool 2>/dev/null || echo ""
echo ""
echo ""

# 3. Probar login con credenciales incorrectas
echo "3️⃣ Probando login con credenciales incorrectas..."
curl -k -X POST "$API_URL/login" \
  -H "Content-Type: application/json" \
  -d '{
    "numero_documento": "12345678",
    "password": "wrongpassword"
  }' | python3 -m json.tool 2>/dev/null || echo ""
echo ""

echo "✅ Pruebas completadas"
