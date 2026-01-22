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
    renderProduct(productData, familyData, categoryData);

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
function renderProduct(product, family, category) {
  // Título de página
  document.getElementById('product-title').textContent = `${product.name} | Jemmsa`;
  
  // Breadcrumb
  renderBreadcrumb(product.breadcrumb || []);
  
  // Encabezado
  const collectionEl = document.getElementById('collection-name');
  if (collectionEl) collectionEl.textContent = family.name || '';
  const codeEl = document.getElementById('product-code');
  if (codeEl) codeEl.textContent = product.name || '';
  
  // Insignias
  renderBadges(product);
  
  // Imagen principal
  const mainImg = document.getElementById('main-image');
  if (mainImg && product.image) {
    mainImg.src = product.image;
    mainImg.alt = product.name || 'Producto';
  }
  
  // Información del producto
  const nameEl = document.getElementById('product-name');
  if (nameEl) nameEl.textContent = product.comercial_name || product.name || '';
  const descEl = document.getElementById('product-description');
  if (descEl) descEl.textContent = product.description || '';
  
  // Colores
  const colors = extractColors(product.material);
  if (colors.length > 0) {
    renderColors(colors);
  }
  
  // Especificaciones
  renderSpecifications(product.specifications);
  
  // Descripción completa (material)
  if (product.material) {
    const matEl = document.getElementById('material-description');
    if (matEl) matEl.textContent = product.material;
  }
  
  // Modelados 3D
  if (product.recursos?.modelados_3d && product.recursos.modelados_3d.length > 0) {
    renderModels3D(product.recursos.modelados_3d);
  }
  
  // Certificaciones
  if (product.specifications?.referencia) {
    renderCertifications(product.specifications.referencia);
  }
  
  // Recursos de descarga
  renderDownloads(product.recursos);
  
  // Nota general
  if (product.specifications?.nota_general) {
    const noteElement = document.getElementById('general-note');
    noteElement.textContent = product.specifications.nota_general;
    noteElement.classList.remove('hidden');
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

// Renderizar insignias circulares
function renderBadges(product) {
  const container = document.getElementById('badges-container');
  const badges = [];
  
  // Badge de garantía (siempre visible, ejemplo: 5 años)
  badges.push(`
    <div class="badge-circular" style="background-color: white; border-color: #2563EB; color: #2563EB;">
      <div style="font-size: 0.65rem; line-height: 1;">GARANTÍA</div>
      <div style="font-size: 1.5rem; font-weight: 700; line-height: 1;">5</div>
      <div style="font-size: 0.65rem; line-height: 1;">AÑOS</div>
    </div>
  `);
  
  // Protección UV (si está en el material)
  if (product.material && /UV|ultravioleta/i.test(product.material)) {
    badges.push(`
      <div class="badge-circular" style="background-color: #F59E0B; border-color: #F59E0B; color: white;">
        <svg style="width: 32px; height: 32px; margin-bottom: 4px;" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"/>
        </svg>
        <div style="font-size: 0.65rem;">PROTECCIÓN<br>UV</div>
      </div>
    `);
  }
  
  // Badge de envío rápido (48hrs)
  badges.push(`
    <div class="badge-circular" style="background-color: white; border-color: #2563EB; color: #2563EB;">
      <svg style="width: 32px; height: 32px; margin-bottom: 4px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
      </svg>
      <div style="font-size: 1.25rem; font-weight: 700; line-height: 1;">48hrs</div>
    </div>
  `);
  
  container.innerHTML = badges.join('');
}

// Renderizar colores
function renderColors(colors) {
  const section = document.getElementById('colors-section');
  const container = document.getElementById('colors-container');
  
  container.innerHTML = colors.map(color => `
    <div class="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 shadow-sm">
      <div class="w-8 h-8 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 border border-slate-300"></div>
      <div>
        <p class="text-sm font-medium text-slate-900">${color.name}</p>
        <p class="text-xs text-slate-500">${color.code}</p>
      </div>
    </div>
  `).join('');
  
  section.classList.remove('hidden');
}

// Renderizar especificaciones
function renderSpecifications(specs) {
  if (!specs) return;
  
  if (specs.resistencia) {
    document.getElementById('resistance-spec').classList.remove('hidden');
    document.getElementById('resistance-value').textContent = specs.resistencia;
  }
  
  if (specs.referencia) {
    document.getElementById('reference-spec').classList.remove('hidden');
    document.getElementById('reference-value').textContent = specs.referencia;
  }
}

// Renderizar modelados 3D
function renderModels3D(models) {
  const accordion = document.getElementById('models-3d-accordion');
  const list = document.getElementById('models-3d-list');
  
  list.innerHTML = models.map(file => {
    const extension = file.split('.').pop().toUpperCase();
    return `
      <li class="flex items-center gap-3 p-2 hover:bg-slate-50 rounded">
        <svg class="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1H8a3 3 0 00-3 3v1.5a1.5 1.5 0 01-3 0V6z" clip-rule="evenodd"/>
          <path d="M6 12a2 2 0 012-2h8a2 2 0 012 2v2a2 2 0 01-2 2H2h2a2 2 0 002-2v-2z"/>
        </svg>
        <span class="text-sm text-slate-700 flex-1">${file}</span>
        <span class="text-xs font-medium text-orange-600 px-2 py-1 bg-orange-50 rounded">${extension}</span>
      </li>
    `;
  }).join('');
  
  accordion.classList.remove('hidden');
}

// Renderizar certificaciones
function renderCertifications(certification) {
  const accordion = document.getElementById('certifications-accordion');
  const content = document.getElementById('certifications-content');
  
  content.textContent = `Este producto cumple con los estándares de ${certification}.`;
  accordion.classList.remove('hidden');
}

// Renderizar descargas
function renderDownloads(recursos) {
  if (!recursos) return;
  
  const downloads = [
    { id: 'download-instructivo', key: 'instructivo', files: recursos.instructivo },
    { id: 'download-fotos', key: 'fotos', files: recursos.fotos },
    { id: 'download-ficha', key: 'ficha_tecnica', files: recursos.ficha_tecnica }
  ];
  
  downloads.forEach(({ id, key, files }) => {
    if (files && files.length > 0) {
      const element = document.getElementById(id);
      element.classList.remove('hidden');
      // TODO: Configurar enlace real cuando estén disponibles los archivos
      element.href = '#'; // Placeholder
      element.onclick = (e) => {
        e.preventDefault();
        alert(`Descarga de ${key}: ${files.join(', ')}`);
      };
    }
  });
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
      <div class="aspect-square bg-gray-50">
        <img src="${product.image || 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=400&auto=format&fit=crop'}" 
             alt="${product.name}" 
             class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
      </div>
      <div class="p-4">
        <h3 class="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">${product.name}</h3>
        <p class="text-sm text-gray-600 mt-1 line-clamp-2">${product.description || ''}</p>
      </div>
    </a>
  `).join('');
  
  section.classList.remove('hidden');
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
