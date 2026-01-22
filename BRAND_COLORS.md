# 🎨 Manual de Identidad Visual - Jemmsa

## Contexto
Este documento define la paleta de colores corporativa de Jemmsa, empresa de soluciones industriales. Los colores están derivados directamente del logotipo y deben aplicarse consistentemente en toda la interfaz web, UI y materiales corporativos.

---

## 🧱 Paleta de Colores

### Colores Principales (del logotipo)

#### 🔵 Azul Principal - Tecnología / Industrial
- **Hex:** `#1FA3D6`
- **RGB:** `31, 163, 214`
- **Uso:**
  - Botones primarios
  - Enlaces y llamados a la acción
  - Íconos principales
  - Elementos destacados
  - Títulos principales
  - Hover states
- **Ejemplo Tailwind:** `bg-primary` / `text-primary`

#### 🔴 Rojo Acento - Maquinaria / Acción
- **Hex:** `#C62828`
- **RGB:** `198, 40, 40`
- **Uso:**
  - Llamados a la acción secundarios (CTAs)
  - Estados importantes o alertas
  - Acentos visuales puntuales
  - Hover en enlaces (opcional)
- **Ejemplo Tailwind:** `bg-accent` / `text-accent`
- **⚠️ Regla:** Usar con moderación, solo como acento

#### 🟡 Amarillo Seguridad - Señalización Industrial
- **Hex:** `#F4E300`
- **RGB:** `244, 227, 0`
- **Uso:**
  - Badges de advertencia o información importante
  - Subrayados o separadores
  - Detalles pequeños
  - Indicadores visuales
- **Ejemplo Tailwind:** `bg-warning` / `text-warning`
- **⚠️ Prohibido:** NUNCA usar como fondo principal

#### ⚫ Negro Base - Estructura / Seriedad
- **Hex:** `#0B0B0B`
- **RGB:** `11, 11, 11`
- **Uso:**
  - Headers y footers
  - Fondos oscuros
  - Texto principal de alta jerarquía
  - Elementos de estructura
- **Ejemplo Tailwind:** `bg-brand-black` / `text-primary`

---

### Colores Secundarios (soporte UI)

#### ⚪ Gris Claro
- **Hex:** `#F5F5F5`
- **RGB:** `245, 245, 245`
- **Uso:**
  - Fondo general del sitio
  - Cards y contenedores
  - Secciones alternadas
- **Ejemplo Tailwind:** `bg-neutral-50` / `bg-base`

#### 🌫️ Gris Medio
- **Hex:** `#8A8A8A`
- **RGB:** `138, 138, 138`
- **Uso:**
  - Textos secundarios
  - Labels y metadata
  - Iconos no activos
- **Ejemplo Tailwind:** `text-secondary` / `text-neutral-400`

#### 🌑 Gris Oscuro
- **Hex:** `#3A3A3A`
- **RGB:** `58, 58, 58`
- **Uso:**
  - Bordes y divisores
  - Footers alternativos
  - Texto sobre fondos claros con alto contraste
- **Ejemplo Tailwind:** `border-dark` / `text-neutral-700`

---

## 📐 Reglas de Uso

### ✅ Hacer
1. **Dominio del azul:** El azul `#1FA3D6` es el color dominante. Debe ser el más visible en la interfaz.
2. **Fondos neutros:** Priorizar blancos y grises para fondos principales.
3. **Jerarquía visual:** Usar el rojo solo para elementos que requieran atención inmediata.
4. **Consistencia:** Aplicar la paleta uniformemente en todas las vistas.
5. **Accesibilidad:** Mantener ratios de contraste WCAG AA (mínimo 4.5:1 para texto).

### ❌ No Hacer
1. **Amarillo como fondo:** NUNCA usar `#F4E300` en grandes superficies.
2. **Combinar rojo y amarillo:** Evitar estas combinaciones en áreas grandes (puede verse poco profesional).
3. **Inventar colores:** NO agregar colores fuera de esta paleta sin aprobación.
4. **Abuso del rojo:** No usar rojo para todos los botones o elementos interactivos.
5. **Degradados no autorizados:** Evitar degradados complejos que diluyan la identidad.

---

## 🖥️ Aplicación en Componentes

