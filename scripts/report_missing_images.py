import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
IMG_ROOT = ROOT / "public" / "img"

CATEGORY_FOLDER_OVERRIDES = {
    "visitantes-interior": "Visitante Interior",
    "visitantes-exterior": "Visitante Exterior",
}

IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".webp"}


def normalize(value):
    return "".join(ch.lower() for ch in value if ch.isalnum())


def list_dirs(path):
    return [p for p in path.iterdir() if p.is_dir()]


def list_images(path):
    return [p for p in path.iterdir() if p.is_file() and p.suffix.lower() in IMAGE_EXTS]


def find_matching_dir(dirs, target):
    tnorm = normalize(target)
    for d in dirs:
        if normalize(d.name) == tnorm:
            return d
    return None


def main():
    missing = []

    cat_dir = ROOT / "src" / "data" / "categories"
    for path in sorted(cat_dir.glob("*.json")):
        if path.name == "index.json":
            continue

        data = json.loads(path.read_text(encoding="utf-8"))
        category = data.get("category", {})
        cat_id = category.get("id", path.stem)
        cat_name = category.get("name", cat_id)

        cat_folder_name = CATEGORY_FOLDER_OVERRIDES.get(cat_id)
        if not cat_folder_name:
            img_dirs = list_dirs(IMG_ROOT)
            cat_folder = find_matching_dir(img_dirs, cat_name) or find_matching_dir(img_dirs, cat_id)
            if not cat_folder:
                missing.append((cat_id, "CATEGORIA", cat_name, "no folder"))
                continue
            cat_folder_name = cat_folder.name
        cat_folder = IMG_ROOT / cat_folder_name

        families = data.get("families", {})
        if isinstance(families, list):
            product_dirs = list_dirs(cat_folder)
            product_files = list_images(cat_folder)
            for product in families:
                pid = product.get("id", "")
                if not pid:
                    continue
                prod_dir = find_matching_dir(product_dirs, pid)
                has_folder_imgs = bool(prod_dir and list_images(prod_dir))
                has_file = any(normalize(f.stem) == normalize(pid) for f in product_files)
                if not has_folder_imgs and not has_file:
                    missing.append((cat_id, "PRODUCTO", pid, "no images"))
            continue

        family_dirs = list_dirs(cat_folder)
        for fam_id, fam in families.items():
            fam_name = fam.get("name", fam_id)
            fam_folder = find_matching_dir(family_dirs, fam_name) or find_matching_dir(family_dirs, fam_id)
            if not fam_folder:
                missing.append((cat_id, "FAMILIA", fam_id, "no folder"))
                continue

            product_dirs = list_dirs(fam_folder)
            product_files = list_images(fam_folder)
            for product in fam.get("products", []):
                pid = product.get("id", "")
                if not pid:
                    continue
                prod_dir = find_matching_dir(product_dirs, pid)
                has_folder_imgs = bool(prod_dir and list_images(prod_dir))
                has_file = any(normalize(f.stem) == normalize(pid) for f in product_files)
                if not has_folder_imgs and not has_file:
                    missing.append((cat_id, fam_id, pid, "no images"))

    if not missing:
        print("No missing images detected")
        return

    print("Missing images (category, family, product):")
    for item in missing:
        print(" -", item)


if __name__ == "__main__":
    main()
