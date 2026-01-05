// BrowsJS.seamless.window
// A seamless wrapper for browser window actions:
// - Resize window
// - Show notifications
// - Alerts
// - Prompts
// - Any browser API that affects the window

const BrowsJS = BrowsJS || {};
BrowsJS.seamless = BrowsJS.seamless || {};


/* ============================================================
   BrowsJS.seamless.window(action)(configObject)
   ------------------------------------------------------------
   Example:
   BrowsJS.seamless.window("notify")({
       Message: ["Hello Rudra!"],
       Icon: ["info"]
   });

   BrowsJS.seamless.window("resize")({
       Width: [800],
       Height: [600]
   });

   BrowsJS.seamless.window("alert")({
       Message: ["Something happened!"]
   });

   BrowsJS.seamless.window("prompt")({
       Message: ["Enter your name"],
       Default: ["Rudra"]
   });
   ============================================================ */

BrowsJS.seamless.window = function(action) {
    return function(config) {
        const {
            Message = [],
            Icon = [],
            Width = [],
            Height = [],
            Default = []
        } = config;

        /* --------------------------------------------
           1. Notifications (non-blocking)
        -------------------------------------------- */
        if (action === "notify") {
            if (!("Notification" in window)) return false;

            const msg = Message[0] || "";
            const icon = Icon[0] || "";

            // Request permission if needed
            if (Notification.permission !== "granted") {
                Notification.requestPermission().then(() => {
                    new Notification(msg, { icon });
                });
            } else {
                new Notification(msg, { icon });
            }

            return true;
        }

        /* --------------------------------------------
           2. Alerts (blocking)
        -------------------------------------------- */
        if (action === "alert") {
            const msg = Message[0] || "";
            alert(msg);
            return true;
        }

        /* --------------------------------------------
           3. Prompts (blocking, returns value)
        -------------------------------------------- */
        if (action === "prompt") {
            const msg = Message[0] || "";
            const def = Default[0] || "";
            return prompt(msg, def);
        }

        /* --------------------------------------------
           4. Resize window
           (Only works in windows opened by JS)
        -------------------------------------------- */
        if (action === "resize") {
            const w = Width[0] || window.innerWidth;
            const h = Height[0] || window.innerHeight;
            window.resizeTo(w, h);
            return true;
        }

        /* --------------------------------------------
           5. Custom window actions (future expansion)
        -------------------------------------------- */
        if (action === "focus") {
            window.focus();
            return true;
        }

        if (action === "scroll") {
            const x = Width[0] || 0;
            const y = Height[0] || 0;
            window.scrollTo(x, y);
            return true;
        }

        return false;
    };
};

export default BrowsJS.seamless.window;
