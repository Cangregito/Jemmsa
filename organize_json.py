#!/usr/bin/env python3
"""
Script para organizar data.json en archivos separados por categoría
"""
import json
import os
from pathlib import Path

# Rutas
root_dir = Path(__file__).parent
data_file = root_dir / "data.json"
categories_dir = root_dir / "src" / "data" / "categories"

# Crear directorio si no existe
categories_dir.mkdir(parents=True, exist_ok=True)

# Leer el JSON principal
print(f"Leyendo {data_file}...")
with open(data_file, 'r', encoding='utf-8') as f:
    data = json.load(f)

# Obtener lista de categorías
categories = data.get('categories', [])
products = data.get('products', {})

print(f"Encontradas {len(categories)} categorías")

# Crear archivo JSON por cada categoría
for category in categories:
    cat_id = category['id']
    cat_name = category['name']
    
    # Crear estructura de categoría
    category_data = {
        'category': category,
        'families': products.get(cat_id, {})
    }
    
    # Guardar en archivo
    output_file = categories_dir / f"{cat_id}.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(category_data, f, ensure_ascii=False, indent=2)
    
    print(f"✓ Creado: {cat_id}.json ({len(category_data['families'])} familias)")

# Crear archivo index.json con referencias
index_data = {
    'categories': categories,
    'categoryFiles': [f"{cat['id']}.json" for cat in categories]
}

index_file = categories_dir / "index.json"
with open(index_file, 'w', encoding='utf-8') as f:
    json.dump(index_data, f, ensure_ascii=False, indent=2)

print(f"\n✓ Creado: index.json")
print(f"\nOrganización completada en: {categories_dir}")
