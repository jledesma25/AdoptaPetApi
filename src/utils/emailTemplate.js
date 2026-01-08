// Función para construir template de email
function buildEmailTemplate({
  headerTitle = "AdoptaPet",
  headerSubtitle = "",
  headerColor = "#2e7d32",
  sections = [],
  footerNote = "",
}) {
  const sectionsMarkup = sections
    .map((section) => {
      if (!section.rows || section.rows.length === 0) return "";
      const rowMarkup = section.rows
        .map(
          ({ label, value }) => `
        <tr>
          <td style="padding:8px 12px; border-bottom:1px solid #e0e0e0; background:#fafafa; font-weight:600; color:#607d8b; width:45%;">${label}</td>
          <td style="padding:8px 12px; border-bottom:1px solid #e0e0e0; color:#263238; font-weight:600;">${value ?? "-"}</td>
        </tr>`
        )
        .join("");

      return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse; margin-bottom:24px; border:1px solid #e0e0e0; border-radius:12px; overflow:hidden;">
      <tr>
        <td colspan="2" style="background:#f5f5f5; padding:12px 18px; font-weight:700; color:#37474f; text-transform:uppercase; letter-spacing:0.5px;">${section.title}</td>
      </tr>
      ${rowMarkup}
    </table>`;
    })
    .join("");

  return `
  <!DOCTYPE html>
  <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${headerTitle}</title>
    </head>
    <body style="margin:0; padding:24px; font-family:'Helvetica Neue', Arial, sans-serif; background-color:#f1f5f9; color:#263238;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px; margin:0 auto; background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 12px 32px rgba(15,23,42,0.08);">
              <tr>
                <td style="background:${headerColor}; color:#ffffff; padding:30px 24px; text-align:center;">
                  <div style="font-size:24px; font-weight:700; letter-spacing:0.6px;">${headerTitle}</div>
                  ${
                    headerSubtitle
                      ? `<div style="margin-top:8px; font-size:16px; font-weight:500; opacity:0.9;">${headerSubtitle}</div>`
                      : ""
                  }
                </td>
              </tr>
              <tr>
                <td style="padding:28px 28px 32px;">
                  ${sectionsMarkup}
                  ${
                    footerNote
                      ? `<div style="margin-top:12px; padding:16px; background:#f8f9fb; border-radius:12px; color:#546e7a; line-height:1.6;">${footerNote}</div>`
                      : ""
                  }
                  <div style="margin-top:32px; text-align:center; color:#90a4ae; font-size:12px; letter-spacing:0.5px; text-transform:uppercase;">
                    © ${new Date().getFullYear()} AdoptaPet. Todos los derechos reservados.
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>`;
}

module.exports = { buildEmailTemplate };
