# Arquitectura y Ecosistema VR de Aurora Lite (Meta Quest 3S / WebXR)

Este directorio (`code-vr`) contiene la pila modular dedicada para visores de Realidad Virtual y la preparación para Meta Quest 3S (Horizon OS / Android).

## Estructura de Directorios y Módulos

```
code-vr/
├── vr_engine.py             # Motor de WebXR/OpenXR, configuración de Chromium y tasas de refresco (90Hz/120Hz)
├── spatial_ui.js            # Punteros láser 3D y gestos espaciales (Hand Tracking)
├── apk_builder.py           # Automatizador de empaquetado y preparación de recursos para Quest 3S
├── theater/
│   └── virtual_theater.html # "Modo Entorno Inmersivo": Cine 3D con pantalla curva gigante IMAX
└── android_quest/           # Proyecto base para compilar la APK nativa para Horizon OS
    ├── AndroidManifest.xml  # Configuración de visor Quest (headtracking, 90/120Hz, VR categories)
    ├── build.gradle         # Configuración Gradle con arquitectura arm64-v8a (Snapdragon XR2)
    ├── MainActivity.kt      # Actividad nativa en Kotlin con contenedor WebXR acelerado
    └── README.md            # Guía técnica de compilación e instalación del APK
```

## Características Principales

1. **Soporte Nativo WebXR / OpenXR:**
   - Habilitado directamente en el motor Chromium/WebView2 mediante flags de hardware: `--enable-features=WebXR,OpenXR`, `--force-webxr-runtime=openxr` y sincronización de cuadros hasta 120 FPS.
2. **Modo Entorno Inmersivo (Teatro Virtual):**
   - Espacio tridimensional con auditorio y una pantalla gigante curva con curvatura geométrica invertida (IMAX).
   - Iluminación ambiental reactiva según los colores proyectados en pantalla.
   - Acceso con un solo clic desde el navegador ("🎭 Modo Teatro / VR").
3. **Cimientos para Meta Quest 3S:**
   - Separación modular limpia que permite compilar la versión de escritorio de Aurora Lite mientras mantiene listos los archivos para ensamblar el APK de Horizon OS en cualquier momento.
