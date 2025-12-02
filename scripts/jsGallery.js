function jsGallery(gallery) {

    // ------------------------------------------------------------
    // CONFIGURATION
    // ------------------------------------------------------------
    const styles = getComputedStyle(gallery);
    const rheight = parseFloat(styles.getPropertyValue('--avg-height')) || 200;
    const gap = parseFloat(styles.getPropertyValue('--gap')) || 5;
    const cwidth = gallery.clientWidth - 2;
    const maxW = cwidth * 1.1;   // allow up to ~10% overflow before breaking row

    // These two track the single active row being built.
    let currentRow = [];
    let currentWidth = 0;

    // Helper to finalize a row:
    // Compute scaling, final widths, final height, and apply styles.
    function finalizeRow() {

        // total width of all baseline images in this row
        const rowW = currentWidth;

        // how much to scale images to fill container width
        const scale = cwidth / rowW;
        const finalH = rheight * scale;

        let used = 0;

        currentRow.forEach((obj, index) => {
            const img = obj.element;

            // scaled width for this image
            let w = Math.round(obj.width * scale);

            // last image: adjust to ensure EXACT row width
            if (index === currentRow.length - 1) {
                w += Math.round(cwidth - used - w);
            }

            // apply final dimensions
            img.style.width = w + "px";
            img.style.height = finalH + "px";
            img.style.padding = gap + "px";

            used += w;
        });

        // reset for next row
        currentRow = [];
        currentWidth = 0;
    }


    // ------------------------------------------------------------
    // MAIN LOOP
    // ------------------------------------------------------------
    gallery.querySelectorAll("img").forEach(img => {

        // read original dimensions
        const nw = img.naturalWidth;
        const nh = img.naturalHeight;

        // compute baseline width for target rheight
        const scale = nh / rheight;
        const resizedW = nw / scale;

        // If adding this image exceeds max width AND we already have images,
        // finalize the existing row immediately.
        if (currentWidth + resizedW > maxW && currentRow.length > 0) {
            finalizeRow();
        }

        // Add to current row
        currentRow.push({
            width: resizedW,
            element: img
        });

        currentWidth += resizedW;
    });

    // finalize the last row after loop ends
    if (currentRow.length > 0) {
        finalizeRow();
    }
    gallery.querySelectorAll("img").forEach(img => {
        img.style.visibility = "visible";
    });
}



// ------------------------------------------------------------
// EVENTS
// ------------------------------------------------------------
window.addEventListener("load", () => {
    document.querySelectorAll('.jsGallery').forEach(jsGallery);
});

window.addEventListener("resize", () => {
    document.querySelectorAll('.jsGallery').forEach(jsGallery);
});
