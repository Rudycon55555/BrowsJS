// BrowsJS.tag.query
// Converts the current DOM into BrowsJS Tag Objects
// and allows DSL-based querying.

const BrowsJS = BrowsJS || {};
BrowsJS.tag = BrowsJS.tag || {};
BrowsJS.tag.query = {};


/* ============================================================
   BrowsJS.tag.query()
   ------------------------------------------------------------
   Returns an object with a .run(config) method.
   The config uses your DSL:
       find: ["1st 'h1'"]
       as: ["1stH1"; global]
   ============================================================ */

BrowsJS.tag.query = function() {
    // Convert DOM → BrowsJS Tag Objects
    function domToTagObject(node) {
        if (node.nodeType !== 1) return null; // only elements

        const obj = {
            tag: node.tagName.toLowerCase(),
            attributes: {},
            children: []
        };

        // attributes
        for (let attr of node.attributes) {
            obj.attributes[attr.name] = attr.value;
        }

        // children
        for (let child of node.childNodes) {
            if (child.nodeType === 3) {
                obj.children.push(child.textContent.trim());
            } else {
                const converted = domToTagObject(child);
                if (converted) obj.children.push(converted);
            }
        }

        return obj;
    }

    // Build the full BrowsJS Tag Object tree
    const root = domToTagObject(document.documentElement);


    /* ========================================================
       Query DSL interpreter
       --------------------------------------------------------
       Example:
       find: ["1st 'h1'"]
       as: ["1stH1"; global]
       ======================================================== */

    function run(config) {
        const { find = [], as = [] } = config;

        // Parse find rule: "1st 'h1'"
        const findRule = find[0];
        const match = findRule.match(/(\d+)(?:st|nd|rd|th)\s+'(.+)'/);

        if (!match) return null;

        const index = parseInt(match[1], 10) - 1;
        const tagName = match[2].toLowerCase();

        // Search DOM for matching tags
        const found = Array.from(document.querySelectorAll(tagName));

        const chosen = found[index] || null;

        // Convert chosen element to BrowsJS Tag Object
        const converted = chosen ? domToTagObject(chosen) : null;

        // Handle "as" rule
        const asName = as[0];
        const scope = as[1] || "local";

        if (scope === "global") {
            globalThis[asName] = converted;
        }

        return converted;
    }

    return { root, run };
};

export default BrowsJS.tag.query;
