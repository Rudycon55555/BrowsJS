// BrowsJS.integrate.frontend
// Seamless page switching for BrowsJS.
// Loads external HTML pages into the current document
// without reloading the browser.

const BrowsJS = BrowsJS || {};
BrowsJS.integrate = BrowsJS.integrate || {};


/* ============================================================
   BrowsJS.integrate.frontend(pageURL)(configObject)
   ------------------------------------------------------------
   Example:
   BrowsJS.integrate.frontend("workspace.html")({
       Mode: ["replace"],   // replace entire page
       Target: ["#app"]     // or inject into a specific element
   });
   ============================================================ */

BrowsJS.integrate.frontend = function(pageURL) {
    return async function(config) {
        const { Mode = ["replace"], Target = [] } = config;

        try {
            // Fetch the new page
            const response = await fetch(pageURL);
            const html = await response.text();

            /* --------------------------------------------
               Mode: "replace"
               Completely replaces <body> with new content
            -------------------------------------------- */
            if (Mode[0] === "replace") {
                document.body.innerHTML = html;
                return true;
            }

            /* --------------------------------------------
               Mode: "inject"
               Injects into a specific element
            -------------------------------------------- */
            if (Mode[0] === "inject") {
                const selector = Target[0];
                const element = document.querySelector(selector);

                if (element) {
                    element.innerHTML = html;
                    return true;
                }

                return false;
            }

            /* --------------------------------------------
               Mode: "append"
               Appends new content to a target element
            -------------------------------------------- */
            if (Mode[0] === "append") {
                const selector = Target[0];
                const element = document.querySelector(selector);

                if (element) {
                    element.insertAdjacentHTML("beforeend", html);
                    return true;
                }

                return false;
            }

            return false;
        } catch (err) {
            return { ok: false, error: err.toString() };
        }
    };
};

export default BrowsJS.integrate.frontend;
