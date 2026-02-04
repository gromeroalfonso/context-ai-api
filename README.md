# Context.ai API

Backend API para el sistema RAG de Context.ai.

## 🏗️ Arquitectura

Este proyecto sigue **Clean Architecture** con 4 capas:

- **Presentation**: Controllers y DTOs
- **Application**: Use Cases y lógica de aplicación
- **Domain**: Entidades, Value Objects y lógica de negocio
- **Infrastructure**: Implementación de repositorios, servicios externos

## 🚀 Tecnologías

- **Framework**: NestJS 11
- **Database**: PostgreSQL 16 + pgvector
- **ORM**: TypeORM
- **IA**: Google Genkit + Gemini 1.5 Pro
- **Auth**: Auth0 (OAuth2 + JWT)
- **Testing**: Jest (TDD)
- **Validation**: class-validator

## 📋 Requisitos

- Node.js 22+
- pnpm 8+
- Docker & Docker Compose
- PostgreSQL 16 con extensión pgvector

## 🛠️ Setup Local

### 1. Instalar dependencias

```bash
pnpm install
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
# Editar .env con tus credenciales
```

### 3. Iniciar base de datos

```bash
docker-compose up -d
```

**Nota**: El contenedor usa el puerto `5433` (mapeado a `5432` interno) para evitar conflictos con instalaciones locales de PostgreSQL.

### 4. Verificar el setup

```bash
./scripts/verify-setup.sh
```

Este script verifica que Docker, PostgreSQL, el servidor y Swagger estén funcionando correctamente.

### 5. Vincular paquete compartido (desarrollo local)

```bash
# En context-ai-shared
cd ../context-ai-shared
pnpm link --global

# En context-ai-api
pnpm link --global @context-ai/shared
```

### 6. Ejecutar migraciones

```bash
pnpm migration:run
```

### 7. Iniciar servidor en modo desarrollo

```bash
pnpm start:dev
```

El servidor estará disponible en `http://localhost:3001`

## 🧪 Testing

```bash
# Unit tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage
pnpm test:cov

# E2E tests
pnpm test:e2e
```

## 🪝 Git Hooks (Husky)

El proyecto utiliza Husky para garantizar la calidad del código antes de hacer commits y pushes:

### Pre-commit Hook
- ✅ **Ejecuta lint-staged** en archivos modificados
- ✅ **Corrige automáticamente** errores de formato
- ✅ **Bloquea el commit** si hay errores de ESLint

### Pre-push Hook
- ✅ **Ejecuta todos los tests** unitarios
- ✅ **Ejecuta el linter** en todo el código
- ✅ **Bloquea el push** si algún test falla

### Configuración

Los hooks se instalan automáticamente al ejecutar `pnpm install` gracias al script `prepare`.

```bash
# Saltar hooks temporalmente (no recomendado)
git commit --no-verify -m "mensaje"
git push --no-verify
```

## 📚 Documentación API

### Swagger UI

**URL**: http://localhost:3001/api/docs

La documentación interactiva de la API está disponible a través de Swagger UI, que incluye:

- ✅ **Exploración completa** de todos los endpoints
- ✅ **Pruebas en vivo** directamente desde el navegador
- ✅ **Autenticación JWT** con Auth0
- ✅ **Schemas de DTOs** con validaciones
- ✅ **Respuestas de ejemplo** para cada endpoint
- ✅ **Filtros y búsqueda** de endpoints
- ✅ **Persistencia de autorización** entre recargas

### Tags Organizados

- `auth` - Autenticación y gestión de usuarios
- `knowledge` - Gestión de fuentes de conocimiento y documentos
- `interaction` - Chat y consultas RAG
- `authorization` - Gestión de roles y permisos

📚 **[Ver guía completa de Swagger](./docs/SWAGGER.md)** - Aprende a documentar endpoints correctamente

## 🏗️ Estructura del Proyecto

```
src/
├── config/                 # Configuración (database, auth, etc.)
├── modules/
│   ├── auth/              # Autenticación (Auth0)
│   ├── authorization/     # Autorización interna (RBAC)
│   ├── knowledge/         # Context: Gestión de conocimiento
│   │   ├── domain/        # Entidades y lógica de negocio
│   │   ├── application/   # Use cases
│   │   ├── infrastructure/# Repositorios, servicios
│   │   └── presentation/  # Controllers
│   └── interaction/       # Context: Chat y RAG
├── shared/                # Código compartido
│   ├── decorators/
│   ├── guards/
│   ├── interceptors/
│   ├── filters/
│   └── genkit/           # Configuración de Genkit
└── main.ts
```

## 🔐 Autenticación y Autorización

- **Autenticación**: Auth0 con OAuth2/JWT
- **Autorización**: Sistema interno de roles y permisos
- Los tokens de Auth0 se validan en cada request
- Los permisos se verifican contra la BD interna

## 📦 Dependencias Principales

- `@nestjs/typeorm` - ORM integration
- `pg` + `pgvector` - PostgreSQL con soporte vectorial
- `@nestjs/passport` + `passport-jwt` - Autenticación JWT
- `class-validator` - Validación de DTOs
- `helmet` - Security headers
- `express-rate-limit` - Rate limiting

## 🚢 Deployment

Ver guía de deployment en la documentación del proyecto.

## 📄 Licencia

MIT
