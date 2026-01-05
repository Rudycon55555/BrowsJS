// BrowsJS.script.check
// A universal event listener system for BrowsJS.
// Listens for any event (keys, clicks, inputs, custom triggers)
// and calls a function when the event occurs.

const BrowsJS = BrowsJS || {};
BrowsJS.script = BrowsJS.script || {};


/* ============================================================
   BrowsJS.script.check(eventType)(configObject)
   ------------------------------------------------------------
   Example:
   BrowsJS.script.check("keydown")({
       When: ["Key = 'Enter'"],
       Do: [() => console.log("Enter pressed!")]
   });
   ============================================================ */

BrowsJS.script.check = function(eventType) {
    return function(config) {
        const { When = [], Do = [] } = config;

        // Attach the listener
        document.addEventListener(eventType, function(event) {

            /* --------------------------------------------
               Parse When rules:
               "Key = 'Enter'"
               "Button = '#submit'"
               "Value = 'Rudra'"
            -------------------------------------------- */
            let conditionsMet = true;

            When.forEach(rule => {
                const [rawKey, rawVal] = rule.split("=").map(s => s.trim());
                const key = rawKey.replace(/'/g, "");
                const value = rawVal.replace(/'/g, "");

                switch (key) {
                    case "Key":
                        if (event.key !== value) conditionsMet = false;
                        break;

                    case "Button":
                        if (!event.target.matches(value)) conditionsMet = false;
                        break;

                    case "Value":
                        if (event.target.value !== value) conditionsMet = false;
                        break;

                    default:
                        conditionsMet = false;
                }
            });

            /* --------------------------------------------
               If all conditions match → run Do functions
            -------------------------------------------- */
            if (conditionsMet) {
                Do.forEach(fn => {
                    if (typeof fn === "function") fn(event);
                });
            }
        });

        return true; // success indicator
    };
};

export default BrowsJS.script.check;
