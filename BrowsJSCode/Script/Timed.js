// BrowsJS.script.timed
// A timed function queue system for BrowsJS.
// Runs functions in order, each receiving the previous output.
// Supports optional timers for delayed execution.

const BrowsJS = BrowsJS || {};
BrowsJS.script = BrowsJS.script || {};


/* ============================================================
   BrowsJS.script.timed(queueName)(configObject)
   ------------------------------------------------------------
   Example:
   BrowsJS.script.timed("ExampleQueue")({
       Queue: [
           { Do: () => 5 },
           { Wait: 1000, Do: (last) => last + 10 },
           { Do: (last) => console.log(last) }
       ]
   });
   ============================================================ */

BrowsJS.script.timed = function(queueName) {
    return function(config) {
        const { Queue = [] } = config;

        let lastOutput = undefined;

        // Internal function to run each step
        function runStep(index) {
            if (index >= Queue.length) return;

            const step = Queue[index];
            const waitTime = step.Wait || 0;

            setTimeout(() => {
                if (typeof step.Do === "function") {
                    lastOutput = step.Do(lastOutput);
                }
                runStep(index + 1);
            }, waitTime);
        }

        // Start the queue
        runStep(0);

        return true;
    };
};

export default BrowsJS.script.timed;
