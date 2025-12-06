# Vercel deployment - Local preparation (PowerShell)

Sigue estos pasos en PowerShell desde la carpeta `seguridad-frontend` para preparar y desplegar en Vercel.

1) Confirmar que `package.json` tiene el script `build`

```powershell
cd 'c:\Users\Marlon Alexis CC\Downloads\Desarrollo_web\seguridad-frontend'

# Mostrar package.json (verifica que exista "build": "vite build")
Get-Content package.json
```

2) Instalar dependencias (si no lo has hecho)

```powershell
# Instalar dependencias
npm install
```

3) Hacer el build local y comprobar `dist`

```powershell
# Ejecutar build de producción
npm run build

# Verificar que se creó la carpeta dist
Get-ChildItem -Name dist
```

4) `vercel.json` ya está añadido en este repositorio. Confirma su presencia:

```powershell
Get-Content vercel.json
```

5) Opcional: instalar Vercel CLI y probar deploy desde la máquina (interactivo)

```powershell
# Instalar Vercel CLI globalmente
npm install -g vercel

# Iniciar sesión (abre navegador para autenticar)
vercel login

# Primer deploy interactivo (elige opciones cuando te pregunte)
vercel

# Para forzar deploy a producción
vercel --prod
```

6) Commit y push del archivo `vercel.json` (recomendado)

```powershell
cd 'c:\Users\Marlon Alexis CC\Downloads\Desarrollo_web'

# Agregar solo el archivo de configuración (no subir dist)
git add seguridad-frontend/vercel.json

git commit -m "Add vercel.json for SPA rewrite (Vite)"

git push origin main
```

7) Notas importantes
- No subas `dist/` al repo; Vercel construye el proyecto en su CI.
- Asegúrate de configurar en el Dashboard de Vercel la `Root Directory` como `seguridad-frontend` (si importas el repo completo) y `Output Directory` como `dist`.
- Añade variables de entorno en Settings > Environment Variables (ej: `VITE_API_URL`) y redeploy para que se tomen en el build.

Si quieres, procedo a hacer el `git commit` local del archivo `vercel.json` por ti (no puedo ejecutar git push desde aquí, pero te daré el comando exacto). Si quieres que también cree un pequeño README en la raíz del repo con pasos resumidos, dime y lo añado.