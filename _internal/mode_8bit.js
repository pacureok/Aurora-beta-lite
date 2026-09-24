// mode_8bit.js
// Filtro visual 8-BIT retro y procesador de audio Chiptune/Bitcrusher universal para Aurora-Lite

(function() {
    'use strict';

    window.__aurora_8bit_active = window.__aurora_8bit_active || false;

    // --- 1. SINTETIZADOR DE SONIDO RETRO 8-BIT (Beep Arcade) ---
    function reproducirBeep8Bit(activado) {
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            const ctx = new AudioCtx();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.type = 'square';
            const now = ctx.currentTime;
            if (activado) {
                // Sonido de 'Power Up' ascendente (NES / Arcade)
                osc.frequency.setValueAtTime(330, now);
                osc.frequency.setValueAtTime(440, now + 0.07);
                osc.frequency.setValueAtTime(660, now + 0.14);
                osc.frequency.setValueAtTime(880, now + 0.21);
                gain.gain.setValueAtTime(0.15, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.32);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now);
                osc.stop(now + 0.33);
            } else {
                // Sonido descendente 'Power Down'
                osc.frequency.setValueAtTime(660, now);
                osc.frequency.setValueAtTime(440, now + 0.08);
                osc.frequency.setValueAtTime(220, now + 0.16);
                gain.gain.setValueAtTime(0.12, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now);
                osc.stop(now + 0.29);
            }
        } catch(e) {}
    }

    // --- 2. BITCRUSHER DE AUDIO 8-BIT EN TIEMPO REAL (Universal: YouTube, Twitch, etc.) ---
    let audioCtxInstance = null;
    const mediosProcesados = new WeakSet();

    function aplicarBitcrusherAudio() {
        if (!window.__aurora_8bit_active) return;
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            if (!audioCtxInstance) {
                audioCtxInstance = new AudioCtx();
            }
            if (audioCtxInstance.state === 'suspended') {
                audioCtxInstance.resume();
            }

            const mediaElements = document.querySelectorAll('video, audio');
            mediaElements.forEach(media => {
                if (mediosProcesados.has(media)) return;

                try {
                    const source = audioCtxInstance.createMediaElementSource(media);
                    const bufferSize = 4096;
                    const crusher = audioCtxInstance.createScriptProcessor(bufferSize, 2, 2);
                    
                    const bits = 5; // Cuantización 8-bit / 32 niveles
                    const step = Math.pow(0.5, bits);
                    const downsampleFactor = 3; // Reducción de sample rate
                    let count = 0;
                    let lastSampleL = 0, lastSampleR = 0;

                    crusher.onaudioprocess = function(e) {
                        const inL = e.inputBuffer.getChannelData(0);
                        const inR = e.inputBuffer.numberOfChannels > 1 ? e.inputBuffer.getChannelData(1) : inL;
                        const outL = e.outputBuffer.getChannelData(0);
                        const outR = e.outputBuffer.numberOfChannels > 1 ? e.outputBuffer.getChannelData(1) : outL;

                        if (!window.__aurora_8bit_active) {
                            outL.set(inL);
                            outR.set(inR);
                            return;
                        }

                        for (let i = 0; i < inL.length; i++) {
                            count++;
                            if (count >= downsampleFactor) {
                                count = 0;
                                lastSampleL = step * Math.floor(inL[i] / step + 0.5);
                                lastSampleR = step * Math.floor(inR[i] / step + 0.5);
                            }
                            outL[i] = lastSampleL;
                            outR[i] = lastSampleR;
                        }
                    };

                    source.connect(crusher);
                    crusher.connect(audioCtxInstance.destination);
                    mediosProcesados.add(media);
                    console.log("[Aurora 8-Bit] Audio Bitcrusher conectado con éxito.");
                } catch(err) {
                    // Posible error si el medio ya está conectado
                }
            });
        } catch(e) {}
    }

    // --- 3. FILTRO VISUAL 8-BIT UNIVERSAL (YouTube, Búsquedas y Web) ---
    function inyectarEstilosVisuales8Bit() {
        let style = document.getElementById('aurora-8bit-css');
        if (!style) {
            style = document.createElement('style');
            style.id = 'aurora-8bit-css';
            document.documentElement.appendChild(style);
        }

        style.textContent = `
            html.aurora-8bit-active, 
            html.aurora-8bit-active body,
            html.aurora-8bit-active ytd-app,
            html.aurora-8bit-active #content,
            html.aurora-8bit-active .main,
            html.aurora-8bit-active #main {
                filter: contrast(145%) brightness(103%) saturate(135%) !important;
                image-rendering: pixelated !important;
                image-rendering: -moz-crisp-edges !important;
                image-rendering: crisp-edges !important;
            }
            html.aurora-8bit-active img, 
            html.aurora-8bit-active video, 
            html.aurora-8bit-active canvas,
            html.aurora-8bit-active svg,
            html.aurora-8bit-active .html5-video-player,
            html.aurora-8bit-active #movie_player {
                image-rendering: pixelated !important;
                image-rendering: -moz-crisp-edges !important;
                image-rendering: crisp-edges !important;
                filter: contrast(130%) saturate(140%) !important;
            }
            #aurora-8bit-scanlines {
                position: fixed !important;
                top: 0 !important; left: 0 !important;
                width: 100vw !important; height: 100vh !important;
                background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.28) 50%),
                            linear-gradient(90deg, rgba(255, 0, 0, 0.04), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.04)) !important;
                background-size: 100% 4px, 6px 100% !important;
                pointer-events: none !important;
                z-index: 2147483647 !important;
                box-shadow: inset 0 0 100px rgba(0,0,0,0.8) !important;
            }
        `;
    }

    function asegurarEstadoVisual() {
        if (window.__aurora_8bit_active) {
            inyectarEstilosVisuales8Bit();
            if (!document.documentElement.classList.contains('aurora-8bit-active')) {
                document.documentElement.classList.add('aurora-8bit-active');
            }
            if (document.body && !document.body.classList.contains('aurora-8bit-active')) {
                document.body.classList.add('aurora-8bit-active');
            }
            let scanlines = document.getElementById('aurora-8bit-scanlines');
            if (!scanlines) {
                scanlines = document.createElement('div');
                scanlines.id = 'aurora-8bit-scanlines';
                document.documentElement.appendChild(scanlines);
            }
            aplicarBitcrusherAudio();
        } else {
            document.documentElement.classList.remove('aurora-8bit-active');
            if (document.body) document.body.classList.remove('aurora-8bit-active');
            let scanlines = document.getElementById('aurora-8bit-scanlines');
            if (scanlines) scanlines.remove();
        }
    }

    // --- 4. CONTROL GLOBAL DE CONMUTACIÓN ---
    window.__aurora_toggle_8bit = function(forzarEstado) {
        const nuevoEstado = (forzarEstado !== undefined) ? !!forzarEstado : !window.__aurora_8bit_active;
        window.__aurora_8bit_active = nuevoEstado;

        reproducirBeep8Bit(nuevoEstado);
        asegurarEstadoVisual();

        return { ok: true, active: nuevoEstado };
    };

    // --- 5. DETECCIÓN AUTOMÁTICA EN CAMBIOS DE URL Y SPA (YouTube, Twitter, etc.) ---
    // Interceptar History API para detectar navegaciones internas
    if (!window.__aurora_history_hooked) {
        window.__aurora_history_hooked = true;
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;

        history.pushState = function() {
            const ret = originalPushState.apply(this, arguments);
            if (window.__aurora_8bit_active) {
                setTimeout(asegurarEstadoVisual, 100);
                setTimeout(aplicarBitcrusherAudio, 600);
                setTimeout(aplicarBitcrusherAudio, 1500);
            }
            return ret;
        };

        history.replaceState = function() {
            const ret = originalReplaceState.apply(this, arguments);
            if (window.__aurora_8bit_active) {
                setTimeout(asegurarEstadoVisual, 100);
                setTimeout(aplicarBitcrusherAudio, 600);
            }
            return ret;
        };

        window.addEventListener('popstate', function() {
            if (window.__aurora_8bit_active) {
                setTimeout(asegurarEstadoVisual, 100);
                setTimeout(aplicarBitcrusherAudio, 600);
            }
        });

        window.addEventListener('hashchange', function() {
            if (window.__aurora_8bit_active) {
                asegurarEstadoVisual();
            }
        });
    }

    // YouTube SPA navigation events
    window.addEventListener('yt-navigate-finish', function() {
        if (window.__aurora_8bit_active) {
            asegurarEstadoVisual();
            setTimeout(aplicarBitcrusherAudio, 400);
            setTimeout(aplicarBitcrusherAudio, 1200);
            setTimeout(aplicarBitcrusherAudio, 2500);
        }
    });

    // Eventos de reproducción multimedia
    document.addEventListener('play', function(e) {
        if (window.__aurora_8bit_active) {
            aplicarBitcrusherAudio();
        }
    }, true);

    document.addEventListener('loadeddata', function(e) {
        if (window.__aurora_8bit_active) {
            aplicarBitcrusherAudio();
        }
    }, true);

    // MutationObserver para mantener clases y scanlines ante cambios dinámicos del DOM
    if (window.MutationObserver && !window.__aurora_observer_active) {
        window.__aurora_observer_active = true;
        const observer = new MutationObserver(function(mutations) {
            if (window.__aurora_8bit_active) {
                if (!document.documentElement.classList.contains('aurora-8bit-active')) {
                    document.documentElement.classList.add('aurora-8bit-active');
                }
                if (!document.getElementById('aurora-8bit-scanlines')) {
                    const scanlines = document.createElement('div');
                    scanlines.id = 'aurora-8bit-scanlines';
                    document.documentElement.appendChild(scanlines);
                }
            }
        });
        observer.observe(document.documentElement, { attributes: true, childList: true, subtree: false });
    }

    // Intervalo de seguridad para audios/videos cargados dinámicamente
    if (!window.__aurora_interval_active) {
        window.__aurora_interval_active = true;
        setInterval(function() {
            if (window.__aurora_8bit_active) {
                asegurarEstadoVisual();
            }
        }, 1500);
    }

    // Ejecución inmediata
    asegurarEstadoVisual();

})();
