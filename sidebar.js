document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.getElementById('menu-btn');
    const sidebar = document.getElementById('sidebar');
    const closeBtn = document.querySelector('.close-btn');
    const overlay = document.querySelector('.sidebar-overlay');
    let currentSketchInstance = null;

    // 切换侧边栏
    menuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('active');
    });

    // 关闭侧边栏
    closeBtn.addEventListener('click', () => {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
    });

    // 点击遮罩层关闭侧边栏
    overlay.addEventListener('click', () => {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
    });

    function loadSketch(sketchFile) {
        if (currentSketchInstance) {
            currentSketchInstance.remove();
        }

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
    }

    sidebar.addEventListener('click', (e) => {
        if (e.target.tagName === 'A' && e.target.dataset.sketch) {
            e.preventDefault();

            // 移除所有激活状态
            document.querySelectorAll('#sidebar a').forEach(link => {
                link.classList.remove('active');
            });
            // 添加激活状态到点击的链接
            e.target.classList.add('active');

            const sketchFile = e.target.dataset.sketch;
            loadSketch(sketchFile);
            
            // 关闭侧边栏
            sidebar.classList.remove('open');
            overlay.classList.remove('active');
        }
    });

    // 加载默认 sketch
    const defaultSketchLink = document.querySelector('#sidebar a[data-sketch="sketch.js"]');
    if (defaultSketchLink) {
        defaultSketchLink.classList.add('active');
    }
    loadSketch('sketch.js');
});
