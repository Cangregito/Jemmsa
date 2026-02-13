#!/usr/bin/env python3
"""
Corrige las rutas de imágenes en data.json
"""

import json
from pathlib import Path

DATA_JSON = Path(__file__).resolve().parents[1] / "data.json"

def fix_image_path(path):
    """Convierte rutas relativas de imágenes al formato correcto"""
    if isinstance(path, str):
        return path.replace("../public/img/", "/public/img/")
    return path

def fix_category(category):
    """Corrige una categoría"""
    if "image" in category:
        category["image"] = fix_image_path(category["image"])
    return category

def fix_product_images(product):
    """Corrige las imágenes de un producto"""
    if "image" in product:
        product["image"] = fix_image_path(product["image"])
    if "images" in product and isinstance(product["images"], list):
        for img in product["images"]:
            if "url" in img:
                img["url"] = fix_image_path(img["url"])
    return product

def main():
    print(f"Procesando {DATA_JSON.name}...")
    
    try:
        # Leer el archivo
        data = json.loads(DATA_JSON.read_text(encoding="utf-8"))
        
        # Corregir categorías
        if "categories" in data:
            data["categories"] = [fix_category(c) for c in data["categories"]]
        
        # Corregir productos de cada categoría
        if "products" in data:
            for cat_id, categoryProducts in data["products"].items():
                if isinstance(categoryProducts, dict):
                    # Familia -> Familia con productos
                    for family_id, family in categoryProducts.items():
                        if isinstance(family, dict) and "products" in family:
                            if isinstance(family["products"], list):
                                family["products"] = [fix_product_images(p) for p in family["products"]]
        
        # Escribir el archivo actualizado
        DATA_JSON.write_text(
            json.dumps(data, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8"
        )
        print(f"  ✓ {DATA_JSON.name} actualizado")
        
        # Verificar
        data = json.loads(DATA_JSON.read_text(encoding="utf-8"))
        if data["categories"]:
            print(f"\n  Primera categoría: {data['categories'][0]['name']}")
            print(f"  Ruta de imagen: {data['categories'][0]['image']}")
    
    except Exception as e:
        print(f"  ✗ Error: {e}")

if __name__ == "__main__":
    main()
