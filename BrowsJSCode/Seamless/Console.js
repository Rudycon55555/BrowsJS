// BrowsJS.seamless.console
// A custom BrowsJS console that can:
// - Log messages
// - Remove logs
// - Edit logs
// - Execute functions in sequence
// - Optionally run in Sync Mode (log + execute simultaneously)
// - Pass each function's output to the next

const BrowsJS = BrowsJS || {};
BrowsJS.seamless = BrowsJS.seamless || {};


// Storage for all consoles
BrowsJS.seamless._consoles = {};


/* ============================================================
   BrowsJS.seamless.console(consoleName)(configObject)
   ------------------------------------------------------------
   Example:
   BrowsJS.seamless.console("Main")({
       Mode: ["sync"],   // or "normal"
       Run: [
           () => 5,
           (last) => last + 10,
           (last) => console.log("Final:", last)
       ],
       Log: ["Console started"]
   });
   ============================================================ */

BrowsJS.seamless.console = function(consoleName) {
    return function(config) {
        const { Mode = ["normal"], Run = [], Log = [] } = config;

        /* --------------------------------------------
           Create console UI if not already created
        -------------------------------------------- */
        if (!BrowsJS.seamless._consoles[consoleName]) {
            const box = document.createElement("div");
            box.style.position = "fixed";
            box.style.bottom = "0";
            box.style.left = "0";
            box.style.width = "100vw";
            box.style.maxHeight = "40vh";
            box.style.overflowY = "auto";
            box.style.background = "rgba(0,0,0,0.85)";
            box.style.color = "lime";
            box.style.fontFamily = "monospace";
            box.style.padding = "10px";
            box.style.zIndex = "999999";

            document.body.appendChild(box);

            BrowsJS.seamless._consoles[consoleName] = {
                element: box,
                logs: []
            };
        }

        const consoleObj = BrowsJS.seamless._consoles[consoleName];
        const box = consoleObj.element;


        /* --------------------------------------------
           Helper: Add log entry
        -------------------------------------------- */
        function addLog(text) {
            consoleObj.logs.push(text);
            const line = document.createElement("div");
            line.textContent = text;
            box.appendChild(line);
            box.scrollTop = box.scrollHeight;
        }

        /* --------------------------------------------
           Helper: Clear logs
        -------------------------------------------- */
        function clearLogs() {
            consoleObj.logs = [];
            box.innerHTML = "";
        }

        /* --------------------------------------------
           Process Log entries
        -------------------------------------------- */
        Log.forEach(msg => addLog(msg));


        /* --------------------------------------------
           Execute functions in sequence
           Each receives the previous output
        -------------------------------------------- */
        let lastOutput = undefined;

        Run.forEach(fn => {
            if (typeof fn === "function") {
                try {
                    const result = fn(lastOutput);

                    if (Mode[0] === "sync") {
                        addLog(`→ ${result}`);
                    }

                    lastOutput = result;
                } catch (err) {
                    addLog(`ERROR: ${err}`);
                }
            }
        });

        return {
            log: addLog,
            clear: clearLogs,
            last: lastOutput
        };
    };
};

export default BrowsJS.seamless.console
