// youtube_optimizer.js
// Optimización de YouTube para Aurora-Lite con Botón Skip siempre visible y controles

(function() {
    'use strict';
    if (window.__aurora_yt_optimizer_injected) return;
    window.__aurora_yt_optimizer_injected = true;

    console.log("[Aurora-Lite] YouTube Turbo Engine inicializado.");

    // --- 1. BOTÓN SKIP SIEMPRE VISIBLE EN YOUTUBE ---
    function asegurarBotonSkip() {
        const adShowing = document.querySelector('.ad-showing, .ad-interrupting');
        const player = document.querySelector('.html5-video-player, #movie_player');
        let auroraSkipBtn = document.getElementById('aurora-btn-skip-ad');

        if (adShowing && player) {
            // Asegurar que el botón nativo de YouTube nunca se oculte ni se bloquee
            const nativeButtons = document.querySelectorAll('.ytp-ad-skip-button, .ytp-ad-skip-button-modern, .ytp-skip-ad-button, .ytp-ad-skip-button-slot, button.ytp-ad-skip-button-text');
            nativeButtons.forEach(btn => {
                btn.style.display = 'block';
                btn.style.opacity = '1';
                btn.style.visibility = 'visible';
                btn.style.pointerEvents = 'auto';
                btn.removeAttribute('disabled');
            });

            // Inyectar botón de Skip visible y destacado para que el usuario siempre pueda saltar
            if (!auroraSkipBtn) {
                auroraSkipBtn = document.createElement('button');
                auroraSkipBtn.id = 'aurora-btn-skip-ad';
                auroraSkipBtn.innerHTML = '⏭ Saltar Anuncio';
                auroraSkipBtn.title = 'Saltar este anuncio';
                auroraSkipBtn.style.cssText = `
                    position: absolute;
                    bottom: 85px;
                    right: 20px;
                    background: rgba(22, 22, 30, 0.9);
                    color: #7aa2f7;
                    border: 2px solid #7aa2f7;
                    border-radius: 8px;
                    padding: 8px 18px;
                    font-size: 14px;
                    font-weight: bold;
                    cursor: pointer;
                    z-index: 99999;
                    box-shadow: 0 4px 16px rgba(0,0,0,0.8);
                    transition: all 0.2s ease;
                    user-select: none;
                `;
                auroraSkipBtn.onmouseenter = () => {
                    auroraSkipBtn.style.background = '#7aa2f7';
                    auroraSkipBtn.style.color = '#16161e';
                    auroraSkipBtn.style.transform = 'scale(1.05)';
                };
                auroraSkipBtn.onmouseleave = () => {
                    auroraSkipBtn.style.background = 'rgba(22, 22, 30, 0.9)';
                    auroraSkipBtn.style.color = '#7aa2f7';
                    auroraSkipBtn.style.transform = 'scale(1.0)';
                };

                auroraSkipBtn.onclick = function(e) {
                    e.stopPropagation();
                    // Hacer clic en cualquier botón nativo de salto existente
                    const skips = document.querySelectorAll('.ytp-ad-skip-button, .ytp-ad-skip-button-modern, .ytp-skip-ad-button, button.ytp-ad-skip-button-text');
                    let saltado = false;
                    for (const s of skips) {
                        try {
                            s.click();
                            saltado = true;
                        } catch(err) {}
                    }
                    // Si el anuncio no respondió al click nativo, avanzar al final del clip
                    const video = document.querySelector('video');
                    if (video && isFinite(video.duration) && video.duration > 0) {
                        video.currentTime = video.duration;
                    }
                    if (auroraSkipBtn) auroraSkipBtn.remove();
                };

                player.appendChild(auroraSkipBtn);
            }
        } else {
            // Si el anuncio ya pasó, retirar el botón Skip
            if (auroraSkipBtn) {
                auroraSkipBtn.remove();
            }
        }
    }

    setInterval(asegurarBotonSkip, 250);

    // --- 2. COMANDOS DE VIDEO GLOBALES ---
    window.__aurora_toggle_pip = function() {
        const video = document.querySelector('video');
        if (!video) return { ok: false, error: "No se encontró video." };
        if (document.pictureInPictureElement) {
            document.exitPictureInPicture().catch(() => {});
            return { ok: true, pip: false };
        } else if (typeof video.requestPictureInPicture === 'function') {
            video.requestPictureInPicture().catch((e) => console.warn(e));
            return { ok: true, pip: true };
        }
        return { ok: false };
    };

    window.__aurora_toggle_mute = function() {
        const video = document.querySelector('video') || document.querySelector('audio');
        if (!video) return { ok: false };
        video.muted = !video.muted;
        return { ok: true, muted: video.muted };
    };

    window.__aurora_set_speed = function(rate) {
        const video = document.querySelector('video');
        if (video) {
            video.playbackRate = rate;
            return { ok: true, speed: rate };
        }
        return { ok: false };
    };

    window.__aurora_is_playing_audio = function() {
        const media = Array.from(document.querySelectorAll('video, audio'));
        return media.some(m => !m.paused && !m.muted && m.currentTime > 0 && m.volume > 0);
    };

    // --- 3. MODO CINE / TEATRO ---
    window.__aurora_toggle_cinema = function() {
        let overlay = document.getElementById('aurora-cinema-overlay');
        if (overlay) {
            overlay.remove();
            return { ok: true, cinema: false };
        }
        overlay = document.createElement('div');
        overlay.id = 'aurora-cinema-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(0, 0, 0, 0.88);
            z-index: 9998;
            pointer-events: none;
            transition: opacity 0.3s ease;
        `;
        document.body.appendChild(overlay);

        const player = document.querySelector('#movie_player, .html5-video-player, video');
        if (player) {
            player.style.zIndex = '9999';
            player.style.position = 'relative';
        }
        return { ok: true, cinema: true };
    };

    // --- 4. BARRA FLOTANTE DE CONTROL EN YOUTUBE ---
    function inyectarBotonFlotante() {
        if (document.getElementById('aurora-yt-floating-bar')) return;
        const player = document.querySelector('.html5-video-player');
        if (!player) return;

        const bar = document.createElement('div');
        bar.id = 'aurora-yt-floating-bar';
        bar.style.cssText = `
            position: absolute;
            top: 12px;
            right: 12px;
            background: rgba(22, 22, 30, 0.85);
            backdrop-filter: blur(8px);
            border: 1px solid rgba(122, 162, 247, 0.4);
            border-radius: 8px;
            padding: 4px 8px;
            display: flex;
            align-items: center;
            gap: 6px;
            z-index: 99999;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
            font-family: system-ui, -apple-system, sans-serif;
            font-size: 11px;
            color: #c0caf5;
            user-select: none;
        `;

        const btnPip = document.createElement('button');
        btnPip.innerHTML = '📺 PiP';
        btnPip.title = 'Abrir en Mini-Ventana Flotante (Picture-in-Picture)';
        btnPip.style.cssText = 'background: #24283b; color: #7aa2f7; border: none; border-radius: 4px; padding: 3px 6px; cursor: pointer; font-weight: bold;';
        btnPip.onclick = () => window.__aurora_toggle_pip();

        const selSpeed = document.createElement('select');
        selSpeed.style.cssText = 'background: #16161e; color: #7aa2f7; border: 1px solid #24283b; border-radius: 4px; padding: 2px 4px; cursor: pointer; font-size: 11px;';
        [0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0, 2.5, 3.0].forEach(r => {
            const opt = document.createElement('option');
            opt.value = r;
            opt.textContent = r + 'x';
            if (r === 1.0) opt.selected = true;
            selSpeed.appendChild(opt);
        });
        selSpeed.onchange = () => window.__aurora_set_speed(parseFloat(selSpeed.value));

        const btnCine = document.createElement('button');
        btnCine.innerHTML = '🎬 Cine';
        btnCine.title = 'Alternar Modo Cine Inmersivo';
        btnCine.style.cssText = 'background: #24283b; color: #bb9af7; border: none; border-radius: 4px; padding: 3px 6px; cursor: pointer; font-weight: bold;';
        btnCine.onclick = () => window.__aurora_toggle_cinema();

        bar.appendChild(btnPip);
        bar.appendChild(selSpeed);
        bar.appendChild(btnCine);

        player.appendChild(bar);
    }

    setInterval(inyectarBotonFlotante, 1000);
})();
