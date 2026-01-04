// BrowsJS.state.create
// Creates a reactive BrowsJS state object with:
// - Contents: key definitions
// - State: initial values and update rules

const BrowsJS = BrowsJS || {};
BrowsJS.state = BrowsJS.state || {};


/* ============================================================
   BrowsJS.state.create(name)(configObject)
   ------------------------------------------------------------
   Example:
   BrowsJS.state.create("example")({
       Contents: ["'Rudra' = ''", "'Goodness' = ''"],
       State: ["Starting = 1", "Updating = +{{amount-from-request}}"]
   });
   ============================================================ */

BrowsJS.state.create = function(stateName) {
    return function(config) {
        const { Contents = [], State = [] } = config;

        const stateObj = {};
        const updateRules = {};

        /* --------------------------------------------
           Parse Contents: ["'Rudra' = ''"]
           → stateObj["Rudra"] = ""
        -------------------------------------------- */
        Contents.forEach(entry => {
            const [rawKey, rawVal] = entry.split("=").map(s => s.trim());
            const key = rawKey.replace(/'/g, "");
            const value = rawVal.replace(/'/g, "");
            stateObj[key] = value;
        });

        /* --------------------------------------------
           Parse State rules:
           "Starting = 1"
           "Updating = +{{amount-from-request}}"
        -------------------------------------------- */
        State.forEach(rule => {
            const [rawKey, rawExpr] = rule.split("=").map(s => s.trim());
            const key = rawKey.replace(/'/g, "");
            updateRules[key] = rawExpr;
        });

        /* --------------------------------------------
           Apply update rule
           BrowsJS.state[stateName].apply("Updating", { amount-from-request: 5 })
        -------------------------------------------- */
        function apply(ruleName, requestObj = {}) {
            const expr = updateRules[ruleName];
            if (!expr) return null;

            // Replace {{var}} with requestObj[var]
            let processed = expr.replace(/\{\{(.*?)\}\}/g, (_, name) => {
                name = name.trim();
                return requestObj[name] ?? 0;
            });

            // Evaluate math expression
            try {
                const result = eval(processed);
                return result;
            } catch {
                return null;
            }
        }

        // Store state globally
        BrowsJS.state[stateName] = {
            data: stateObj,
            rules: updateRules,
            apply
        };

        return BrowsJS.state[stateName];
    };
};

export default BrowsJS.state.create;
