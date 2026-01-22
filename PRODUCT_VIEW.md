# Vista de Producto - Documentación

## Descripción
Sistema de vista individual de producto siguiendo arquitectura modular y reutilizable.

## Estructura Implementada

### 1. Encabezado del Producto
- ✅ Nombre de colección/línea
- ✅ Código del modelo
- ✅ Insignias visuales dinámicas:
  - Protección UV (detectado automáticamente)
  - Certificación (BIFMA, etc.)
  - Solo se muestran si existen datos

### 2. Sección Principal (Dos Columnas)

#### Columna Izquierda - Galería
- ✅ Imagen principal grande
- ✅ Espacio para miniaturas verticales
- ✅ Preparado para múltiples imágenes

#### Columna Derecha - Información
- ✅ Título del producto
- ✅ Descripción
- ✅ Colección de colores/terminados
  - Extrae automáticamente del campo material
  - Muestra código y nombre de cada color
- ✅ Acordeones informativos:
  - Descripción completa (material)
  - Modelados 3D (solo si existen)
  - Certificaciones (solo si existen)

### 3. Zona de Descargas
- ✅ Botón Instructivo (solo si existe archivo)
- ✅ Botón Fotos (solo si existe archivo)
- ✅ Botón Ficha Técnica (solo si existe archivo)
- ✅ Diseño visual con iconos
- ✅ Estados hover mejorados

### 4. Productos Relacionados
- ✅ Grid responsivo
- ✅ Máximo 4 productos de la misma familia
- ✅ Enlaces directos a vista de producto
- ✅ Se oculta si no hay productos relacionados

## Comportamiento

### Carga Dinámica
- Usa parámetros URL: `?categoria=mesas&familia=magnolia&producto=ohm-7023-st`
- Carga datos desde archivos JSON organizados
- Renderiza solo información disponible
- No inventa contenido faltante

### Navegación
- Breadcrumb funcional
- Enlaces a productos relacionados
- Botón de vuelta al catálogo en caso de error

### Diseño
- Responsivo (mobile-first)
- Tailwind CSS
- Componentes reutilizables
- Estados hover y transiciones

## Archivos

### HTML
- `dist/producto.html` - Template de vista de producto

### JavaScript
- `public/js/product-view.js` - Lógica de carga y renderizado

## Uso

### URL de Producto
```
producto.html?categoria=mesas&familia=magnolia&producto=ohm-7023-st
```

### Enlace desde Catálogo
```html
<a href="producto.html?categoria=mesas&familia=magnolia&producto=ohm-7023-st">
  Ver Producto
</a>
```

### Datos Requeridos
El producto debe existir en:
```
src/data/categories/{categoria}.json
```

Con estructura:
```json
{
  "category": {...},
  "families": {
    "{familia}": {
      "products": [
        {
          "id": "{producto}",
          "name": "...",
          "material": "...",
          "recursos": {...}
        }
      ]
    }
  }
}
```

## Características Técnicas

### Extracción Inteligente
- **Colores**: Detecta patrones "color: blanco (W8), gris (G6)"
- **Protección UV**: Busca "UV" o "ultravioleta" en material
- **Certificaciones**: Lee campo specifications.referencia

### Validación
- Verifica existencia de parámetros URL
- Valida datos cargados
- Muestra error si producto no existe
- Maneja errores de carga gracefully

### Performance
- Carga solo categoría necesaria
- No carga todo el catálogo
- Renderizado condicional (solo lo necesario)

## Estado Actual
✅ **Implementación completa según especificación**
- Estructura HTML lista
- JavaScript funcional
- Integrado con sistema de datos organizados
- Diseño responsive
- Preparado para producción

## Próximos Pasos (Opcionales)
- [ ] Galería de imágenes múltiples
- [ ] Zoom en imagen principal
- [ ] Compartir producto en redes
- [ ] Comparador de productos
- [ ] Historial de productos vistos
