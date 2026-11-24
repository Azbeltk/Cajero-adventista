# Cajero de la Esperanza

Pantalla interactiva tipo cajero automático para la Iglesia Adventista del Séptimo Día.

## Estructura

```
index.html              ← la pantalla completa (HTML + CSS + JS)
img/logo-iasd.png       ← agregue aquí el logo oficial IASD
img/logo-nuevotiempo.png← agregue aquí el logo oficial de Nuevo Tiempo
apps-script/Code.gs     ← receptor de datos en Google Sheets
```

Si falta un logo, la pantalla muestra un círculo con "IASD" / "NT". Use los archivos oficiales del manual de marca de su Unión/Asociación (PNG con fondo transparente, versión blanca para fondo azul).

## 1. Publicar en GitHub Pages

1. Cree un repositorio (ej. `cajero-esperanza`) y suba todos los archivos.
2. *Settings → Pages → Source: Deploy from a branch → `main` / root*.
3. La pantalla quedará en `https://SU-USUARIO.github.io/cajero-esperanza/`.

## 2. Recibir los datos (Google Sheets, gratis)

GitHub Pages solo sirve archivos estáticos, así que los datos se envían a una Hoja de Google:

1. Cree una Hoja de cálculo nueva → *Extensiones → Apps Script*.
2. Pegue el contenido de `apps-script/Code.gs` y guarde.
3. *Implementar → Nueva implementación → Aplicación web*
   - Ejecutar como: **Yo** · Quién tiene acceso: **Cualquier persona**
4. Copie la URL (`https://script.google.com/macros/s/.../exec`) y péguela en `index.html`:
   ```js
   endpoint: "https://script.google.com/macros/s/XXXX/exec",
   ```
5. (Opcional) En `Code.gs` complete `NOTIFICAR_A` con un correo para recibir aviso de cada solicitud.

Cada solicitud crea una fila con folio, operación, nombre, teléfono, comuna, dirección y detalle, y una columna **estado** para que el equipo marque el seguimiento.

**Sin internet:** cada registro se guarda también en el equipo y los pendientes se reenvían automáticamente cada 5 minutos o al volver la conexión.

## 3. Canal Nuevo Tiempo

En `CONFIG.nuevoTiempo` de `index.html`:
- `youtubeChannelId`: ID del canal de YouTube de Nuevo Tiempo Chile (empieza con `UC…`) para mostrar la señal en vivo, **o**
- `embedUrl`: cualquier URL de inserción que entregue el canal.
- `website`: destino del código QR (verifique la URL oficial).

## 4. Configurar el kiosco

- Navegador en modo kiosco, ej. Chrome: `chrome --kiosk --autoplay-policy=no-user-gesture-required https://SU-USUARIO.github.io/cajero-esperanza/`
- Funciona horizontal o vertical; teclado y teclado numérico están en pantalla.
- Tras 60 s sin uso aparece un aviso y vuelve al inicio (protege datos de la persona anterior).
- **Panel oculto:** mantener presionada 3 s la esquina inferior derecha → PIN (`2580` por defecto, cámbielo en `CONFIG.adminPin`). Permite ver pendientes, reintentar envíos y descargar CSV de respaldo.

## Correspondencia de operaciones

| Botón del cajero | Operación |
|---|---|
| Depósito | Pedido de oración |
| Retiro | Literatura cristiana |
| Transferencia | Ser visitado/a |
| Inversión | Estudiar la Biblia |
| Canal de información | Canal Nuevo Tiempo Chile |

## Privacidad

La pantalla pide consentimiento explícito (Ley 19.628) antes de enviar. Restrinja el acceso a la Hoja solo al equipo de seguimiento.
