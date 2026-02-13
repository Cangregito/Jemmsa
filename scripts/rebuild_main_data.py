#!/usr/bin/env python3
"""
Reconstruir data.json desde los archivos de categorías
"""
import json
import os
from pathlib import Path

# Rutas
dist_categories_dir = Path("dist/data/categories")
src_categories_dir = Path("src/data/categories")
output_file = Path("data.json")

def rebuild_main_data():
    """Reconstruir data.json combinando todas las categorías"""
    
    categories = []
    products = {}
    
    # Usar los archivos de dist/data/categories (son los correctos)
    category_files = sorted(dist_categories_dir.glob("*.json"))
    
    if not category_files:
        print(f"❌ No se encontraron archivos en {dist_categories_dir}")
        return False
    
    print(f"📂 Leyendo {len(category_files)} archivos de categorías...")
    
    for cat_file in category_files:
        if cat_file.name == "index.json":
            continue
            
        try:
            with open(cat_file, 'r', encoding='utf-8') as f:
                cat_data = json.load(f)
            
            # Estructura esperada: { "category": { "id": "...", "name": "..." }, "families": {...} }
            if "category" in cat_data and "id" in cat_data["category"]:
                cat_id = cat_data["category"]["id"]
                cat_name = cat_data["category"].get("name", cat_id)
                
                # Agregar a categorías
                categories.append({
                    "id": cat_id,
                    "name": cat_name
                })
                
                # Agregar productos (familias)
                if "families" in cat_data and isinstance(cat_data["families"], dict):
                    products[cat_id] = cat_data["families"]
                    print(f"  ✓ {cat_file.name}: categoría '{cat_id}' con {len(cat_data['families'])} familias")
                else:
                    products[cat_id] = {}
                    print(f"  ⚠ {cat_file.name}: sin familias")
            else:
                print(f"  ❌ {cat_file.name}: estructura incorrecta (falta 'category' o 'id')")
                
        except json.JSONDecodeError as e:
            print(f"  ❌ {cat_file.name}: error JSON - {e}")
        except Exception as e:
            print(f"  ❌ {cat_file.name}: error - {e}")
    
    if not products:
        print("❌ No se cargaron productos")
        return False
    
    # Crear archivo data.json
    data = {
        "categories": categories,
        "products": products
    }
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"\n✅ data.json reconstruido:")
    print(f"   📁 Categorías: {len(categories)}")
    print(f"   📦 Productos: {len(products)}")
    
    # También copiar a dist/
    dist_data_file = Path("dist/data.json")
    with open(dist_data_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"   ✓ Copiado a {dist_data_file}")
    
    return True

if __name__ == "__main__":
    os.chdir(Path(__file__).parent.parent)
    rebuild_main_data()
