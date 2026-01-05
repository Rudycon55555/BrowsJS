// BrowsJS.stream.dom
// Streams HTML or XML into the DOM in real time.
// Supports replace-mode and append-mode rendering.

const BrowsJS = BrowsJS || {};
BrowsJS.stream = BrowsJS.stream || {};

// Storage for active DOM streams
BrowsJS.stream._domStreams = {};


/* ============================================================
   BrowsJS.stream.dom(streamName)(configObject)
   ------------------------------------------------------------
   Example:
   BrowsJS.stream.dom("LiveHTML")({
       Target: ["#output"],
       Mode: ["replace"],   // or "append"
       Transform: [(markup) => markup.toUpperCase()]
   });

   // Later:
   BrowsJS.stream._domStreams["LiveHTML"].push("<p>Hello</p>");
   ============================================================ */

BrowsJS.stream.dom = function(streamName) {
    return function(config) {
        const { Target = [], Mode = ["replace"], Transform = [] } = config;

        const selector = Target[0];
        const mode = Mode[0] || "replace";
        const transformFn = Transform[0] || ((markup) => markup);

        const element = document.querySelector(selector);
        if (!element) return false;

        /* --------------------------------------------
           Create DOM stream object
        -------------------------------------------- */
        const stream = {
            element,
            mode,
            transform: transformFn,
            last: undefined,

            push(markup) {
                // Save last streamed markup
                this.last = markup;

                // Transform markup (optional)
                const processed = this.transform(markup);

                // Inject into DOM
                if (this.mode === "replace") {
                    this.element.innerHTML = processed;
                } else if (this.mode === "append") {
                    this.element.insertAdjacentHTML("beforeend", processed);
                }
            }
        };

        BrowsJS.stream._domStreams[streamName] = stream;

        return stream;
    };
};

export default BrowsJS.stream.dom;
