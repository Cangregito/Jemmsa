/**
 * Product View - Carga y muestra información de producto individual
 * Basado en la estructura de datos organizados por categoría
 */

// Obtener parámetros de URL
function getURLParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    categoria: params.get('categoria'),
    familia: params.get('familia'),
    producto: params.get('producto')
  };
}

// Extraer colores del texto de material
function extractColors(materialText) {
  if (!materialText) return [];
  
  const colorPatterns = [
    /color[es]*:\s*([^.]+)/i,
    /Color:\s*([^.]+)/i
  ];
  
  for (const pattern of colorPatterns) {
    const match = materialText.match(pattern);
    if (match) {
      const colorsText = match[1];
      // Extraer colores con códigos (ej: "blanco (W8)")
      const colorMatches = colorsText.matchAll(/([^\(\),]+)\s*\(([^\)]+)\)/g);
      const colors = [];
      for (const colorMatch of colorMatches) {
        colors.push({
          name: colorMatch[1].trim(),
          code: colorMatch[2].trim()
        });
      }
      return colors;
    }
  }
  
  return [];
}

// Cargar producto
async function loadProduct() {
  let { categoria, familia, producto } = getURLParams();
  const fallbacks = [];

  try {
    // Intentar cargar la categoría indicada; si falla, aplicar fallbacks
    let categoryData = null;
    if (categoria) {
      const res = await fetch(`../src/data/categories/${categoria}.json`);
      if (res.ok) categoryData = await res.json();
    }

    if (!categoryData) {
      // Fallback: usar 'operativos' si existe
      try {
        const resOp = await fetch(`../src/data/categories/operativos.json`);
        if (resOp.ok) {
          categoryData = await resOp.json();
          categoria = 'operativos';
          fallbacks.push('Categoría por defecto: operativos');
        }
      } catch {}
    }

    if (!categoryData) {
      // Fallback: primera categoría del índice
      try {
        const idxRes = await fetch(`../src/data/categories/index.json`);
        if (idxRes.ok) {
          const idx = await idxRes.json();
          const firstId = idx.categories?.[0]?.id;
          if (firstId) {
            const firstRes = await fetch(`../src/data/categories/${firstId}.json`);
            if (firstRes.ok) {
              categoryData = await firstRes.json();
              categoria = firstId;
              fallbacks.push(`Categoría por defecto: ${firstId}`);
            }
          }
        }
      } catch {}
    }

    if (!categoryData) {
      throw new Error('No se pudo cargar la categoría');
    }

    // Resolver familia
    let familyData = null;
    if (familia && categoryData.families && categoryData.families[familia]) {
      familyData = categoryData.families[familia];
    } else {
      const firstFamKey = Object.keys(categoryData.families || {})[0];
      if (firstFamKey) {
        familyData = categoryData.families[firstFamKey];
        familia = firstFamKey;
        fallbacks.push(`Familia por defecto: ${firstFamKey}`);
      }
    }

    if (!familyData) {
      throw new Error('Familia no encontrada');
    }

    // Resolver producto
    let productData = null;
    if (producto) {
      productData = (familyData.products || []).find(p => p.id === producto);
    }
    if (!productData && Array.isArray(familyData.products) && familyData.products.length > 0) {
      productData = familyData.products[0];
      producto = productData.id;
      fallbacks.push(`Producto por defecto: ${producto}`);
    }

    if (!productData) {
      throw new Error('Producto no encontrado');
    }

    // Actualizar la URL con los parámetros efectivos (sin recargar)
    const newSearch = `?categoria=${encodeURIComponent(categoria)}&familia=${encodeURIComponent(familia)}&producto=${encodeURIComponent(producto)}`;
    window.history.replaceState(null, '', window.location.pathname + newSearch);

    // Renderizar producto
    renderProduct(productData, familyData, categoryData.category);

    // Cargar productos relacionados de la misma familia
    loadRelatedProducts(familyData.products, productData.id);

    // Mostrar aviso si se aplicaron fallbacks
    if (fallbacks.length > 0) {
      showFallbackNotice(fallbacks);
    }

  } catch (error) {
    console.error('Error cargando producto:', error);
    showError('No se pudo cargar el producto');
  }
}

// Mostrar aviso de fallbacks aplicados
function showFallbackNotice(fallbacks) {
  const note = document.getElementById('fallback-note');
  if (!note) return;
  const list = fallbacks.map(f => `• ${f}`).join(' ');
  note.textContent = `Se aplicaron valores por defecto: ${list}`;
  note.classList.remove('hidden');
}

