#!/bin/bash

# Script de inicio rápido para extraer y transcribir video de YouTube

echo "🎬 Extractor y Transcriptor de Video de YouTube"
echo "================================================"
echo ""

# Activar entorno virtual
echo "Activando entorno virtual..."
source venv/bin/activate

# Verificar ffmpeg
if ! command -v ffmpeg &> /dev/null; then
    echo "⚠️  ffmpeg no está instalado. Instalando..."
    echo "Esto puede tomar unos minutos..."
    brew install ffmpeg
fi

echo ""
echo "✅ Entorno listo!"
echo ""
echo "Uso:"
echo "  python extraer_transcribir.py <URL_YOUTUBE> [modelo]"
echo ""
echo "Ejemplo:"
echo "  python extraer_transcribir.py https://youtu.be/XLsMZ7GCAjU base"
echo ""
echo "Modelos disponibles: tiny, base (por defecto), small, medium, large"
echo ""
