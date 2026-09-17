/**
 * Aurora-Lite | Injector
 * Asegura la inyección segura de scripts en el DOM
 */
(function() {
    'use strict';

    function init() {
        console.log("[Aurora-Lite] DOM Listo. Iniciando inyección de WebGPU Mock...");
        
        // Creamos una etiqueta script para ejecutar el contenido de player-core.js
        // Esto evita conflictos de scope en el entorno de QtWebEngine
        const script = document.createElement('script');
        script.type = 'text/javascript';
        
        // Nota: Asegúrate de que este código sea el contenido de player-core.js
        // Si tienes problemas de carga, puedes pegar el contenido de player-core.js 
        // aquí mismo dentro de un string para asegurar carga inmediata.
        script.textContent = `
            /* Contenido inyectado dinámicamente */
            (function() {
                // Aquí se cargaría el contenido de player-core.js 
                // para garantizar que se ejecute en el contexto correcto.
            })();
        `;
        
        try {
            (document.head || document.documentElement).appendChild(script);
            console.log("[Aurora-Lite] Inyección exitosa.");
        } catch (e) {
            console.error("[Aurora-Lite] Error en inyección:", e);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();