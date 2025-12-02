#!/usr/bin/env python3
"""
Script para transcribir los primeros 30 minutos de un archivo de audio con timestamps.
"""
import os
import sys
import whisper
from datetime import timedelta


def formatear_timestamp(segundos):
    """
    Convierte segundos a formato HH:MM:SS.
    
    Args:
        segundos: Tiempo en segundos
    
    Returns:
        str: Tiempo formateado como HH:MM:SS
    """
    td = timedelta(seconds=segundos)
    horas = td.seconds // 3600
    minutos = (td.seconds % 3600) // 60
    segs = td.seconds % 60
    return f"{horas:02d}:{minutos:02d}:{segs:02d}"


def extraer_primeros_30_min(archivo_audio):
    """
    Extrae y guarda los primeros 30 minutos del audio.
    
    Args:
        archivo_audio: Ruta del archivo de audio original
    
    Returns:
        str: Ruta del nuevo archivo de audio (primeros 30 min)
    """
    import subprocess
    
    archivo_salida = 'audio_30min.opus'
    
    print(f"\n🎵 Extrayendo primeros 30 minutos de: {archivo_audio}")
    
    try:
        # Usar ffmpeg para extraer los primeros 30 minutos (1800 segundos)
        comando = [
            'ffmpeg',
            '-i', archivo_audio,
            '-t', '1800',  # 30 minutos = 1800 segundos
            '-c', 'copy',  # Copiar sin recodificar (más rápido)
            '-y',  # Sobrescribir si existe
            archivo_salida
        ]
        
        resultado = subprocess.run(comando, check=True, capture_output=True, text=True)
        print(f"✅ Audio de 30 minutos extraído: {archivo_salida}")
        return archivo_salida
        
    except subprocess.CalledProcessError as e:
        print(f"❌ Error al extraer audio: {e}")
        print(f"STDERR: {e.stderr}")
        sys.exit(1)


def transcribir_con_timestamps(archivo_audio, modelo='base'):
    """
    Transcribe un archivo de audio con timestamps usando Whisper.
    
    Args:
        archivo_audio: Ruta del archivo de audio
        modelo: Modelo de Whisper a usar
    
    Returns:
        list: Lista de segmentos con texto y timestamps
    """
    print(f"\n🎤 Transcribiendo con timestamps usando modelo '{modelo}'...")
    print("⏳ Esto puede tomar varios minutos...")
    
    try:
        # Cargar el modelo de Whisper
        model = whisper.load_model(modelo)
        
        # Transcribir el audio con word_timestamps activado
        resultado = model.transcribe(
            archivo_audio,
            language='es',
            verbose=True,
            word_timestamps=False  # Timestamps por segmento (más legible)
        )
        
        print("\n✅ Transcripción completada")
        return resultado['segments']
        
    except Exception as e:
        print(f"❌ Error al transcribir: {e}")
        import traceback
        print(f"Traceback: {traceback.format_exc()}")
        sys.exit(1)


def guardar_transcripcion_con_timestamps(segmentos, archivo_salida='transcripcion_30min.txt'):
    """
    Guarda la transcripción con timestamps en formato legible.
    
    Args:
        segmentos: Lista de segmentos con timestamps
        archivo_salida: Nombre del archivo de salida
    """
    try:
        with open(archivo_salida, 'w', encoding='utf-8') as f:
            f.write("=" * 80 + "\n")
            f.write("TRANSCRIPCIÓN CON TIMESTAMPS - PRIMEROS 30 MINUTOS\n")
            f.write("=" * 80 + "\n\n")
            
            for segmento in segmentos:
                inicio = formatear_timestamp(segmento['start'])
                fin = formatear_timestamp(segmento['end'])
                texto = segmento['text'].strip()
                
                # Formato: [HH:MM:SS - HH:MM:SS] Texto
                f.write(f"[{inicio} - {fin}] {texto}\n\n")
        
        print(f"\n💾 Transcripción guardada en: {archivo_salida}")
        
    except Exception as e:
        print(f"❌ Error al guardar transcripción: {e}")
        sys.exit(1)


def main():
    """Función principal."""
    if len(sys.argv) < 2:
        print("Uso: python transcribir_30min.py <archivo_audio> [modelo]")
        print("\nModelos disponibles:")
        print("  - tiny:   Más rápido, menos preciso")
        print("  - base:   Balance entre velocidad y precisión (por defecto)")
        print("  - small:  Más preciso, más lento")
        print("  - medium: Muy preciso, mucho más lento")
        print("  - large:  Máxima precisión, muy lento")
        print("\nEjemplo:")
        print("  python transcribir_30min.py audio.opus base")
        sys.exit(1)
    
    archivo_audio = sys.argv[1]
    modelo = sys.argv[2] if len(sys.argv) > 2 else 'base'
    
    # Verificar que el archivo existe
    if not os.path.exists(archivo_audio):
        print(f"❌ Error: No se encontró el archivo '{archivo_audio}'")
        sys.exit(1)
    
    print("=" * 80)
    print("🎬 Extractor de Primeros 30 Minutos con Timestamps")
    print("=" * 80)
    
    # Paso 1: Extraer primeros 30 minutos
    audio_30min = extraer_primeros_30_min(archivo_audio)
    
    # Paso 2: Transcribir con timestamps
    segmentos = transcribir_con_timestamps(audio_30min, modelo)
    
    # Paso 3: Guardar transcripción formateada
    guardar_transcripcion_con_timestamps(segmentos)
    
    print("\n" + "=" * 80)
    print("🎉 ¡Proceso completado exitosamente!")
    print("=" * 80)
    print(f"\n📄 Archivo de audio (30 min): {audio_30min}")
    print("📝 Archivo de transcripción: transcripcion_30min.txt")
    print("\n💡 La transcripción incluye timestamps en formato [HH:MM:SS - HH:MM:SS]")


if __name__ == '__main__':
    main()
