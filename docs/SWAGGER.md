# Swagger Documentation - Context.ai API

Esta guía explica cómo usar y documentar la API con Swagger en el proyecto Context.ai.

## 📖 Acceso a la Documentación

**URL Local**: http://localhost:3001/api/docs

La documentación Swagger se genera automáticamente y está disponible cuando el servidor está corriendo.

## 🎨 Características Configuradas

- ✅ **Tags organizados** por módulo (auth, knowledge, interaction, authorization)
- ✅ **Autenticación JWT** con Bearer Token
- ✅ **Persistencia de autorización** (no necesitas volver a autenticarte al recargar)
- ✅ **Tema personalizado** con sintaxis resaltada
- ✅ **Filtros y búsqueda** de endpoints
- ✅ **Expansión controlada** de documentación
- ✅ **Tiempos de respuesta** mostrados en cada request

## 🏷️ Decoradores Principales

### 1. @ApiTags()

**Uso**: Agrupar endpoints por funcionalidad

```typescript
import { ApiTags } from '@nestjs/swagger';

@ApiTags('knowledge') // Agrupa bajo el tag "knowledge"
@Controller('knowledge/sources')
export class KnowledgeSourceController {
  // ...
}
```

**Tags disponibles**:
- `auth` - Autenticación y usuarios
- `knowledge` - Gestión de conocimiento
- `interaction` - Chat y RAG
- `authorization` - Roles y permisos
- `health` - Health checks

---

### 2. @ApiOperation()

**Uso**: Documentar la operación del endpoint

```typescript
import { ApiOperation } from '@nestjs/swagger';

@Get(':id')
@ApiOperation({
  summary: 'Obtener fuente de conocimiento',
  description: 'Recupera los detalles de una fuente de conocimiento por su ID',
})
getSource(@Param('id') id: string) {
  // ...
}
```

---

### 3. @ApiResponse()

**Uso**: Documentar las posibles respuestas

```typescript
import { ApiResponse } from '@nestjs/swagger';

@Post()
@ApiResponse({
  status: 201,
  description: 'Fuente creada exitosamente',
  type: KnowledgeSourceDto,
})
@ApiResponse({
  status: 400,
  description: 'Datos de entrada inválidos',
})
@ApiResponse({
  status: 401,
  description: 'No autorizado - Token inválido o ausente',
})
createSource(@Body() dto: CreateSourceDto) {
  // ...
}
```

---

### 4. @ApiProperty()

**Uso**: Documentar propiedades de DTOs

```typescript
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSourceDto {
  @ApiProperty({
    description: 'Nombre de la fuente de conocimiento',
    example: 'Manual de Usuario',
    minLength: 3,
    maxLength: 100,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name!: string;

  @ApiPropertyOptional({
    description: 'Descripción opcional de la fuente',
    example: 'Documentación oficial del producto',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Tipo de fuente',
    enum: SourceType,
    example: SourceType.PDF,
  })
  @IsEnum(SourceType)
  type!: SourceType;
}
```

---

### 5. @ApiBearerAuth()

**Uso**: Indicar que el endpoint requiere autenticación

```typescript
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth('JWT-auth')
@Get('profile')
@ApiOperation({ summary: 'Obtener perfil del usuario' })
getProfile(@Req() req: Request) {
  // Este endpoint requiere JWT token
}
```

---

### 6. @ApiParam()

**Uso**: Documentar parámetros de ruta

```typescript
import { ApiParam } from '@nestjs/swagger';

@Get(':id')
@ApiParam({
  name: 'id',
  description: 'ID único de la fuente',
  type: String,
  example: '123e4567-e89b-12d3-a456-426614174000',
})
getSource(@Param('id') id: string) {
  // ...
}
```

---

### 7. @ApiQuery()

**Uso**: Documentar parámetros de query string

```typescript
import { ApiQuery } from '@nestjs/swagger';

@Get()
@ApiQuery({
  name: 'page',
  required: false,
  type: Number,
  description: 'Número de página',
  example: 1,
})
@ApiQuery({
  name: 'limit',
  required: false,
  type: Number,
  description: 'Elementos por página',
  example: 10,
})
getSources(
  @Query('page') page: number = 1,
  @Query('limit') limit: number = 10,
) {
  // ...
}
```

