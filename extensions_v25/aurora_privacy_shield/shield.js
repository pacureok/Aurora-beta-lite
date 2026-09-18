
// Aurora Privacy Shield - Anti-Fingerprinting Spoofing
(function() {
    try {
        // Ruido sutil en HTMLCanvasElement toDataURL / getImageData
        const originalToDataURL = HTMLCanvasElement.prototype.toDataURL;
        HTMLCanvasElement.prototype.toDataURL = function(...args) {
            const ctx = this.getContext('2d');
            if (ctx && this.width > 0 && this.height > 0) {
                try {
                    const img = ctx.getImageData(0, 0, 1, 1);
                    img.data[0] = (img.data[0] ^ 1);
                    ctx.putImageData(img, 0, 0);
                } catch(e){}
            }
            return originalToDataURL.apply(this, args);
        };
        // Ocultar hardwareConcurrency exagerado
        Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => 4 });
    } catch(e){}
})();
