import axios from "axios";

export interface GeoData {
  latitude: number;
  longitude: number;
  display_name: string;
}

export async function buscarCoordenadas(
  endereco: string,
  municipio: string,
  estado: string = "CE",
  bairro?: string
): Promise<GeoData | null> {
  // Corrige abreviações
  const enderecoFormatado = endereco
    .replace(/^Av\.\s*/i, "Avenida ")
    .replace(/^R\.\s*/i, "Rua ")
    .replace(/Mte\./i, "Mestre");

  const enderecoCompleto = `${enderecoFormatado}, ${
    bairro || ""
  }, ${municipio}, ${estado}, Brasil`;

  const token =
    process.env.MAPBOX_TOKEN || process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  if (!token) {
    console.warn(
      "⚠️ [GEOCODING] MAPBOX_TOKEN não está definido nas variáveis de ambiente."
    );
  }

  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    enderecoCompleto
  )}.json?access_token=${token}&limit=1&country=br`;

  console.log("🔍 [GEOCODING] Endereço completo enviado:", enderecoCompleto);

  try {
    const response = await axios.get(url);

    if (response.data?.features?.length > 0) {
      const f = response.data.features[0];
      console.log(
        "✅ [GEOCODING] Coordenadas encontradas:",
        f.center,
        f.place_name
      );
      return {
        latitude: f.center[1], // Mapbox returns [long, lat]
        longitude: f.center[0],
        display_name: f.place_name,
      };
    } else {
      console.log(
        "⚠️ [GEOCODING] Nenhuma coordenada encontrada para o endereço"
      );
    }
  } catch (err: any) {
    console.error("❌ [GEOCODING] Erro ao buscar coordenadas:", err.message);
    if (err.response) {
      console.error("❌ [GEOCODING] Status:", err.response.status);
      console.error("❌ [GEOCODING] Data:", err.response.data);
    }
  }

  return null;
}
