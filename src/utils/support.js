export const SUPPORT_EMAIL = "fullred777@gmail.com";

// Gera um link mailto: já preenchido com assunto e corpo — se souber o
// texto que o usuário buscou (marca/modelo), inclui no corpo pra facilitar
// o atendimento (você já sabe de cara qual aparelho a pessoa está pedindo).
export function buildSupportMailto(deviceQuery = "") {
  const subject = "No encontré mi modelo en FullHead";
  const body = deviceQuery
    ? `Hola, no encontré mi modelo en el panel.\n\nMi celular: ${deviceQuery}\n\n(Puedes agregar la marca completa y el modelo exacto si falta algo aquí)`
    : `Hola, no encontré mi modelo en el panel.\n\nMi celular es: `;
  return `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