---

### 8. @ApiBody()

**Uso**: Documentar el cuerpo de la petición (rara vez necesario si usas DTOs con @ApiProperty)

```typescript
import { ApiBody } from '@nestjs/swagger';

@Post()
@ApiBody({
  type: CreateSourceDto,
  description: 'Datos para crear una nueva fuente',
})
createSource(@Body() dto: CreateSourceDto) {
  // ...
}
```

---

## 📝 Ejemplo Completo

```typescript
import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('knowledge')
@Controller('knowledge/sources')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class KnowledgeSourceController {
  constructor(
    private readonly knowledgeService: KnowledgeService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Listar fuentes de conocimiento',
    description: 'Obtiene una lista paginada de todas las fuentes de conocimiento del usuario',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número de página',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Elementos por página',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de fuentes obtenida exitosamente',
    type: [KnowledgeSourceDto],
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
  })
  async getSources(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.knowledgeService.getSources(page, limit);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener fuente por ID',
    description: 'Recupera los detalles completos de una fuente específica',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único de la fuente',
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Fuente encontrada',
    type: KnowledgeSourceDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Fuente no encontrada',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
  })
  async getSource(@Param('id') id: string) {
    return this.knowledgeService.getSource(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Crear fuente de conocimiento',
    description: 'Crea una nueva fuente de conocimiento para el usuario actual',
  })
  @ApiResponse({
    status: 201,
    description: 'Fuente creada exitosamente',
    type: KnowledgeSourceDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
  })
  async createSource(@Body() dto: CreateSourceDto) {
    return this.knowledgeService.createSource(dto);
  }
}
```

---

## 🎯 Mejores Prácticas

### 1. **Usa DTOs con @ApiProperty**

Siempre documenta las propiedades de tus DTOs:

```typescript
export class CreateSourceDto {
  @ApiProperty({
    description: 'Nombre de la fuente',
    example: 'Manual de Usuario',
  })
  @IsString()
  name!: string;
}
```

### 2. **Documenta todas las respuestas posibles**

```typescript
@ApiResponse({ status: 200, description: 'Éxito' })
@ApiResponse({ status: 400, description: 'Bad Request' })
@ApiResponse({ status: 401, description: 'No autorizado' })
@ApiResponse({ status: 404, description: 'No encontrado' })
@ApiResponse({ status: 500, description: 'Error del servidor' })
```

### 3. **Agrupa por tags lógicos**

```typescript
@ApiTags('knowledge') // No uses @ApiTags('sources')
```

### 4. **Usa ejemplos realistas**

```typescript
@ApiProperty({
  example: 'Manual-Usuario-2024.pdf', // ✅ Realista
  // NO: example: 'test' // ❌ No descriptivo
})
```

### 5. **Documenta enums claramente**

```typescript
@ApiProperty({
  enum: SourceType,
  enumName: 'SourceType',
  description: 'Tipo de fuente de conocimiento',
  example: SourceType.PDF,
})
```

---

## 🔐 Probar Autenticación en Swagger

1. Obtén un token JWT de Auth0
2. Haz clic en el botón **"Authorize"** en la parte superior de Swagger UI
3. Ingresa el token en el campo: `Bearer tu-token-jwt-aqui`
4. Haz clic en **"Authorize"**
5. Ahora puedes probar endpoints protegidos

---

## 🚀 Comandos Útiles

```bash
# Iniciar servidor con documentación
pnpm start:dev

# Acceder a Swagger
open http://localhost:3001/api/docs

# Build (genera también metadata de Swagger)
pnpm build
```

---

## 📚 Recursos

- [NestJS Swagger Documentation](https://docs.nestjs.com/openapi/introduction)
- [OpenAPI 3.0 Specification](https://swagger.io/specification/)
- [Swagger UI Documentation](https://swagger.io/tools/swagger-ui/)

---

## 💡 Tips

- La documentación se actualiza automáticamente en modo desarrollo
- Usa `@ApiHideProperty()` para ocultar propiedades sensibles
- Usa `@ApiExcludeEndpoint()` para ocultar endpoints completos
- Puedes exportar la especificación OpenAPI para usar en otras herramientas

