// Placeholder model for a Chair entity
// In a future iteration, replace with real persistence (DB/ORM)
class Chair {
  constructor({ id, name, material, price }) {
    this.id = id;
    this.name = name;
    this.material = material;
    this.price = price;
  }
}

module.exports = Chair;
