// BrowsJS.tag.all
// Removes every HTML tag from the page (full DOM wipe).

const BrowsJS = BrowsJS || {};
BrowsJS.tag = BrowsJS.tag || {};

/* ============================================================
   BrowsJS.tag.all()
   ------------------------------------------------------------
   Removes ALL HTML tags from the page by clearing <html>.
   Leaves the document object alive, but empties its structure.
   ============================================================ */

BrowsJS.tag.all = function() {
    // Remove everything inside <html>
    const html = document.documentElement;

    // Clear all children (head + body + anything else)
    while (html.firstChild) {
        html.removeChild(html.firstChild);
    }

    // Optionally recreate empty <head> and <body>
    // so the page doesn't break completely
    const newHead = document.createElement("head");
    const newBody = document.createElement("body");

    html.appendChild(newHead);
    html.appendChild(newBody);

    return true; // success indicator
};

export default BrowsJS.tag.all;
