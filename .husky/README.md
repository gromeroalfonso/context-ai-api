# Git Hooks - Context.ai API

Este directorio contiene los Git Hooks configurados con Husky para garantizar la calidad del código.

## 🪝 Hooks Configurados

### Pre-commit

**Archivo**: `.husky/pre-commit`

**Se ejecuta antes de cada commit** para verificar la calidad del código que se va a commitear.

**Acciones**:
- Ejecuta `lint-staged` que:
  - Aplica ESLint con auto-fix en archivos `.ts` modificados
  - Aplica Prettier para formatear el código
  - Solo procesa archivos que están en el staging area

**Resultado**:
- ✅ Si no hay errores → El commit se completa
- ❌ Si hay errores de lint → El commit se bloquea

**Bypass** (no recomendado):
```bash
git commit --no-verify -m "mensaje"
```

---

### Pre-push

**Archivo**: `.husky/pre-push`

**Se ejecuta antes de cada push** para asegurar que el código funciona correctamente.

**Acciones**:
1. Ejecuta todos los tests unitarios (`pnpm test`)
2. Ejecuta el linter en todo el código (`pnpm lint`)

**Resultado**:
- ✅ Si todos los tests pasan y no hay errores de lint → El push se completa
- ❌ Si algún test falla o hay errores → El push se bloquea

**Bypass** (no recomendado):
```bash
git push --no-verify
```

---

## 📋 Lint-staged Configuration

**Ubicación**: `package.json` → `lint-staged`

```json
{
  "lint-staged": {
    "src/**/*.ts": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

Solo procesa archivos TypeScript en `src/` que estén en el staging area.

---

## 🔧 Mantenimiento

### Agregar nuevos hooks

```bash
# Crear nuevo hook
echo "comando" > .husky/nombre-hook
chmod +x .husky/nombre-hook
```

### Deshabilitar hooks temporalmente

```bash
# Deshabilitar todos los hooks
git config core.hooksPath /dev/null

# Restaurar hooks
git config --unset core.hooksPath
```

### Reinstalar hooks

```bash
pnpm prepare
```

---

## 📚 Recursos

- [Husky Documentation](https://typicode.github.io/husky/)
- [Lint-staged Documentation](https://github.com/lint-staged/lint-staged)

---

## 🎯 Filosofía

Los hooks están diseñados para:

1. **Prevenir errores** antes de que lleguen al repositorio
2. **Mantener calidad constante** en el código
3. **Automatizar tareas repetitivas** (formato, linting)
4. **Apoyar TDD** verificando que los tests pasen antes del push

**Nota**: Evita usar `--no-verify` a menos que sea absolutamente necesario. Los hooks están ahí para ayudarte a mantener la calidad del código.

