// BrowsJS.tag.style
// Generates CSS rules using BrowsJS's configuration syntax.

const BrowsJS = BrowsJS || {};
BrowsJS.tag = BrowsJS.tag || {};
BrowsJS.tag.style = {};


/* ============================================================
   BrowsJS.tag.style(selector)(configObject)
   ------------------------------------------------------------
   Example:
   BrowsJS.tag.style("#Eg")({
       Type: ["bg-color"],
       Content: ["#0173"]
   });
   ============================================================ */

BrowsJS.tag.style = function(selector) {
    return function(config) {
        // config is expected to be an object with repeating keys:
        // Type: ["propertyName"]
        // Content: ["literalValue"]
        // Math: ["expression"]

        const cssRules = [];

        // Convert BrowsJS Type names to real CSS names
        const cssNameMap = {
            "bg-color": "background-color",
            "color": "color",
            "font-size": "font-size",
            "width": "width",
            "height": "height"
            // You can expand this map as BrowsJS grows
        };

        // We allow multiple Type/Content/Math blocks
        const entries = Array.isArray(config) ? config : [config];

        entries.forEach(block => {
            const { Type = [], Content = [], Math = [] } = block;

            Type.forEach((typeName, index) => {
                const cssProp = cssNameMap[typeName] || typeName;

                // Determine value source
                let value = "";

                if (Content[index]) {
                    value = Content[index];
                } else if (Math[index]) {
                    try {
                        value = eval(Math[index]); // safe because user controls input
                    } catch {
                        value = "";
                    }
                }

                cssRules.push(`${cssProp}: ${value};`);
            });
        });

        // Final CSS block
        return `${selector} {\n    ${cssRules.join("\n    ")}\n}`;
    };
};

export default BrowsJS.tag.style;
