// BrowsJS.state.edit
// Allows direct editing of a BrowsJS state object's values.

const BrowsJS = BrowsJS || {};
BrowsJS.state = BrowsJS.state || {};


/* ============================================================
   BrowsJS.state.edit(stateName)(configObject)
   ------------------------------------------------------------
   Example:
   BrowsJS.state.edit("example")({
       Value: [55554]
   });
   ============================================================ */

BrowsJS.state.edit = function(stateName) {
    return function(config) {
        const state = BrowsJS.state[stateName];
        if (!state || !state.data) return null;

        const { Value = [] } = config;

        // Apply each value in order to the state's keys
        const keys = Object.keys(state.data);

        Value.forEach((val, index) => {
            const key = keys[index];
            if (key !== undefined) {
                state.data[key] = val;
            }
        });

        return state.data;
    };
};

export default BrowsJS.state.edit;
