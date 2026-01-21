# Jemma

Estructura inicial MVC (Modelo–Vista–Controlador) para el sitio de la empresa de sillas Jemma.

## Requisitos
- Node.js 18+ y npm

## Instalar
```bash
npm install
```

## Ejecutar en desarrollo
```bash
npm run dev
```
Abre http://localhost:3000

## Ejecutar en producción
```bash
npm start
```

## Estructura
- `src/app.js`: servidor Express y configuración.
- `src/routes/index.js`: rutas de la aplicación.
- `src/controllers/homeController.js`: controlador de la página de inicio.
- `src/models/chair.js`: modelo placeholder de silla.
- `src/views/`: plantillas EJS (`home.ejs`, `404.ejs`, parciales `partials/`).
- `public/`: assets estáticos (CSS, JS, imágenes).

## Git
Repositorio remoto: https://github.com/Cangregito/Jemmsa.git

Comandos útiles:
```bash
git add -A
git commit -m "Tu mensaje de commit"
git push
```
