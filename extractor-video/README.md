# Extractor y Transcriptor de Audio de YouTube

Este script permite descargar el audio de videos de YouTube y transcribirlo automáticamente usando Whisper AI de OpenAI.

## 🚀 Instalación

### 1. Activar el entorno virtual

```bash
# En macOS/Linux
source venv/bin/activate

# En Windows
venv\Scripts\activate
```

### 2. Instalar dependencias

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

**Nota**: La primera vez que ejecutes el script, Whisper descargará automáticamente el modelo seleccionado (~140MB para 'base').

### 3. Instalar ffmpeg (requerido por yt-dlp)

```bash
# En macOS con Homebrew
brew install ffmpeg

# En Ubuntu/Debian
sudo apt-get install ffmpeg

# En Windows con Chocolatey
choco install ffmpeg
```

## 📖 Uso

### Comando básico

```bash
python extraer_transcribir.py <URL_YOUTUBE>
```

### Con modelo específico

```bash
python extraer_transcribir.py <URL_YOUTUBE> <MODELO>
```

### Ejemplos

```bash
# Usar modelo por defecto (base)
python extraer_transcribir.py https://youtu.be/XLsMZ7GCAjU

# Usar modelo pequeño para mayor precisión
python extraer_transcribir.py https://youtu.be/XLsMZ7GCAjU small

# Usar modelo tiny para mayor velocidad
python extraer_transcribir.py https://youtu.be/XLsMZ7GCAjU tiny
```

## 🎯 Modelos disponibles

| Modelo   | Tamaño   | Velocidad  | Precisión  | Uso recomendado                |
| -------- | -------- | ---------- | ---------- | ------------------------------ |
| `tiny`   | ~39 MB   | ⚡⚡⚡⚡⚡ | ⭐⭐       | Pruebas rápidas                |
| `base`   | ~74 MB   | ⚡⚡⚡⚡   | ⭐⭐⭐     | **Por defecto** - Buen balance |
| `small`  | ~244 MB  | ⚡⚡⚡     | ⭐⭐⭐⭐   | Transcripciones importantes    |
| `medium` | ~769 MB  | ⚡⚡       | ⭐⭐⭐⭐⭐ | Alta precisión                 |
| `large`  | ~1550 MB | ⚡         | ⭐⭐⭐⭐⭐ | Máxima precisión               |

## 📂 Archivos generados

Después de ejecutar el script, se generarán:

- `audio.m4a` (o `.mp3`, `.wav`): Archivo de audio descargado
- `transcripcion.txt`: Texto transcrito completo

## ⚠️ Notas importantes

1. **Primera ejecución**: La primera vez que uses un modelo, Whisper lo descargará automáticamente. Esto puede tardar unos minutos.

2. **Idioma**: El script está configurado para transcribir en español. Para cambiar el idioma, modifica el parámetro `language='es'` en la función `transcribir_audio()`.

3. **Rendimiento**:

   - Videos largos pueden tardar varios minutos en transcribirse
   - Se recomienda tener al menos 4GB de RAM disponible
   - GPU no es requerida pero acelera significativamente el proceso

4. **Límites de YouTube**: Respeta los términos de servicio de YouTube al descargar contenido.

## 🛠️ Solución de problemas

### Error: "yt-dlp: command not found"

```bash
pip install --upgrade yt-dlp
```

### Error: "ffmpeg not found"

Instala ffmpeg siguiendo las instrucciones de la sección de instalación.

### Error: "Out of memory"

Usa un modelo más pequeño (tiny o base) o cierra otras aplicaciones.

### La transcripción no es precisa

Prueba con un modelo más grande (small, medium o large).

## 📝 Ejemplo de flujo completo

```bash
# 1. Activar entorno virtual
source venv/bin/activate

# 2. Ejecutar script
python extraer_transcribir.py https://youtu.be/XLsMZ7GCAjU base

# 3. Ver la transcripción
cat transcripcion.txt

# 4. Desactivar entorno virtual cuando termines
deactivate
```

## 🎬 Video de ejemplo

El video de ejemplo usado en la documentación:

- URL: https://youtu.be/XLsMZ7GCAjU
- Este es el video que mencionaste en tu solicitud

## 📄 Licencia

Este script usa:

- [yt-dlp](https://github.com/yt-dlp/yt-dlp) - Dominio público
- [OpenAI Whisper](https://github.com/openai/whisper) - MIT License
