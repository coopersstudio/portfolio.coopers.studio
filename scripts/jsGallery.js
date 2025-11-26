// function jsGallery(gallery) {
//     // ----------------------------
//     // CONFIGURATION
//     // ----------------------------
//     // let rheight = 200; // Target row height before scaling
//     let rheight = parseFloat(getComputedStyle(gallery).getPropertyValue('--avg-height')) || 200;  // pulls desired img height value from css 
//     let gap = parseFloat(getComputedStyle(gallery).getPropertyValue('--gap')) || 5;  // Padding around each image, pulls from css
//     let cwidth = gallery.clientWidth - 2; 
//     // Container width minus small adjustment (to avoid rounding overflow)

//     // ----------------------------
//     // DATA STRUCTURES
//     // ----------------------------
//     let rows = [];       // Stores the cumulative width of each row (before scaling)
//     let rowImages = [];  // Stores arrays of images for each row
//     let data = [];       // Array of objects: {width: resized width, element: img DOM node}

//     // ----------------------------
//     // 1. Collect image sizes and calculate baseline width
//     // ----------------------------
//     // Loop through all <img> elements
//     gallery.querySelectorAll("img").forEach(img => {
//         let nw = img.naturalWidth;  // Original image width
//         let nh = img.naturalHeight; // Original image height

//         // Compute scale to make image height match target rheight
//         let scale = nh / rheight;

//         // Compute corresponding width after scaling height to rheight
//         let resizedW = nw / scale;

//         // Store both the width and the actual DOM element for later
//         data.push({
//             width: resizedW,
//             element: img
//         });
//     });
//     console.log("Baseline image data:", data);

//     // ----------------------------
//     // 2. Build rows sequentially
//     // ----------------------------
//     let maxW = cwidth + cwidth / 10; // Allow small overflow (~10%) before breaking row

//     data.forEach(obj => {

//         // If this is the first image, start the first row
//         if (rows.length === 0) {
//             rows.push(obj.width);
//             rowImages.push([obj]);
//             return;
//         }

//         // Sequential row logic: only check the LAST row
//         let last = rows.length - 1;

//         if (rows[last] + obj.width <= maxW) {
//             // Image fits → add to last row
//             rows[last] += obj.width;
//             rowImages[last].push(obj);
//         } else {
//             // Image too wide → start a new row
//             rows.push(obj.width);
//             rowImages.push([obj]);
//         }
//     });

//     console.log("Rows widths:", rows);
//     console.log("Rows images:", rowImages);

//     // ----------------------------
//     // 3. Scale rows to exactly fill the container width and set image heights
//     // ----------------------------
//     rows.forEach((rowW, i) => {
//         const imgs = rowImages[i];    // Images in this row
//         const count = imgs.length;    // Number of images in the row

//         // Scale factor to stretch/shrink the row to exactly match container width
//         const scale = cwidth / rowW;

//         // Compute final row height based on scale
//         const finalH = rheight * scale;

//         let totalWidth = 0; // Track cumulative width of images in this row

//         // Loop through each image in the row
//         imgs.forEach((obj, i) => {
//             const img = obj.element;
//             let finalW = Math.round(obj.width * scale); // Scale image width; Round width to nearest pixel to avoid subpixel drift

//             // Correct the last image so the row exactly equals container width
//             if (i === count - 1) {
//                 finalW += Math.round(cwidth - totalWidth - finalW);
//             }

//             // Apply computed width, height, and padding
//             img.style.width = finalW + "px";
//             img.style.height = finalH + "px";
//             img.style.padding = gap + "px";
//             // Optional: uncomment if you want object-fit behavior
//             // img.style.objectFit = "cover";

//             // Update total width for this row
//             totalWidth += finalW;
//         });
//     });
// };



// window.addEventListener("load", () => { 
//   document.querySelectorAll('.jsGallery').forEach(gallery => jsGallery(gallery) )
// });

// window.addEventListener("resize", () => { 
//   document.querySelectorAll('.jsGallery').forEach(gallery => jsGallery(gallery) )
// });




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
