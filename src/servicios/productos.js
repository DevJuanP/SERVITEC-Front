import axios from "axios";

export  async function getProducts() {
  //const response = await axios.get("http://localhost:8080/api/productos");
  const response = await axios.get("./../public/productos.json");
  const products = await response.data.productos;
  return products;
}

export const getByCategory = (category, productos) =>{
  return productos.filter(p => {
    let cat = p.categoria.name+"_"+p.categoria.Subcategoria
    console.log("cat: ",cat)
    return cat.trim() == category.trim();
  })
} 

export const getTitleCategory = (category) => {
  switch (category) {
    case "laptops_gaming":
      return "LAPTOPS GAMER";
    case "laptops_otras":
      return "OTRAS LAPTOPS";
    case "pc_combos":
      return "PC COMBOS";
    case "pc_profesional":
      return "PC PROFESIONALES";
    case "pc_oficinas":
      return "PC PARA OFICINAS";
    case "componentes_monitores":
      return "MONITORES";
    case "componentes_cases":
      return "CASES";
    case "componentes_mb":
      return "PLACAS BASE (MOTHERBOARDS)";
    case "componentes_ram":
      return "MEMORIAS RAM";
    case "componentes_cpus":
      return "PROCESADORES (CPU)";
    case "componentes_memorias":
      return "ALMACENAMIENTO (SSD / HDD)";
    case "componentes_otros":
      return "OTROS COMPONENTES";
    default:
      return "CATEGORÍA NO ENCONTRADA";
  }
};