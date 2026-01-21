# Jemmsa

Sitio estático con estructura MVC ligera y Tailwind CSS (CDN) para la empresa de sillas Jemmsa.

# Jemmsa

Sitio 100% estático con Tailwind CSS (CDN) para el catálogo de sillas de Jemmsa. No se requiere Node.js en producción: basta subir los HTML a tu hosting (Hostinger u otro).

## Cómo usar
- Abre `dist/index.html` en el navegador o súbelo a tu hosting junto con los demás archivos de `dist/`.
- El catálogo está en `dist/catalogo.html`. La página de error es `dist/404.html`.
- Las imágenes se cargan desde URLs públicas (Unsplash). Si prefieres locales, colócalas en `public/img/` y ajusta las rutas en `catalogo.html`.

## Estructura
- `dist/`: versión lista para producción (HTML estático con Tailwind CDN).
	- `index.html`
	- `catalogo.html`
	- `404.html`
- `public/`: assets opcionales (JS, imágenes). El CSS anterior quedó en `public/css/__deprecated__/` por si lo quieres conservar.

## Despliegue en Hostinger (estático)
1) Sube el contenido de `dist/` al directorio público de tu hosting (por ejemplo, `public_html`).
2) Opcional: si usas imágenes locales, sube también `public/` y ajusta las rutas en los HTML.
3) No necesitas ejecutar Node ni instalar dependencias.

## Git
Repositorio remoto: https://github.com/Cangregito/Jemmsa.git

Comandos útiles:
```bash
git add -A
git commit -m "mensaje"
git push
```
- `public/`: assets estáticos (JS, imágenes). El CSS propio fue reemplazado por Tailwind (CDN).
