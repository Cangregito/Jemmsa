#!/usr/bin/env python3
"""
Corrige las rutas de imágenes en los archivos JSON de distribución
Cambia ../public/img/ a ./public/img/
"""

import json
from pathlib import Path

DIST_DATA_DIR = Path(__file__).resolve().parents[1] / "dist" / "data" / "categories"

def fix_image_path(path):
    """Convierte rutas relativas de imágenes al formato correcto"""
    if isinstance(path, str):
        # Cambiar ../public/img/ a /public/img/
        # Esto funciona como ruta absoluta desde la raíz del servidor
        return path.replace("../public/img/", "/public/img/")
    return path

def fix_product_images(product):
    """Corrige las imágenes de un producto"""
    if "image" in product:
        product["image"] = fix_image_path(product["image"])
    if "images" in product and isinstance(product["images"], list):
        for img in product["images"]:
            if "url" in img:
                img["url"] = fix_image_path(img["url"])
    return product

def fix_category_data(data):
    """Corrige todas las imágenes en los datos de la categoría"""
    # Corregir imagen de la categoría
    if "category" in data and "image" in data["category"]:
        data["category"]["image"] = fix_image_path(data["category"]["image"])
    
    # Corregir imágenes de familias y productos
    if "families" in data:
        for family_id, family in data["families"].items():
            if isinstance(family, dict):
                # Corregir imagen de familia
                if "image" in family:
                    family["image"] = fix_image_path(family["image"])
                
                # Corregir productos
                if "products" in family and isinstance(family["products"], list):
                    family["products"] = [fix_product_images(p) for p in family["products"]]
    
    return data

def main():
    json_files = list(DIST_DATA_DIR.glob("*.json"))
    
    for json_file in json_files:
        print(f"Procesando {json_file.name}...")
        
        try:
            # Leer el archivo
            data = json.loads(json_file.read_text(encoding="utf-8"))
            
            # Corregir las rutas
            data = fix_category_data(data)
            
            # Escribir el archivo actualizado
            json_file.write_text(
                json.dumps(data, ensure_ascii=False, indent=2) + "\n",
                encoding="utf-8"
            )
            print(f"  ✓ {json_file.name} actualizado")
        except Exception as e:
            print(f"  ✗ Error en {json_file.name}: {e}")
    
    print("\n✓ Todas las rutas de imágenes han sido corregidas")

if __name__ == "__main__":
    main()
