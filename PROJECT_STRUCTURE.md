# Estructura del Proyecto - Catálogo Jemmsa

## Descripción General
Proyecto de catálogo de muebles e-commerce con estructura organizada por categorías.

## Estructura de Carpetas

```
jemmsa/
├── src/                          # Código fuente
│   ├── data/
│   │   └── categories/           # Datos organizados por categoría
│   │       ├── index.json        # Índice de todas las categorías
│   │       ├── directivos.json
│   │       ├── ejecutivos.json
│   │       ├── operativos.json
│   │       ├── industrial.json
│   │       ├── accesorios.json
│   │       ├── visitantes-interior.json
│   │       ├── visitantes-exterior.json
│   │       ├── mesas.json
│   │       ├── confortables.json
│   │       ├── bancas.json
│   │       └── escolar.json
│   ├── components/               # Componentes reutilizables
│   ├── layouts/                  # Plantillas de diseño
│   └── pages/                    # Páginas estáticas
│       ├── header.html
│       ├── navbar.html
│       └── footer.html
├── public/                       # Archivos estáticos públicos
│   ├── img/                      # Imágenes
│   └── js/                       # JavaScript del cliente
├── dist/                         # Archivos compilados/distribuibles
├── data.json                     # Datos originales (referencia)
├── organize_json.py              # Script para organizar JSONs
├── README.md                     # Documentación principal
└── PROJECT_STRUCTURE.md          # Este archivo

```

## Organización de Datos

### Niveles Jerárquicos
```
Categoría (e.g., "MESAS")
    └── Familia (e.g., "MAGNOLIA")
        └── Producto/Modelo (e.g., "OHM-7023-ST")
            ├── Especificaciones
            ├── Recursos (fotos, fichas, 3D)
            └── Breadcrumb (navegación)
```

### Archivos JSON por Categoría
Cada archivo en `src/data/categories/` contiene:
- Metadata de categoría
- Todas las familias de esa categoría
- Todos los productos/modelos de cada familia
- Especificaciones completas con recursos

**Ejemplo:** `mesas.json`
- Categoría: MESAS
- Familias: MAGNOLIA, UNO, CANCÚN, SEATTLE, TONNATI, MARBEL, CHLOE, VENICE, QUICK, PEDESTAL300, OSLO, RUSS, OULU, HERON-MESAS
- Productos: ~90+ modelos (OHM-7023-ST, OHM-7095, OHM-7035, etc.)

### Índice Central
`src/data/categories/index.json` contiene:
- Lista de todas las categorías
- Referencias a archivos de categorías
- Metadata general del catálogo

## Tipos de Datos en Productos

### Especificaciones
```json
{
  "resistencia": "Peso sugerido X kgs",
  "referencia": "BIFMA",
  "leyenda": "Caja 360",
  "nota_general": "El color puede variar dependiendo de su monitor"
}
```

### Recursos
```json
{
  "instructivo": ["archivo.jpg"],
  "fotos": ["archivo.pdf"],
  "ficha_tecnica": ["archivo.jpg", "archivo.pdf"],
  "modelados_3d": ["archivo.dwg", "archivo.obj", "archivo.skp", "archivo.3ds"],
  "videos": ["archivo.mp4"]
}
```

### Breadcrumb (Navegación)
```json
{
  "breadcrumb": [
    { "label": "Home", "link": "/" },
    { "label": "CATEGORÍA", "link": "/catalogo?categoria=xxx" },
    { "label": "FAMILIA", "link": "/catalogo?categoria=xxx&familia=yyy" },
    { "label": "MODELO", "link": "#" }
  ]
}
```

## Estadísticas Actuales

| Categoría | Familias | Modelos | Estado |
|-----------|----------|---------|--------|
| Directivos | 6 | - | Referencia |
| Ejecutivos | 13 | - | Referencia |
| Operativos | 20 | - | Referencia |
| Industrial | 3 | - | Referencia |
| Accesorios | 4 | - | Referencia |
| Visitantes Interior | 18 | - | Referencia |
| Visitantes Exterior | 19 | 90+ | ✓ Completo |
| Mesas | 14 | 90+ | ✓ Completo |
| Confortables | 7 | 19 | ✓ Completo |
| Bancas | 3 | 11 | ✓ Completo |
| Escolar | 7 | 38 | ✓ Completo |
| **TOTAL** | **114** | **300+** | |

## Uso de los Archivos

### Para el Frontend
1. Cargar `index.json` para obtener lista de categorías
2. Cargar JSON específico de categoría cuando sea necesario
3. Cada producto incluye breadcrumb para navegación

### Para Desarrollo
1. Ejecutar `organize_json.py` después de cambios en `data.json`
2. Actualizar archivos específicos de categoría para cambios rápidos
3. Mantener sincronización con `data.json` original

## Commits Git
- 32 commits con progreso incremental por categoría/familia
- Cada commit documenta cambios en familias y modelos
- Working tree limpio, listo para cambios nuevos

## Próximos Pasos
- [ ] Cargar archivos JSON dinámicamente en frontend
- [ ] Implementar búsqueda/filtros por categoría
- [ ] Sincronización automática de cambios
- [ ] Generación de fichas técnicas PDF
