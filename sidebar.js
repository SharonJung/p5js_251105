document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.getElementById('menu-btn');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('main');
    let currentSketchInstance = null;

    menuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        document.querySelector('.container').classList.toggle('sidebar-open');
    });

    function loadSketch(sketchFile) {
        if (currentSketchInstance) {
            currentSketchInstance.remove();
        }

        // Remove old script tag if it exists
        const oldScript = document.querySelector(`script[src="${sketchFile}"]`);
        if (oldScript) {
            oldScript.remove();
        }
        
        let script = document.createElement('script');
        script.src = sketchFile;
        script.onload = () => {
            let sketchFunction;
            if (sketchFile === 'sketch.js') {
                sketchFunction = sketch;
            } else if (sketchFile === 'sketch_letter.js') {
                sketchFunction = sketch_letter;
            } else if (sketchFile === 'sketch_grass.js') {
                sketchFunction = sketch_grass;
            }
            
            if (sketchFunction) {
                currentSketchInstance = new p5(sketchFunction, 'canvas-container');
            }
        };
        document.body.appendChild(script);
    }

    sidebar.addEventListener('click', (e) => {
        if (e.target.tagName === 'A' && e.target.dataset.sketch) {
            e.preventDefault();

            // Remove active class from all links
            document.querySelectorAll('#sidebar a').forEach(link => {
                link.classList.remove('active');
            });
            // Add active class to the clicked link
            e.target.classList.add('active');

            const sketchFile = e.target.dataset.sketch;
            loadSketch(sketchFile);
            
            // Close sidebar after selection
            sidebar.classList.remove('open');
            document.querySelector('.container').classList.remove('sidebar-open');
        }
    });

    // Load the default sketch initially
    const defaultSketchLink = document.querySelector('#sidebar a[data-sketch="sketch.js"]');
    if (defaultSketchLink) {
        defaultSketchLink.classList.add('active');
    }
    loadSketch('sketch.js');
});
