export async function buscarCoordenadas(
  endereco,
  municipio,
  estado = "CE",
  bairro
) {
  // Corrige abreviações
  endereco = endereco.replace(/^R\.\s*/i, "Rua ").replace(/Mte\./i, "Mestre");

  const enderecoCompleto = `${endereco}, ${
    bairro || ""
  }, ${municipio}, ${estado}, Brasil`;

  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    enderecoCompleto
  )}.json?access_token=${process.env.MAPBOX_TOKEN}&limit=1&country=br`;

  try {
    const response = await axios.get(url);

    if (response.data?.features?.length > 0) {
      const f = response.data.features[0];
      return {
        latitude: f.center[1],
        longitude: f.center[0],
        display_name: f.place_name,
      };
    }
  } catch (err) {
    console.error("Erro ao buscar coordenadas:", err.message);
  }

  return null;
}
