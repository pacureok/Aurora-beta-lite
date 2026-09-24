// reader_mode.js
// Modo Lectura Inmersivo (Immersive Reader) estilo Microsoft Edge para Aurora-Lite

(function() {
    'use strict';
    let readerContainer = document.getElementById('aurora-reader-mode-view');
    if (readerContainer) {
        // Si ya está activo, cerrarlo y restaurar la página original
        readerContainer.remove();
        document.body.style.overflow = '';
        return { ok: true, active: false };
    }

    // 1. Extraer título principal
    const title = document.querySelector('h1')?.innerText || document.title || 'Artículo';

    // 2. Extraer párrafos e imágenes de contenido principal
    const candidates = document.querySelectorAll('article, main, .post-content, .entry-content, .article-body, #content');
    let contentElement = candidates[0];
    if (!contentElement) {
        contentElement = document.body;
    }

    // Recopilar párrafos significativos
    let paragraphs = [];
    contentElement.querySelectorAll('p, h2, h3, h4, blockquote, img').forEach(el => {
        if (el.tagName.toLowerCase() === 'img') {
            if (el.src && el.width > 200) {
                paragraphs.push(`<img src="${el.src}" style="max-width: 100%; border-radius: 8px; margin: 16px 0;" />`);
            }
        } else if (el.innerText.trim().length > 20) {
            if (el.tagName.toLowerCase().startsWith('h')) {
                paragraphs.push(`<${el.tagName.toLowerCase()} style="color: #7aa2f7; margin-top: 24px; font-weight: bold;">${el.innerText.trim()}</${el.tagName.toLowerCase()}>`);
            } else {
                paragraphs.push(`<p style="line-height: 1.8; margin-bottom: 16px; font-size: 18px;">${el.innerText.trim()}</p>`);
            }
        }
    });

    if (paragraphs.length === 0) {
        alert("No se pudo detectar contenido de lectura suficiente en esta página.");
        return { ok: false, error: "Contenido insuficiente" };
    }

    // 3. Crear contenedor de lectura inmersiva estilo Edge
    readerContainer = document.createElement('div');
    readerContainer.id = 'aurora-reader-mode-view';
    readerContainer.style.cssText = `
        position: fixed;
        top: 0; left: 0; width: 100vw; height: 100vh;
        background-color: #1a1b26;
        color: #c0caf5;
        z-index: 999999;
        overflow-y: auto;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        padding: 40px 20px;
        box-sizing: border-box;
    `;

    const inner = document.createElement('div');
    inner.style.cssText = `
        max-width: 780px;
        margin: 0 auto;
        background: #16161e;
        padding: 40px;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.6);
        border: 1px solid #24283b;
    `;

    // Barra superior de herramientas del modo lectura
    const toolbar = document.createElement('div');
    toolbar.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #24283b;
        padding-bottom: 16px;
        margin-bottom: 24px;
    `;
    toolbar.innerHTML = `
        <span style="font-weight: bold; color: #7aa2f7; font-size: 14px;">📖 Modo Lectura Inmersivo — Aurora-Lite</span>
        <button id="aurora-btn-close-reader" style="background: #f7768e; color: #16161e; border: none; border-radius: 6px; padding: 6px 14px; font-weight: bold; cursor: pointer;">✕ Salir</button>
    `;

    const titleH1 = document.createElement('h1');
    titleH1.style.cssText = `
        font-size: 32px;
        color: #ffffff;
        margin-bottom: 24px;
        line-height: 1.3;
    `;
    titleH1.textContent = title;

    const bodyDiv = document.createElement('div');
    bodyDiv.innerHTML = paragraphs.join('');

    inner.appendChild(toolbar);
    inner.appendChild(titleH1);
    inner.appendChild(bodyDiv);
    readerContainer.appendChild(inner);

    document.body.appendChild(readerContainer);
    document.body.style.overflow = 'hidden';

    document.getElementById('aurora-btn-close-reader').onclick = function() {
        readerContainer.remove();
        document.body.style.overflow = '';
    };

    return { ok: true, active: true };
})();
