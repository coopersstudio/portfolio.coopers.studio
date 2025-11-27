// Load modules into page
document.addEventListener("DOMContentLoaded", () => {
  const includeElements = document.querySelectorAll("[data-include]");

    includeElements.forEach(async el => {
        const file = el.getAttribute("data-include");
        const resp = await fetch(file);
        const html = await resp.text();
        el.outerHTML = html; // Replace the placeholder
    });
});


function resizeImagesInRows() {
    const containers = document.querySelectorAll('.desnGrid');

    containers.forEach(container => {
        const testers = Array.from(container.children);
        if (testers.length === 0) return;

        const gap = parseInt(getComputedStyle(container).gap) || 0;

        // Get natural aspect ratios of each image
        const ratios = testers.map(t => {
            const img = t.querySelector('img');
            return img.naturalWidth / img.naturalHeight;
        });

        // Total width minus gaps
        const totalGap = gap * (testers.length - 1);
        const containerWidth = container.clientWidth - totalGap;

        // Sum of ratios
        const ratioSum = ratios.reduce((a, b) => a + b, 0);

        // Calculate height to fit the row
        const height = containerWidth / ratioSum;

        // Apply height and proportional width
        testers.forEach((t, i) => {
            const img = t.querySelector('img');
            img.style.height = `${height}px`;
            img.style.width = `${height * ratios[i]}px`;
        });
    });
}

// Run on page load
window.addEventListener('load', resizeImagesInRows);

// Run on window resize for responsiveness
window.addEventListener('resize', resizeImagesInRows);


const sidebar = document.getElementById("sidebar");

function openMenu() {
  document.getElementById("sidebar").style.left = '0px';
};


if (window.innerWidth < 901){
    document.addEventListener("click", (e) =>{
      if (getComputedStyle(sidebar).left === "0px" && !sidebar.contains(e.target)){  
        sidebar.style.left = '-240px';
      };
  });
};




window.addEventListener("load", (e) => {
if (window.innerWidth < 901) {
document.querySelectorAll(".sublink").forEach(l => {
l.style.display = "none";
});
}
});

// add a resize option later...