## Preparando tu aplicación para Vercel

### Pasos para el despliegue

1. **Verifica tu entorno local**

   - Asegúrate de que la aplicación funcione correctamente en local
   - Confirma que todas las dependencias están correctamente instaladas

2. **Configura las variables de entorno en Vercel**

   - Ve a la configuración de tu proyecto en Vercel
   - Añade la variable de entorno `VITE_MONGO_URI` con tu cadena de conexión de MongoDB
   - _Nota: Las credenciales de MongoDB están incluidas en esta variable, asegúrate de no exponerlas_

3. **Configura MongoDB Atlas**

   - Asegúrate de que tu base de datos MongoDB Atlas permite conexiones desde Vercel
   - Ve a Network Access en MongoDB Atlas
   - Añade `0.0.0.0/0` para permitir conexiones desde cualquier lugar (sólo desarrollo)
   - Para producción, limita el acceso a las IPs específicas de Vercel

4. **Ejecuta el despliegue**
   - Haz commit y push de tus cambios a GitHub
   - Vercel detectará los cambios y desplegará automáticamente

### Verificación del despliegue

- Una vez desplegado, verifica que:
  - La página se carga correctamente
  - Los datos de la filmografía se muestran correctamente
  - Las imágenes se cargan
  - Los enlaces funcionan

### Solución de problemas comunes

- **Error "Cannot find module"**: Verifica que todas las dependencias están en package.json
- **Error de conexión a MongoDB**: Verifica la variable de entorno y los permisos de red en MongoDB Atlas
- **Páginas en blanco**: Revisa los logs de Vercel para ver errores de SSR/SSG

### Seguridad

- No incluyas credenciales directamente en el código
- Usa variables de entorno para todos los datos sensibles
- Considera habilitar la autenticación para modificar datos
