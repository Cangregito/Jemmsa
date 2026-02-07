"""
Script para limpiar campos innecesarios de los archivos JSON de productos
Elimina campos que ya no se usan en la vista simplificada
"""
import json
import os
from pathlib import Path

# Directorio de categorías
CATEGORIES_DIR = Path(__file__).parent.parent / "src" / "data" / "categories"

# Campos que se deben mantener por producto
REQUIRED_FIELDS = {
    "id",           # Necesario para navegación
    "name",         # Nombre del producto
    "description",  # Descripción general
    "specifications",  # Especificaciones técnicas
    "image",        # Imagen principal
    "images"        # Galería de imágenes
}

# Campos a eliminar (ya no se usan en la vista)
FIELDS_TO_REMOVE = {
    "material",              # Ya no se muestra por separado
    "badges",                # Se eliminó la sección de badges
    "coleccion_terminados",  # Se eliminó la sección de colores
    "recursos",              # Se eliminaron los botones de descarga
    "certifications",        # Se eliminó el acordeón de certificaciones
}

def clean_product(product):
    """Limpia un producto eliminando campos innecesarios"""
    cleaned = {}
    for key, value in product.items():
        if key not in FIELDS_TO_REMOVE:
            cleaned[key] = value
    return cleaned

def clean_category_file(file_path):
    """Limpia un archivo de categoría"""
    print(f"\nProcesando: {file_path.name}")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    products_cleaned = 0
    
    # Limpiar productos en cada familia
    if 'families' in data:
        for family_id, family_data in data['families'].items():
            if 'products' in family_data:
                for i, product in enumerate(family_data['products']):
                    original_keys = set(product.keys())
                    cleaned_product = clean_product(product)
                    removed_keys = original_keys - set(cleaned_product.keys())
                    
                    if removed_keys:
                        family_data['products'][i] = cleaned_product
                        products_cleaned += 1
                        print(f"  - {product.get('id', 'unknown')}: eliminados {removed_keys}")
    
    # Guardar el archivo limpio
    if products_cleaned > 0:
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"✓ Limpiados {products_cleaned} productos")
    else:
        print(f"  Sin cambios necesarios")
    
    return products_cleaned

def main():
    """Función principal"""
    print("=" * 60)
    print("Limpieza de archivos JSON de productos")
    print("=" * 60)
    
    total_cleaned = 0
    files_processed = 0
    
    # Procesar todos los archivos JSON en el directorio de categorías
    for file_path in CATEGORIES_DIR.glob("*.json"):
        if file_path.name == "index.json":
            continue  # Saltar el archivo índice
        
        files_processed += 1
        cleaned = clean_category_file(file_path)
        total_cleaned += cleaned
    
    print("\n" + "=" * 60)
    print(f"Resumen:")
    print(f"  Archivos procesados: {files_processed}")
    print(f"  Productos limpiados: {total_cleaned}")
    print("=" * 60)
    
    print("\nCampos eliminados:")
    for field in FIELDS_TO_REMOVE:
        print(f"  - {field}")
    
    print("\nCampos conservados:")
    for field in sorted(REQUIRED_FIELDS):
        print(f"  ✓ {field}")

if __name__ == "__main__":
    main()
