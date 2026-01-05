// BrowsJS.integrate.backend
// A declarative backend connector for BrowsJS.
// Uses a DSL to define headers, method type, and payload.

const BrowsJS = BrowsJS || {};
BrowsJS.integrate = BrowsJS.integrate || {};


/* ============================================================
   BrowsJS.integrate.backend(url)(configObject)
   ------------------------------------------------------------
   Example:
   BrowsJS.integrate.backend("https://example.com/backend/store?data")({
       Headers: ["Host = 8080"],
       Type: ["POST"],
       Payload: ["Examples are great for helping people!"]
   });
   ============================================================ */

BrowsJS.integrate.backend = function(url) {
    return async function(config) {
        const { Headers = [], Type = [], Payload = [] } = config;

        /* --------------------------------------------
           Parse Headers: ["Host = 8080"]
           → { Host: "8080" }
        -------------------------------------------- */
        const headerObj = {};
        Headers.forEach(entry => {
            const [rawKey, rawVal] = entry.split("=").map(s => s.trim());
            const key = rawKey.replace(/'/g, "");
            const value = rawVal.replace(/'/g, "");
            headerObj[key] = value;
        });

        /* --------------------------------------------
           Parse Type: ["POST"]
           Default: GET
        -------------------------------------------- */
        const method = Type[0] || "GET";

        /* --------------------------------------------
           Parse Payload:
           Payload: ["Hello", "World"]
           → "Hello\nWorld"
        -------------------------------------------- */
        const body =
            method !== "GET"
                ? Payload.join("\n")
                : undefined;

        /* --------------------------------------------
           Perform the request
        -------------------------------------------- */
        try {
            const response = await fetch(url, {
                method,
                headers: headerObj,
                body
            });

            const text = await response.text();

            return {
                ok: response.ok,
                status: response.status,
                headers: response.headers,
                body: text
            };
        } catch (err) {
            return {
                ok: false,
                error: err.toString()
            };
        }
    };
};

export default BrowsJS.integrate.backend;
