/**
 * Data Loader - Carga archivos JSON organizados por categoría
 * Uso: import { loadCategoryData, loadAllCategories } from './data-loader.js'
 */

const DATA_BASE_PATH = '/data/categories';

/**
 * Carga datos de una categoría específica
 * @param {string} categoryId - ID de la categoría (e.g., 'mesas', 'confortables')
 * @returns {Promise<Object>} Datos de la categoría
 */
export async function loadCategoryData(categoryId) {
  try {
    const response = await fetch(`${DATA_BASE_PATH}/${categoryId}.json`);
    if (!response.ok) {
      throw new Error(`Error cargando categoría: ${categoryId}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error en loadCategoryData(${categoryId}):`, error);
    throw error;
  }
}

/**
 * Carga el índice de categorías
 * @returns {Promise<Object>} Índice con lista de categorías
 */
export async function loadCategoriesIndex() {
  try {
    const response = await fetch(`${DATA_BASE_PATH}/index.json`);
    if (!response.ok) {
      throw new Error('Error cargando índice de categorías');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en loadCategoriesIndex():', error);
    throw error;
  }
}

/**
 * Carga todas las categorías
 * @returns {Promise<Object>} Objeto con datos de todas las categorías
 */
export async function loadAllCategories() {
  try {
    const index = await loadCategoriesIndex();
    const allData = {};
    
    // Cargar datos de cada categoría
    for (const categoryFile of index.categoryFiles) {
      const categoryId = categoryFile.replace('.json', '');
      allData[categoryId] = await loadCategoryData(categoryId);
    }
    
    return allData;
  } catch (error) {
    console.error('Error en loadAllCategories():', error);
    throw error;
  }
}

/**
 * Busca un producto por ID en todas las categorías
 * @param {string} productId - ID del producto
 * @returns {Promise<Object|null>} Producto encontrado o null
 */
export async function findProductById(productId) {
  try {
    const allData = await loadAllCategories();
    
    for (const [categoryId, categoryData] of Object.entries(allData)) {
      const families = categoryData.families || {};
      
      for (const [familyId, familyData] of Object.entries(families)) {
        const products = familyData.products || [];
        const product = products.find(p => p.id === productId);
        
        if (product) {
          return {
            categoryId,
            familyId,
            product
          };
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error(`Error en findProductById(${productId}):`, error);
    throw error;
  }
}

/**
 * Obtiene todos los productos de una familia
 * @param {string} categoryId - ID de la categoría
 * @param {string} familyId - ID de la familia
 * @returns {Promise<Array>} Array de productos
 */
export async function getProductsByFamily(categoryId, familyId) {
  try {
    const categoryData = await loadCategoryData(categoryId);
    const family = categoryData.families[familyId];
    
    if (!family) {
      throw new Error(`Familia no encontrada: ${categoryId}/${familyId}`);
    }
    
    return family.products || [];
  } catch (error) {
    console.error(`Error en getProductsByFamily(${categoryId}, ${familyId}):`, error);
    throw error;
  }
}

/**
 * Obtiene un producto específico
 * @param {string} categoryId - ID de la categoría
 * @param {string} familyId - ID de la familia
 * @param {string} productId - ID del producto
 * @returns {Promise<Object>} Producto encontrado
 */
export async function getProduct(categoryId, familyId, productId) {
  try {
    const products = await getProductsByFamily(categoryId, familyId);
    const product = products.find(p => p.id === productId);
    
    if (!product) {
      throw new Error(`Producto no encontrado: ${categoryId}/${familyId}/${productId}`);
    }
    
    return product;
  } catch (error) {
    console.error(`Error en getProduct():`, error);
    throw error;
  }
}

// Exportar constantemente como predeterminado para compatibilidad
export default {
  loadCategoryData,
  loadCategoriesIndex,
  loadAllCategories,
  findProductById,
  getProductsByFamily,
  getProduct,
  DATA_BASE_PATH
};
