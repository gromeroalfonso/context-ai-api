#!/bin/bash
# Script de verificación del setup de Context.ai API
# Verifica que Docker, PostgreSQL y el servidor estén funcionando correctamente

set -e

echo "🔍 Verificando setup de Context.ai API..."
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para imprimir resultados
print_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
        exit 1
    fi
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# 1. Verificar Docker
echo "1️⃣  Verificando Docker..."
if command -v docker &> /dev/null; then
    docker --version
    print_result 0 "Docker instalado"
else
    print_result 1 "Docker no encontrado"
fi
echo ""

# 2. Verificar Docker Compose
echo "2️⃣  Verificando Docker Compose..."
docker compose ps | grep contextai-db &> /dev/null
if [ $? -eq 0 ]; then
    print_result 0 "PostgreSQL container corriendo"
else
    print_warning "PostgreSQL container no está corriendo. Ejecuta: docker compose up -d"
fi
echo ""

# 3. Verificar PostgreSQL Health
echo "3️⃣  Verificando PostgreSQL health..."
HEALTH=$(docker inspect --format='{{.State.Health.Status}}' contextai-db 2>/dev/null || echo "not found")
if [ "$HEALTH" = "healthy" ]; then
    print_result 0 "PostgreSQL está healthy"
elif [ "$HEALTH" = "not found" ]; then
    print_warning "Container no encontrado"
else
    print_warning "PostgreSQL health: $HEALTH"
fi
echo ""

# 4. Verificar extensiones de PostgreSQL
echo "4️⃣  Verificando extensiones de PostgreSQL..."
docker exec contextai-db psql -U contextai_user -d contextai -c "\dx" | grep vector &> /dev/null
if [ $? -eq 0 ]; then
    print_result 0 "pgvector extension instalada"
else
    print_result 1 "pgvector extension no encontrada"
fi
echo ""

# 5. Verificar que el servidor esté corriendo
echo "5️⃣  Verificando servidor NestJS..."
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/api/v1 2>/dev/null || echo "000")
if [ "$response" = "200" ]; then
    print_result 0 "Servidor respondiendo en http://localhost:3001/api/v1"
else
    print_warning "Servidor no responde (HTTP $response). ¿Está corriendo? Ejecuta: pnpm start:dev"
fi
echo ""

# 6. Verificar Swagger
echo "6️⃣  Verificando Swagger UI..."
swagger_response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/api/docs 2>/dev/null || echo "000")
if [ "$swagger_response" = "200" ]; then
    print_result 0 "Swagger UI accesible en http://localhost:3001/api/docs"
else
    print_warning "Swagger UI no accesible"
fi
echo ""

# 7. Verificar OpenAPI spec
echo "7️⃣  Verificando OpenAPI specification..."
openapi_response=$(curl -s http://localhost:3001/api/docs-json 2>/dev/null | grep -o "Context.ai API" || echo "")
if [ ! -z "$openapi_response" ]; then
    print_result 0 "OpenAPI spec generada correctamente"
else
    print_warning "OpenAPI spec no encontrada"
fi
echo ""

# Resumen
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✨ Verificación completada${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📝 URLs útiles:"
echo "   API: http://localhost:3001/api/v1"
echo "   Swagger: http://localhost:3001/api/docs"
echo "   DB: localhost:5433 (contextai/contextai_user/dev_password)"
echo ""
echo "🔧 Comandos útiles:"
echo "   docker compose ps        - Ver estado de containers"
echo "   docker compose logs -f   - Ver logs de PostgreSQL"
echo "   pnpm start:dev          - Iniciar servidor en modo desarrollo"
echo ""