### Botones
```html
<!-- Botón Primario (azul) -->
<button class="bg-primary text-white hover:opacity-90 px-6 py-3 rounded-lg">
  Acción Principal
</button>

<!-- Botón Secundario (outline) -->
<button class="border border-primary text-primary hover:bg-primary hover:text-white px-6 py-3 rounded-lg">
  Acción Secundaria
</button>

<!-- Botón de Acción Urgente (rojo) -->
<button class="bg-accent text-white hover:opacity-90 px-6 py-3 rounded-lg">
  ¡Acción Ahora!
</button>
```

### Enlaces
```html
<!-- Enlace normal -->
<a href="#" class="text-primary hover:text-accent transition-colors">
  Ver más
</a>

<!-- Enlace en texto -->
<p class="text-secondary">
  Para más información, <a href="#" class="text-primary underline hover:text-accent">contacta con nosotros</a>.
</p>
```

### Cards/Contenedores
```html
<div class="bg-white rounded-lg shadow-sm border border-light p-6">
  <h3 class="text-primary font-semibold mb-2">Título del Card</h3>
  <p class="text-secondary">Descripción del contenido...</p>
</div>
```

### Badges
```html
<!-- Badge Informativo (azul) -->
<span class="badge" style="background-color: rgba(31, 163, 214, 0.15); color: #1FA3D6;">
  Certificación BIFMA
</span>

<!-- Badge de Advertencia (amarillo) -->
<span class="badge" style="background-color: rgba(244, 227, 0, 0.15); color: #B8A000;">
  Protección UV
</span>
```

### Navegación
```html
<nav>
  <a href="/" class="text-primary hover:text-accent font-medium">Inicio</a>
  <a href="/catalogo" class="text-primary hover:text-accent font-medium">Catálogo</a>
</nav>
```

---

## 🎯 Configuración Tailwind

El archivo `tailwind.config.js` ya está configurado con esta paleta:

```javascript
// Colores principales
'brand': {
  'blue': '#1FA3D6',
  'red': '#C62828',
  'yellow': '#F4E300',
  'black': '#0B0B0B',
}

// Aliases semánticos
'primary': '#1FA3D6',   // Azul principal
'accent': '#C62828',    // Rojo acento
'warning': '#F4E300',   // Amarillo advertencia

// Grises neutros
'neutral': {
  50: '#F5F5F5',
  400: '#8A8A8A',
  700: '#3A3A3A',
  900: '#0B0B0B',
}
```

---

## 💡 Transmisión de Valores

La paleta debe transmitir:
- **🔧 Industria:** Solidez, confiabilidad
- **💻 Tecnología:** Innovación, modernidad
- **⚠️ Seguridad:** Seriedad, profesionalismo
- **🏢 Corporativo:** Credibilidad, experiencia

---

## 📊 Ratios de Contraste (WCAG AA)

| Combinación | Ratio | Estado |
|-------------|-------|--------|
| Azul `#1FA3D6` sobre blanco | 3.2:1 | ⚠️ Solo para grandes elementos |
| Negro `#0B0B0B` sobre blanco | 18.9:1 | ✅ Perfecto |
| Gris medio `#8A8A8A` sobre blanco | 3.5:1 | ⚠️ Solo para texto grande |
| Blanco sobre azul `#1FA3D6` | 3.2:1 | ✅ OK para botones |
| Blanco sobre rojo `#C62828` | 7.4:1 | ✅ Excelente |

**Nota:** Para textos pequeños (<18px), asegurar ratio mínimo de 4.5:1.

---

## 🚀 Próximos Pasos

1. **Aplicar en catálogo:** Actualizar página de catálogo con paleta corporativa
2. **Footer:** Diseñar footer con fondo `#0B0B0B` y acentos azules
3. **Home:** Aplicar paleta en página de inicio
4. **Iconografía:** Definir sistema de íconos con colores de marca
5. **Tipografía:** Documentar jerarquía tipográfica y pesos

---

## ✅ Estado de Implementación

- ✅ `tailwind.config.js` creado con paleta completa
- ✅ `producto.html` actualizado con colores corporativos
- ✅ `navbar.html` con azul principal y hover states
- ✅ `header.html` con fondos y bordes de marca
- ✅ `product-view.js` con badges y colores dinámicos
- ⏳ Pendiente: catálogo.html, index.html, footer.html

---

**Última actualización:** Enero 2026  
**Versión:** 1.0  
**Mantenedor:** Equipo de Desarrollo Jemmsa