// Renderizar producto
// Utilidad: normalizar texto (ortografía/acentos comunes)
function normalizeText(t) {
  if (!t) return '';
  return t
    .replace(/semi\-?r[ií]gido/gi, 'semirrígido')
    .replace(/polipropileno\s+semirr[ií]gido/gi, 'polipropileno semirrígido')
    .replace(/elevacion/gi, 'elevación')
    .replace(/terminacion/gi, 'terminación')
    .trim();
}

function renderProduct(product, family, category) {
  // Título de página
  document.getElementById('product-title').textContent = `${product.name} | Jemmsa`;
  
  // Generar breadcrumb automáticamente
  const breadcrumb = [
    { label: 'Home', link: './index.html' },
    { label: category.name.toUpperCase(), link: `./catalogo.html?categoria=${category.id}` },
    { label: family.name.toUpperCase(), link: `./catalogo.html?categoria=${category.id}` },
    { label: product.name, link: '#' }
  ];
  renderBreadcrumb(breadcrumb);
  
  // Encabezado
  const collectionEl = document.getElementById('collection-name');
  if (collectionEl) collectionEl.textContent = family.name || '';
  const codeEl = document.getElementById('product-code');
  if (codeEl) {
    // Extraer solo el código del producto (ej: "ALUFSEN modelo OHE-405" -> "OHE-405")
    let productCode = product.name || '';
    const modeloMatch = productCode.match(/modelo\s+([A-Z0-9-]+)/i);
    if (modeloMatch) {
      productCode = modeloMatch[1];
    } else {
      // Si no tiene "modelo", intentar extraer el código al final
      const codeMatch = productCode.match(/([A-Z]{2,}[A-Z0-9-]+)$/i);
      if (codeMatch) {
        productCode = codeMatch[1];
      }
    }
    codeEl.textContent = productCode;
  }
  
  // Insignias
  renderBadges(product);
  
  // Imagen principal
  const mainImg = document.getElementById('main-image');
  if (mainImg && product.image) {
    mainImg.src = product.image;
    mainImg.alt = product.name || 'Producto';
  }
  
  // Galería de imágenes
  if (product.images && product.images.length > 0) {
    renderImageGallery(product.images);
  }

  // Descripción Principal - Mostrar todas las especificaciones detalladas
  const descriptionEl = document.getElementById('product-description');
  if (descriptionEl) {
    let html = '';
    let hasContent = false;
    
    // Descripción general si existe
    if (product.description) {
      html += `<p class="mb-4">${normalizeText(product.description)}</p>`;
      hasContent = true;
    }
    
    // Especificaciones detalladas
    if (product.specifications) {
      const specs = product.specifications;
      const specOrder = ['base', 'elevacion', 'elevación', 'mecanismo', 'brazos', 'asiento', 'respaldo', 'tapiz', 'capacidad', 'resistencia', 'referencia'];
      
      specOrder.forEach(key => {
        if (specs[key]) {
          const label = key.charAt(0).toUpperCase() + key.slice(1);
          html += `<p class="mb-2"><strong class="text-brand-base dark:text-white">${label}:</strong> ${normalizeText(specs[key])}</p>`;
          hasContent = true;
        }
      });
      
      // Agregar cualquier otra especificación que no esté en el orden
      Object.keys(specs).forEach(key => {
        if (!specOrder.includes(key) && specs[key]) {
          const label = key.replace(/_/g, ' ').charAt(0).toUpperCase() + key.replace(/_/g, ' ').slice(1);
          html += `<p class="mb-2"><strong class="text-brand-base dark:text-white">${label}:</strong> ${normalizeText(specs[key])}</p>`;
          hasContent = true;
        }
      });
    }
    
    // Si no hay contenido, mostrar mensaje de pendiente
    if (!hasContent) {
      html = '<p class="text-slate-500 italic">Pendiente por cargar información.</p>';
    }
    
    descriptionEl.innerHTML = html;
  }
}

// Renderizar breadcrumb
function renderBreadcrumb(breadcrumb) {
  const container = document.getElementById('breadcrumb');
  container.innerHTML = breadcrumb.map((item, index) => {
    const isLast = index === breadcrumb.length - 1;
    return `
      ${index > 0 ? '<span class="text-slate-400">/</span>' : ''}
      ${isLast 
        ? `<span class="text-slate-900 font-medium">${item.label}</span>`
        : `<a href="${item.link}" class="hover:text-blue-600 transition-colors">${item.label}</a>`
      }
    `;
  }).join('');
}

