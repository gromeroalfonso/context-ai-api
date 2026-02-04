# Configuración de Snyk para Context.ai API

Guía completa para configurar Snyk y ejecutar escaneos de seguridad en el proyecto.

## 📋 Índice

- [¿Qué es Snyk?](#qué-es-snyk)
- [Configuración Inicial](#configuración-inicial)
- [Configurar Secrets en GitHub](#configurar-secrets-en-github)
- [Workflows de Snyk](#workflows-de-snyk)
- [Ejecutar Snyk Localmente](#ejecutar-snyk-localmente)
- [Interpretar Resultados](#interpretar-resultados)
- [Mejores Prácticas](#mejores-prácticas)

---

## 🔍 ¿Qué es Snyk?

Snyk es una plataforma de seguridad para desarrolladores que ayuda a:

- 🔒 **Detectar vulnerabilidades** en dependencias npm
- 🐛 **Encontrar problemas** en el código fuente
- 🐳 **Escanear imágenes** Docker
- 📦 **Monitorear proyectos** continuamente
- 🛠️ **Sugerir correcciones** automáticas

## 🚀 Configuración Inicial

### 1. Crear Cuenta en Snyk

1. Ve a [snyk.io](https://snyk.io) y regístrate
2. Conecta tu cuenta con GitHub
3. Autoriza a Snyk para acceder a tus repositorios

### 2. Obtener Token de Snyk

1. Ve a [Account Settings](https://app.snyk.io/account)
2. Copia tu **API Token**
3. También anota tu **Organization ID** (lo encontrarás en Settings → Organization)

### 3. Instalar Snyk CLI (Opcional para desarrollo local)

```bash
# Usando npm
npm install -g snyk

# O usando pnpm
pnpm add -g snyk

# Autenticarse
snyk auth
```

---

## 🔐 Configurar Secrets en GitHub

Para que los workflows de GitHub Actions funcionen, necesitas agregar secrets:

### Paso 1: Ir a Settings del Repositorio

1. Ve a tu repositorio en GitHub
2. Click en **Settings** → **Secrets and variables** → **Actions**
3. Click en **New repository secret**

### Paso 2: Agregar Secrets

#### `SNYK_TOKEN` (Requerido)

- **Name**: `SNYK_TOKEN`
- **Value**: Tu API token de Snyk
- Click en **Add secret**

#### `SNYK_ORG_ID` (Opcional, para monitoring)

- **Name**: `SNYK_ORG_ID`
- **Value**: Tu Organization ID de Snyk
- Click en **Add secret**

---

## 🤖 Workflows de Snyk

El proyecto tiene configurados 3 jobs en `.github/workflows/snyk.yml`:

### 1. **Snyk Test** (Se ejecuta siempre)

```yaml
Trigger: Push, PR, Schedule (diario a las 00:00 UTC)
Acción: Escanea dependencias en busca de vulnerabilidades
Threshold: High severity
Output: Resultados en GitHub Security tab
```

**Qué hace:**
- Instala dependencias con pnpm
- Ejecuta `snyk test` en todos los proyectos
- Sube resultados a GitHub Code Scanning
- No falla el build, solo reporta

### 2. **Snyk Monitor** (Solo en push a main)

```yaml
Trigger: Push a rama main
Acción: Monitorea el proyecto en Snyk dashboard
Output: Proyecto visible en snyk.io
```

**Qué hace:**
- Sube snapshot del proyecto a Snyk
- Permite monitoreo continuo
- Envía alertas cuando aparecen nuevas vulnerabilidades

### 3. **Snyk Docker** (Si existe Dockerfile)

```yaml
Trigger: Push a cualquier rama
Acción: Escanea imagen Docker en busca de vulnerabilidades
Output: Resultados en GitHub Security
```

**Qué hace:**
- Construye imagen Docker (si existe Dockerfile)
- Escanea la imagen con Snyk
- Reporta vulnerabilidades en base image y layers

---

## 💻 Ejecutar Snyk Localmente

### Escaneo de Dependencias

```bash
# Test básico
snyk test

# Test con todas las dependencias (incluyendo dev)
snyk test --dev

# Test solo vulnerabilidades high/critical
snyk test --severity-threshold=high

# Generar reporte JSON
snyk test --json > snyk-report.json

# Generar reporte HTML
snyk test --json | snyk-to-html -o snyk-report.html
```

### Escaneo de Código

```bash
# Analizar código fuente
snyk code test

# Solo vulnerabilidades high
snyk code test --severity-threshold=high
```

### Monitoreo

```bash
# Subir proyecto para monitoreo continuo
snyk monitor

# Con nombre específico
snyk monitor --project-name="context-ai-api"
```

### Corrección Automática

```bash
# Ver correcciones disponibles
snyk wizard

# Aplicar correcciones automáticamente
snyk fix
```

---

## 📊 Interpretar Resultados

### Niveles de Severidad

| Severidad | Color | Descripción |
|-----------|-------|-------------|
| **Critical** | 🔴 Rojo | Vulnerabilidad crítica, corregir inmediatamente |
| **High** | 🟠 Naranja | Alta prioridad, corregir pronto |
| **Medium** | 🟡 Amarillo | Prioridad media, revisar y planificar |
| **Low** | 🟢 Verde | Baja prioridad, opcional |

### Ejemplo de Output

```
Testing /Users/user/context-ai-api...

✗ High severity vulnerability found in express
  Description: Regex Denial of Service (ReDoS)
  Info: https://snyk.io/vuln/SNYK-JS-EXPRESS-...
  Introduced through: express@4.17.1
  Fixed in: express@4.17.3
  
  Remediation:
    Upgrade express from 4.17.1 to 4.17.3
```

### Ver Resultados en GitHub

1. Ve a tu repositorio
2. Click en **Security** tab
3. Click en **Code scanning alerts**
4. Filtra por "Snyk"

---

## ✅ Mejores Prácticas

### 1. **Revisar Regularmente**

```bash
# Agregar script en package.json
{
  "scripts": {
    "security:check": "snyk test",
    "security:monitor": "snyk monitor",
    "security:fix": "snyk fix"
  }
}
```

### 2. **Configurar Archivo .snyk**

El proyecto ya tiene un `.snyk` configurado. Puedes personalizarlo:

```yaml
# Ignorar vulnerabilidad específica
ignore:
  'SNYK-JS-AXIOS-1234567':
    - '*':
      reason: 'No afecta nuestra implementación'
      expires: '2026-12-31T00:00:00.000Z'
```

### 3. **Integrar en Pre-commit**

```bash
# En .husky/pre-commit
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx lint-staged
snyk test --severity-threshold=high
```

### 4. **Mantener Dependencias Actualizadas**

```bash
# Ver actualizaciones disponibles
pnpm outdated

# Actualizar dependencias
pnpm update

# Verificar después
snyk test
```

### 5. **Revisar Antes de Releases**

```bash
# Antes de crear un release
pnpm test
pnpm lint
snyk test --severity-threshold=medium
pnpm build
```

---

## 🔔 Notificaciones

### Configurar Alertas en Snyk

1. Ve a [Notification Settings](https://app.snyk.io/org/YOUR_ORG/manage/notifications)
2. Configura:
   - Email alerts para nuevas vulnerabilidades
   - Slack integration (opcional)
   - Frequency (inmediato, diario, semanal)

### Slack Integration

```bash
# En tu Slack workspace
1. Agregar Snyk app desde Slack marketplace
2. Conectar con tu organización Snyk
3. Configurar canal para recibir alertas
```

---

## 📈 Dashboard de Snyk

### Acceder al Dashboard

1. Ve a [app.snyk.io](https://app.snyk.io)
2. Selecciona tu organización
3. Busca el proyecto "context-ai-api"

### Qué Ver en el Dashboard

- 📊 **Overview**: Resumen de vulnerabilidades
- 📦 **Dependencies**: Lista de todas las dependencias
- 🐛 **Issues**: Vulnerabilidades encontradas
- 📝 **Reports**: Reportes históricos
- 🔄 **History**: Timeline de cambios

---

## 🚨 Troubleshooting

### Error: Missing SNYK_TOKEN

```
Error: Snyk token not found
```

**Solución**: Verificar que el secret `SNYK_TOKEN` esté configurado en GitHub

### Error: Organization not found

```
Error: Organization SNYK_ORG_ID not found
```

**Solución**: Verificar el ID de organización en Snyk settings

### Error: Rate limit exceeded

```
Error: Too many requests
```

**Solución**: Esperar unos minutos. Snyk tiene rate limits para la API gratuita.

### Workflow no se ejecuta

**Solución**: 
1. Verificar que el token tenga permisos correctos
2. Revisar logs en Actions tab
3. Asegurar que el workflow file esté en `.github/workflows/`

---

## 📚 Recursos Adicionales

- [Snyk Documentation](https://docs.snyk.io)
- [Snyk CLI Commands](https://docs.snyk.io/snyk-cli/cli-reference)
- [GitHub Actions Integration](https://github.com/snyk/actions)
- [Vulnerability Database](https://security.snyk.io)
- [Snyk Learn](https://learn.snyk.io) - Tutoriales de seguridad

---

## 🎯 Checklist de Seguridad

Antes de cada release, verifica:

- [ ] `snyk test` pasa sin vulnerabilidades críticas
- [ ] Todas las dependencias están actualizadas
- [ ] No hay vulnerabilidades high sin plan de mitigación
- [ ] `.snyk` está actualizado con excepciones justificadas
- [ ] Tests pasan (incluyendo tests de seguridad)
- [ ] Docker image (si aplica) no tiene vulnerabilidades críticas

---

**¿Preguntas?** Abre un issue en GitHub o consulta la [documentación oficial de Snyk](https://docs.snyk.io).

