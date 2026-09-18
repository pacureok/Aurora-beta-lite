
// Aurora AdBlock Turbo - Limpieza agresiva de placeholders y banners
(function() {
    function purgeBanners() {
        const sel = '.adsbygoogle, [id*="google_ads"], [class*="ad-container"], [class*="sponsored-post"], div[id*="ad_banner"]';
        document.querySelectorAll(sel).forEach(el => {
            el.style.setProperty('display', 'none', 'important');
        });
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', purgeBanners);
    } else {
        purgeBanners();
    }
    setInterval(purgeBanners, 2000);
})();
