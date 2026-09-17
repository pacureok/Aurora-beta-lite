/**
 * Aurora-Lite: Core de Reproducción y Mock Seguro de WebGPU
 * Maneja la compatibilidad con entornos que no tienen aceleración gráfica por hardware.
 */
(function() {
    'use strict';

    console.log("[Aurora-Lite] Inicializando core de reproducción y mock de WebGPU...");

    // 1. Mock seguro de WebGPU para evitar bloqueos fatales si el hardware no lo soporta
    if (!navigator.gpu) {
        console.warn("[Aurora-Lite] WebGPU no está disponible en este hardware. Activando modo de compatibilidad por software...");
        
        window.navigator.gpu = {
            requestAdapter: async function() {
                console.warn("[Aurora-Lite] requestAdapter interceptado: Forzando respaldo (Fallback) a CPU/Software.");
                return null; // Devuelve null controladamente para que los scripts sepan que no hay GPU dedicada
            }
        };
    }

    // 2. Gestor seguro para el VideoTransformer con control de excepciones
    class AuroraVideoTransformerHandler {
        constructor() {
            this.isWebGPUActive = false;
        }

        async initializeContext() {
            try {
                if (navigator.gpu && typeof navigator.gpu.requestAdapter === 'function') {
                    const adapter = await navigator.gpu.requestAdapter();
                    if (adapter) {
                        const device = await adapter.requestDevice();
                        if (device) {
                            this.isWebGPUActive = true;
                            console.log("[Aurora-Lite] (VideoTransformer) WebGPU adaptador y dispositivo activos.");
                            return;
                        }
                    }
                }
                throw new Error("Adaptador WebGPU no disponible o rechazado por el sistema.");
            } catch (error) {
                console.warn("[Aurora-Lite] (VideoTransformer) Advertencia: WebGPU adapter unavailable. El reproductor utilizará decodificación estándar HTML5/CPU de forma segura.");
                this.isWebGPUActive = false;
            }
        }
    }

    // Inicializar el manejador de forma global y segura
    window.__auroraVideoTransformer = new AuroraVideoTransformerHandler();
    window.__auroraVideoTransformer.initializeContext();

    // 3. Interceptar la creación de elementos de video para asegurar atributos de reproducción compatibles
    const nativeCreateElement = document.document?.createElement || document.createElement;
    if (nativeCreateElement) {
        document.createElement = function(tagName, options) {
            const element = nativeCreateElement.call(document, tagName, options);
            if (tagName && typeof tagName === 'string' && tagName.toLowerCase() === 'video') {
                // Asegurar atributos que evitan bloqueos de reproducción en Chromium embebido
                element.setAttribute('playsinline', '');
                element.setAttribute('webkit-playsinline', '');
                
                // Evitar que errores internos del reproductor detengan la ejecución global
                element.addEventListener('error', function(e) {
                    console.warn("[Aurora-Lite] Elemento de video capturó un error, intentando ignorar para evitar cierre del player:", e);
                }, true);
            }
            return element;
        };
    }

    console.log("[Aurora-Lite] Core de reproducción cargado correctamente con políticas de respaldo.");
})();