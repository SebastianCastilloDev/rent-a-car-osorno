#!/usr/bin/env python3
"""
Script para extraer audio de YouTube y transcribirlo usando Whisper.
"""
import os
import sys
import subprocess
import whisper


def descargar_audio(url_video, archivo_salida='audio'):
    """
    Descarga el audio de un video de YouTube.
    
    Args:
        url_video: URL del video de YouTube
        archivo_salida: Nombre del archivo de salida (sin extensión)
    
    Returns:
        str: Ruta del archivo de audio descargado
    """
    print(f"📥 Descargando audio de: {url_video}")
    
    try:
        # Usar yt-dlp para descargar solo el audio
        comando = [
            'yt-dlp',
            '-f', 'bestaudio',
            '-o', f'{archivo_salida}.%(ext)s',
            url_video
        ]
        
        print(f"🔧 Ejecutando comando: {' '.join(comando)}")
        resultado = subprocess.run(comando, check=True, capture_output=True, text=True)
        print("✅ Audio descargado exitosamente")
        print(f"📋 Salida de yt-dlp:\n{resultado.stdout}")
        
        # Listar archivos en el directorio actual
        print(f"\n📂 Archivos en el directorio actual:")
        archivos_actuales = os.listdir('.')
        for archivo in archivos_actuales:
            if archivo.startswith(archivo_salida):
                print(f"  ✓ {archivo}")
        
        # Buscar el archivo descargado con más extensiones posibles
        extensiones_posibles = ['m4a', 'mp3', 'wav', 'webm', 'opus', 'ogg', 'aac']
        for ext in extensiones_posibles:
            archivo = f'{archivo_salida}.{ext}'
            print(f"🔍 Buscando: {archivo}")
            if os.path.exists(archivo):
                print(f"✅ Encontrado: {archivo}")
                return archivo
        
        # Si no encontramos con el nombre esperado, buscar cualquier archivo que empiece con 'audio'
        for archivo in archivos_actuales:
            if archivo.startswith(archivo_salida) and not archivo.endswith('.py'):
                print(f"✅ Encontrado archivo alternativo: {archivo}")
                return archivo
        
        raise FileNotFoundError(f"No se encontró el archivo de audio. Archivos en directorio: {archivos_actuales}")
        
    except subprocess.CalledProcessError as e:
        print(f"❌ Error al descargar el audio: {e}")
        print(f"📋 STDOUT: {e.stdout}")
        print(f"📋 STDERR: {e.stderr}")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Error inesperado: {e}")
        import traceback
        print(f"📋 Traceback completo:\n{traceback.format_exc()}")
        sys.exit(1)


def transcribir_audio(archivo_audio, modelo='base'):
    """
    Transcribe un archivo de audio usando Whisper.
    
    Args:
        archivo_audio: Ruta del archivo de audio
        modelo: Modelo de Whisper a usar (tiny, base, small, medium, large)
    
    Returns:
        str: Texto transcrito
    """
    print(f"\n🎤 Transcribiendo audio usando modelo '{modelo}'...")
    print("⏳ Esto puede tomar varios minutos dependiendo del tamaño del archivo...")
    
    try:
        # Cargar el modelo de Whisper
        model = whisper.load_model(modelo)
        
        # Transcribir el audio
        resultado = model.transcribe(archivo_audio, language='es', verbose=True)
        
        print("\n✅ Transcripción completada")
        return resultado['text']
        
    except Exception as e:
        print(f"❌ Error al transcribir: {e}")
        sys.exit(1)


def guardar_transcripcion(texto, archivo_salida='transcripcion.txt'):
    """
    Guarda la transcripción en un archivo de texto.
    
    Args:
        texto: Texto a guardar
        archivo_salida: Nombre del archivo de salida
    """
    try:
        with open(archivo_salida, 'w', encoding='utf-8') as f:
            f.write(texto)
        print(f"\n💾 Transcripción guardada en: {archivo_salida}")
    except Exception as e:
        print(f"❌ Error al guardar transcripción: {e}")
        sys.exit(1)


def main():
    """Función principal."""
    if len(sys.argv) < 2:
        print("Uso: python extraer_transcribir.py <URL_YOUTUBE> [modelo]")
        print("\nModelos disponibles:")
        print("  - tiny:   Más rápido, menos preciso")
        print("  - base:   Balance entre velocidad y precisión (por defecto)")
        print("  - small:  Más preciso, más lento")
        print("  - medium: Muy preciso, mucho más lento")
        print("  - large:  Máxima precisión, muy lento")
        print("\nEjemplo:")
        print("  python extraer_transcribir.py https://youtu.be/XLsMZ7GCAjU base")
        sys.exit(1)
    
    url_video = sys.argv[1]
    modelo = sys.argv[2] if len(sys.argv) > 2 else 'base'
    
    print("=" * 60)
    print("🎬 Extractor y Transcriptor de Audio de YouTube")
    print("=" * 60)
    
    # Paso 1: Descargar audio
    archivo_audio = descargar_audio(url_video)
    
    # Paso 2: Transcribir audio
    transcripcion = transcribir_audio(archivo_audio, modelo)
    
    # Paso 3: Guardar transcripción
    guardar_transcripcion(transcripcion)
    
    print("\n" + "=" * 60)
    print("🎉 ¡Proceso completado exitosamente!")
    print("=" * 60)
    print(f"\n📄 Archivo de audio: {archivo_audio}")
    print("📝 Archivo de transcripción: transcripcion.txt")
    
    # Mostrar un preview de la transcripción
    preview = transcripcion[:300] + "..." if len(transcripcion) > 300 else transcripcion
    print(f"\n📖 Preview de la transcripción:\n{preview}\n")


if __name__ == '__main__':
    main()
