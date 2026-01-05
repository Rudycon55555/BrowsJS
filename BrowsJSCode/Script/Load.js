// BrowsJS.script.load
// Controls starting and stopping BrowsJS event listeners.
// Works with REGULAR JavaScript conditions to decide when to activate/deactivate.

const BrowsJS = BrowsJS || {};
BrowsJS.script = BrowsJS.script || {};

// Storage for all listeners created by BrowsJS.script.check
BrowsJS.script._listeners = {};


/* ============================================================
   BrowsJS.script.load(listenerName)(configObject)
   ------------------------------------------------------------
   Example:
   BrowsJS.script.load("EnterListener")({
       Start: [() => window.userReady === true],
       Stop:  [() => window.userReady === false]
   });
   ============================================================ */

BrowsJS.script.load = function(listenerName) {
    return function(config) {
        const { Start = [], Stop = [] } = config;

        const listener = BrowsJS.script._listeners[listenerName];
        if (!listener) return false;

        /* --------------------------------------------
           Start conditions
           If ANY Start function returns true → activate
        -------------------------------------------- */
        Start.forEach(fn => {
            if (typeof fn === "function" && fn()) {
                if (!listener.active) {
                    document.addEventListener(
                        listener.eventType,
                        listener.handler
                    );
                    listener.active = true;
                }
            }
        });

        /* --------------------------------------------
           Stop conditions
           If ANY Stop function returns true → deactivate
        -------------------------------------------- */
        Stop.forEach(fn => {
            if (typeof fn === "function" && fn()) {
                if (listener.active) {
                    document.removeEventListener(
                        listener.eventType,
                        listener.handler
                    );
                    listener.active = false;
                }
            }
        });

        return true;
    };
};

export default BrowsJS.script.load;
