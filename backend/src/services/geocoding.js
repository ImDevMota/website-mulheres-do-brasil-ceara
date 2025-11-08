import axios from "axios";

// Usando Nominatim (OpenStreetMap) - 100% gratuito
export async function buscarCoordenadas(endereco, municipio, estado = "CE") {
  try {
    const query = `${endereco}, ${municipio}, ${estado}, Brasil`;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      query
    )}&limit=1`;

    const response = await axios.get(url, {
      headers: {
        "User-Agent": "RodasConversaApp/1.0", // Obrigatório pela política do Nominatim
      },
    });

    if (response.data && response.data.length > 0) {
      return {
        latitude: parseFloat(response.data[0].lat),
        longitude: parseFloat(response.data[0].lon),
        display_name: response.data[0].display_name,
      };
    }

    return null;
  } catch (error) {
    console.error("Erro ao buscar coordenadas:", error);
    return null;
  }
}

// Busca reversa (coordenadas → endereço)
export async function buscarEndereco(latitude, longitude) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

    const response = await axios.get(url, {
      headers: {
        "User-Agent": "RodasConversaApp/1.0",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Erro ao buscar endereço:", error);
    return null;
  }
}
