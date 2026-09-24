# Aurora Lite VR - Meta Quest 3S (Horizon OS / Android XR)

Este subdirectorio contiene la estructura base y los cimientos para empaquetar **Aurora Lite VR** como una aplicación nativa APK orientada a la familia de visores **Meta Quest 3S**, **Meta Quest 3** y **Meta Quest Pro**.

## Características de la Plataforma Quest 3S
- **SoC:** Qualcomm Snapdragon XR2 Gen 2 (arquitectura `arm64-v8a`).
- **Sistema Operativo:** Meta Horizon OS (basado en Android AOSP 12/14).
- **Modos de Pantalla:** 90Hz nativo recomendado y 120Hz para baja latencia.
- **Interacción:** Mandos Meta Quest Touch Plus y Hand Tracking v2.0 (gestos de pellizco y puntero láser).

## Instrucciones de Compilación del APK

### Requisitos Previos
1. **Android Studio** (versión Hedgehog o superior) o **Android SDK Command-Line Tools**.
2. **Android SDK Platform 34** y **NDK 26+**.
3. **JDK 17**.

### Comandos de Compilación
```bash
# 1. Navegar a la carpeta android_quest
cd code-vr/android_quest

# 2. Compilar APK en modo Release
./gradlew assembleRelease

# 3. El binario compilado se generará en:
# build/outputs/apk/release/android_quest-release.apk
```

### Instalación vía ADB o SideQuest en Meta Quest 3S
```bash
adb install -r build/outputs/apk/release/android_quest-release.apk
```
