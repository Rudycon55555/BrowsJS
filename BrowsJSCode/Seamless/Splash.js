// BrowsJS.seamless.splash
// Displays a fullscreen GIF splash screen with optional fade timing.

const BrowsJS = BrowsJS || {};
BrowsJS.seamless = BrowsJS.seamless || {};


/* ============================================================
   BrowsJS.seamless.splash(gifURL)(configObject)
   ------------------------------------------------------------
   Example:
   BrowsJS.seamless.splash("loading.gif")({
       Duration: [2000],   // how long to show it
       Fade: [300]         // fade-out time
   });
   ============================================================ */

BrowsJS.seamless.splash = function(gifURL) {
    return function(config) {
        const { Duration = [1500], Fade = [300] } = config;

        // Create overlay
        const overlay = document.createElement("div");
        overlay.style.position = "fixed";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.width = "100vw";
        overlay.style.height = "100vh";
        overlay.style.background = `url('${gifURL}') center center / contain no-repeat`;
        overlay.style.backgroundColor = "black";
        overlay.style.zIndex = "999999";
        overlay.style.opacity = "1";
        overlay.style.transition = `opacity ${Fade[0]}ms ease`;
        overlay.style.pointerEvents = "none";

        document.body.appendChild(overlay);

        // Remove after duration
        setTimeout(() => {
            overlay.style.opacity = "0";
            setTimeout(() => {
                overlay.remove();
            }, Fade[0]);
        }, Duration[0]);

        return true;
    };
};

export default BrowsJS.seamless.splash;
