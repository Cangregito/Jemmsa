import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC_DIR = ROOT / "src" / "data" / "categories"
OUTPUT = ROOT / "data.json"


def main():
    index_path = SRC_DIR / "index.json"
    if not index_path.exists():
        raise FileNotFoundError("index.json not found")

    index_data = json.loads(index_path.read_text(encoding="utf-8"))
    categories = index_data.get("categories", [])

    products = {}
    for category in categories:
        cat_id = category.get("id")
        if not cat_id:
            continue
        cat_path = SRC_DIR / f"{cat_id}.json"
        if not cat_path.exists():
            continue
        cat_data = json.loads(cat_path.read_text(encoding="utf-8"))
        families = cat_data.get("families", {})
        products[cat_id] = families

    payload = {
        "categories": categories,
        "products": products,
    }

    OUTPUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
