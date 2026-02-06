import json
import os
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
IMG_ROOT = ROOT / "public" / "img"

CATEGORY_FOLDER_OVERRIDES = {
    "visitantes-interior": "Visitante Interior",
    "visitantes-exterior": "Visitante Exterior",
}

IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".webp"}

LABEL_RULES = [
    ("frente", "Frente", 1),
    ("frontal", "Frente", 1),
    ("front", "Frente", 1),
    ("lateral", "Lateral", 2),
    ("lado", "Lateral", 2),
    ("atras", "Atras", 3),
    ("tras", "Atras", 3),
    ("back", "Atras", 3),
    ("ambiente", "Ambiente", 4),
    ("ambient", "Ambiente", 4),
    ("ambientada", "Ambiente", 4),
    ("detalle", "Detalle", 5),
]


def normalize(value):
    return "".join(ch.lower() for ch in value if ch.isalnum())


def list_dirs(path):
    return [p for p in path.iterdir() if p.is_dir()]


def list_images(path):
    files = []
    for p in path.iterdir():
        if p.is_file() and p.suffix.lower() in IMAGE_EXTS:
            files.append(p)
    return files


def find_matching_dir(dirs, target):
    tnorm = normalize(target)
    for d in dirs:
        if normalize(d.name) == tnorm:
            return d
    return None


def guess_label(filename):
    name = normalize(Path(filename).stem)
    for key, label, rank in LABEL_RULES:
        if key in name:
            return label, rank
    return None, 99


def build_image_list(folder, rel_prefix):
    images = list_images(folder)
    if not images:
        return []

    items = []
    for img in images:
        label, rank = guess_label(img.name)
        items.append((rank, label, img))

    items.sort(key=lambda x: (x[0], x[2].name.lower()))

    results = []
    unknown_count = 1
    for rank, label, img in items:
        if not label:
            label = f"Imagen {unknown_count}"
            unknown_count += 1
        url = f"{rel_prefix}/{img.name}".replace("\\", "/")
        results.append({"url": url, "label": label})
    return results


def update_category_file(path):
    with path.open("r", encoding="utf-8") as f:
        data = json.load(f)

    category = data.get("category", {})
    category_id = category.get("id", "")
    category_name = category.get("name", "")

    category_folder_name = CATEGORY_FOLDER_OVERRIDES.get(category_id)
    if not category_folder_name:
        img_dirs = list_dirs(IMG_ROOT)
        category_folder = find_matching_dir(img_dirs, category_name) or find_matching_dir(img_dirs, category_id)
        if not category_folder:
            return False
        category_folder_name = category_folder.name
    category_folder = IMG_ROOT / category_folder_name

    families = data.get("families", {})
    family_dirs = list_dirs(category_folder)

    changed = False

    if isinstance(families, list):
        # Categoria sin familias, lista directa de productos
        product_dirs = list_dirs(category_folder)
        product_files = list_images(category_folder)
        rel_prefix = f"../public/img/{category_folder.name}"

        for product in families:
            product_id = product.get("id", "")
            if not product_id:
                continue

            product_folder = find_matching_dir(product_dirs, product_id)
            images_list = []
            if product_folder:
                images_list = build_image_list(product_folder, f"{rel_prefix}/{product_folder.name}")

            if images_list:
                product["image"] = images_list[0]["url"]
                if len(images_list) > 1:
                    product["images"] = images_list
                elif "images" in product:
                    product.pop("images", None)
                changed = True
                continue

            base_file = None
            for f in product_files:
                if normalize(f.stem) == normalize(product_id):
                    base_file = f
                    break
            if base_file:
                product["image"] = f"{rel_prefix}/{base_file.name}".replace("\\", "/")
                product.pop("images", None)
                changed = True
    else:
        for family_id, family in families.items():
            family_name = family.get("name", "")
            family_folder = find_matching_dir(family_dirs, family_name) or find_matching_dir(family_dirs, family_id)
            if not family_folder:
                continue

            product_dirs = list_dirs(family_folder)
            product_files = list_images(family_folder)

            for product in family.get("products", []):
                product_id = product.get("id", "")
                if not product_id:
                    continue

                product_folder = find_matching_dir(product_dirs, product_id)
                rel_prefix = f"../public/img/{category_folder.name}/{family_folder.name}"

                images_list = []
                if product_folder:
                    images_list = build_image_list(product_folder, f"{rel_prefix}/{product_folder.name}")

                if images_list:
                    product["image"] = images_list[0]["url"]
                    if len(images_list) > 1:
                        product["images"] = images_list
                    elif "images" in product:
                        product.pop("images", None)
                    changed = True
                    continue

                # Fallback: buscar archivo base en la carpeta de la familia
                base_file = None
                for f in product_files:
                    if normalize(f.stem) == normalize(product_id):
                        base_file = f
                        break
                if base_file:
                    product["image"] = f"{rel_prefix}/{base_file.name}".replace("\\", "/")
                    product.pop("images", None)
                    changed = True

    if changed:
        with path.open("w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
            f.write("\n")

    return changed


def main():
    targets = [
        ROOT / "src" / "data" / "categories",
        ROOT / "dist" / "data" / "categories",
    ]

    for target in targets:
        if not target.exists():
            continue
        for path in target.glob("*.json"):
            if path.name == "index.json":
                continue
            update_category_file(path)


if __name__ == "__main__":
    main()