// Obtener la mejor imagen para mostrar (prioriza ambientadas sin fondo gris)
function getBestProductImage(product) {
  // Buscar imagen ambientada en el array de images
  if (product.images && Array.isArray(product.images)) {
    const ambientImage = product.images.find(img => 
      img.label && (
        img.label.toLowerCase().includes('ambiente') ||
        img.label.toLowerCase().includes('ambientada')
      )
    );
    if (ambientImage && ambientImage.url) return ambientImage.url;
    
    // Si no hay ambientada, buscar la primera imagen que no sea "Frente", "Lateral" o "Atras"
    const nonStudioImage = product.images.find(img => 
      img.url && !/(frente|lateral|atras|90)/i.test(img.url)
    );
    if (nonStudioImage && nonStudioImage.url) return nonStudioImage.url;
  }
  
  // Si no se encuentra mejor opción, usar la imagen principal
  return product.image || 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=400&auto=format&fit=crop';
}

// Cargar productos relacionados
function loadRelatedProducts(allProducts, currentProductId) {
  const relatedProducts = allProducts
    .filter(p => p.id !== currentProductId)
    .slice(0, 4); // Máximo 4 productos relacionados
  
  if (relatedProducts.length === 0) return;
  
  const section = document.getElementById('related-products-section');
  const grid = document.getElementById('related-products-grid');
  
  grid.innerHTML = relatedProducts.map(product => `
    <a href="producto.html?categoria=${getURLParams().categoria}&familia=${getURLParams().familia}&producto=${product.id}" 
       class="group bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:shadow-md hover:border-blue-400 transition-all">
      <div class="aspect-square bg-white overflow-hidden flex items-center justify-center">
        <img src="${getBestProductImage(product)}" 
             alt="${product.name}" 
             class="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300">
      </div>
      <div class="p-4">
        <h3 class="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">${product.name}</h3>
        <p class="text-sm text-gray-600 mt-1 line-clamp-2">${product.description || ''}</p>
      </div>
    </a>
  `).join('');
  
  section.classList.remove('hidden');
}

// Renderizar galería de imágenes
function renderImageGallery(images) {
  const container = document.getElementById('thumbnails-container');
  const mainImg = document.getElementById('main-image');
  
  if (!container || !mainImg || !images || images.length === 0) return;
  
  container.innerHTML = images.map((img, index) => `
    <button 
      class="thumbnail-btn w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${index === 0 ? 'border-brand-primary' : 'border-transparent hover:border-slate-300 dark:hover:border-slate-600'}"
      data-image-url="${img.url}"
      data-image-label="${img.label}"
      title="${img.label}"
      style="cursor: zoom-in;"
    >
      <img 
        src="${img.url}" 
        alt="${img.label}" 
        class="w-full h-full object-cover"
      />
    </button>
  `).join('');
  
  // Agregar event listeners a las miniaturas
  const thumbnails = container.querySelectorAll('.thumbnail-btn');
  thumbnails.forEach(btn => {
    btn.addEventListener('click', function(event) {
      const imageUrl = this.getAttribute('data-image-url');
      const imageLabel = this.getAttribute('data-image-label');
      
      // Si se hace clic con Shift, abrir en lightbox
      if (event.shiftKey && typeof openLightbox === 'function') {
        openLightbox(imageUrl, imageLabel);
        return;
      }
      
      // Click normal: cambiar imagen principal
      mainImg.src = imageUrl;
      mainImg.alt = imageLabel;
      
      // Actualizar estilos de miniaturas
      thumbnails.forEach(t => {
        t.classList.remove('border-brand-primary');
        t.classList.add('border-transparent');
      });
      this.classList.add('border-brand-primary');
      this.classList.remove('border-transparent');
    });
    
    // Agregar funcionalidad de doble clic para abrir lightbox
    btn.addEventListener('dblclick', function() {
      const imageUrl = this.getAttribute('data-image-url');
      const imageLabel = this.getAttribute('data-image-label');
      if (typeof openLightbox === 'function') {
        openLightbox(imageUrl, imageLabel);
      }
    });
  });
  
  // Actualizar cursor de la imagen principal cuando cambia
  if (mainImg) {
    mainImg.style.cursor = 'zoom-in';
  }
}


// Mostrar error
function showError(message) {
  const main = document.querySelector('main');
  main.innerHTML = `
    <div class="flex items-center justify-center min-h-[50vh]">
      <div class="text-center">
        <svg class="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Producto no encontrado</h2>
        <p class="text-gray-600 mb-6">${message}</p>
        <a href="catalogo.html" class="inline-flex items-center gap-2 px-6 py-3 rounded-lg transition-colors bg-blue-600 text-white hover:bg-blue-700">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
          Volver al Catálogo
        </a>
      </div>
    </div>
  `;
}

// Inicializar vista de producto
document.addEventListener('DOMContentLoaded', loadProduct);
