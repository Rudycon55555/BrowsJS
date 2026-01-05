// BrowsJS.stream.data
// Dynamically streams data to the screen in real time.
// Each new value updates the target element using a render function.

const BrowsJS = BrowsJS || {};
BrowsJS.stream = BrowsJS.stream || {};

// Storage for active streams
BrowsJS.stream._streams = {};


/* ============================================================
   BrowsJS.stream.data(streamName)(configObject)
   ------------------------------------------------------------
   Example:
   BrowsJS.stream.data("LiveCounter")({
       Target: ["#counter"],
       Render: [(value) => `Count: ${value}`]
   });

   // Later:
   BrowsJS.stream._streams["LiveCounter"].push(5);
   BrowsJS.stream._streams["LiveCounter"].push(6);
   ============================================================ */

BrowsJS.stream.data = function(streamName) {
    return function(config) {
        const { Target = [], Render = [] } = config;

        const selector = Target[0];
        const renderFn = Render[0] || ((v) => v);

        const element = document.querySelector(selector);
        if (!element) return false;

        /* --------------------------------------------
           Create stream object
        -------------------------------------------- */
        const stream = {
            element,
            render: renderFn,
            last: undefined,

            push(value) {
                this.last = value;
                const output = this.render(value);
                this.element.innerHTML = output;
            }
        };

        BrowsJS.stream._streams[streamName] = stream;

        return stream;
    };
};

export default BrowsJS.stream.data;
