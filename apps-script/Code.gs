/**
 * Cajero de la Esperanza — receptor de formularios
 * Pegar en Extensiones > Apps Script de una Hoja de cálculo de Google.
 * Implementar como "Aplicación web": Ejecutar como = Yo, Acceso = Cualquier persona.
 */
const HOJA = 'Contactos';
const NOTIFICAR_A = '';   // opcional: correo que recibe aviso de cada solicitud (ej: 'oracion@miiglesia.cl')

const COLUMNAS = ['folio','fecha','kiosco','operacion','tipo_cajero','nombre','telefono',
                  'comuna','direccion','detalle','consentimiento','recibido','estado'];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sh = ss.getSheetByName(HOJA);
    if (!sh) {
      sh = ss.insertSheet(HOJA);
      sh.appendRow(COLUMNAS);
      sh.setFrozenRows(1);
      sh.getRange(1, 1, 1, COLUMNAS.length).setFontWeight('bold').setBackground('#0b2a4a').setFontColor('#ffffff');
    }
    const p = (e && e.parameter) || {};

    // Evita duplicados si el kiosco reintenta el mismo folio
    const folios = sh.getRange(2, 1, Math.max(sh.getLastRow() - 1, 1), 1).getValues().flat();
    if (p.folio && folios.indexOf(p.folio) !== -1) return json({ ok: true, dup: true });

    const fila = COLUMNAS.map(c => {
      if (c === 'recibido') return new Date();
      if (c === 'estado') return 'Pendiente';
      return String(p[c] || '').slice(0, 1000);
    });
    sh.appendRow(fila);

    if (NOTIFICAR_A) {
      MailApp.sendEmail(NOTIFICAR_A,
        `Nueva solicitud: ${p.operacion} — ${p.nombre}`,
        COLUMNAS.slice(0, 11).map(c => `${c}: ${p[c] || ''}`).join('\n'));
    }
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() { return json({ ok: true, servicio: 'Cajero de la Esperanza' }); }

function json(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
