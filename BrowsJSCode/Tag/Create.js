// BrowsJS.tag.create
// This module defines the two creation systems:
// 1. BrowsJS.tag.create.conf
// 2. BrowsJS.tag.create.this

const BrowsJS = {
    tag: {
        create: {}
    }
};

/* ============================================================
   1. BrowsJS.tag.create.conf(tagName)(configObject)
   ------------------------------------------------------------
   Example:
   BrowsJS.tag.create.conf("h1")({
       Identifiers: ["'id' = 'Example'", "'class' = 'Eg'"],
       Contents: ["Welcome!", BrowsJS.tag.create.conf("span")({ ... })]
   });
   ============================================================ */

BrowsJS.tag.create.conf = function(tagName) {
    return function(config) {
        const { Identifiers = [], Contents = [] } = config;

        // Parse identifiers like "'id' = 'Example'"
        const attrs = Identifiers.map(str => {
            const [key, value] = str.split("=").map(s => s.trim().replace(/'/g, ""));
            return `${key}="${value}"`;
        }).join(" ");

        // Process contents (strings OR nested conf calls)
        const innerHTML = Contents.map(item => {
            if (typeof item === "string") return item;
            if (typeof item === "function") return item(); // nested tag
            return "";
        }).join("");

        return `<${tagName}${attrs ? " " + attrs : ""}>${innerHTML}</${tagName}>`;
    };
};


/* ============================================================
   2. BrowsJS.tag.create.this(templateFunction)
   ------------------------------------------------------------
   Example:
   BrowsJS.tag.create.this(() => {
       return `
           <head>
               <title>{{user}}'s Workspace</title>
           </head>
       `;
   });
   ============================================================ */

BrowsJS.tag.create.this = function(templateFn) {
    const raw = templateFn().toString();

    // Extract variables from the current JS scope
    // (Simple scanning — BrowsJS only scans this file)
    const variableNames = Object.keys(globalThis);

    let processed = raw;

    // Replace {{variable}} with its value
    processed = processed.replace(/\{\{(.*?)\}\}/g, (_, name) => {
        name = name.trim();
        if (variableNames.includes(name)) {
            return globalThis[name];
        }
        return ""; // undefined variable → empty
    });

    return processed;
};

export default BrowsJS.tag.create;
