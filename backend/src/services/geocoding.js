import axios from "axios";

export async function buscarCoordenadas(
  endereco,
  municipio,
  estado = "CE",
  bairro
) {
  // Corrige abreviações
  endereco = endereco
    .replace(/^Av\.\s*/i, "Avenida ")
    .replace(/^R\.\s*/i, "Rua ")
    .replace(/Mte\./i, "Mestre");

  const enderecoCompleto = `${endereco}, ${
    bairro || ""
  }, ${municipio}, ${estado}, Brasil`;

  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    enderecoCompleto
  )}.json?access_token=${process.env.MAPBOX_TOKEN}&limit=1&country=br`;

  console.log("🔍 [GEOCODING] Endereço original:", endereco);
  console.log("🔍 [GEOCODING] Endereço completo enviado:", enderecoCompleto);
  console.log("🔍 [GEOCODING] URL:", url);

  try {
    const response = await axios.get(url);

    console.log(
      "🔍 [GEOCODING] Resposta Mapbox:",
      JSON.stringify(response.data?.features?.slice(0, 2), null, 2)
    );

    if (response.data?.features?.length > 0) {
      const f = response.data.features[0];
      console.log(
        "✅ [GEOCODING] Coordenadas encontradas:",
        f.center,
        f.place_name
      );
      return {
        latitude: f.center[1],
        longitude: f.center[0],
        display_name: f.place_name,
      };
    } else {
      console.log(
        "⚠️ [GEOCODING] Nenhuma coordenada encontrada para o endereço"
      );
    }
  } catch (err) {
    console.error("❌ [GEOCODING] Erro ao buscar coordenadas:", err.message);
    if (err.response) {
      console.error("❌ [GEOCODING] Status:", err.response.status);
      console.error("❌ [GEOCODING] Data:", err.response.data);
    }
  }

  return null;
}
