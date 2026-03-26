// Load loader HTML template
fetch('src/components/loading-screen.html')
    .then(response => response.text())
    .then(html => {
        const container = document.getElementById('loading-screen-container');
        container.innerHTML = html;
        initializeLoader();
    });

function initializeLoader() {
    const PROGRESS_KEYFRAMES = [
        [0, 0],
        [1300, 15],
        [2100, 35],
        [2700, 65],
        [3300, 88],
        [4100, 99],
    ];

    let isPageLoaded = false;
    window.addEventListener('load', () => {
        isPageLoaded = true;
    });

    function lerp(a, b, t) {
        return a + (b - a) * t;
    }

    const loader = document.getElementById('brand-loader');
    const fill = document.getElementById('loader-fill');
    const percentText = document.getElementById('loader-percent');
    let startTs = null;

    // Lock scroll on both html and body
    document.documentElement.classList.add('ak-no-scroll');
    document.body.classList.add('ak-no-scroll');

    function animate(ts) {
        if (!startTs) startTs = ts;
        const elapsed = ts - startTs;

        let seg = PROGRESS_KEYFRAMES.length - 2;
        for (let i = 0; i < PROGRESS_KEYFRAMES.length - 1; i++) {
            if (elapsed < PROGRESS_KEYFRAMES[i + 1][0]) {
                seg = i;
                break;
            }
        }

        const [fromTime, fromVal] = PROGRESS_KEYFRAMES[seg];
        const [toTime, toVal] = PROGRESS_KEYFRAMES[seg + 1];
        const t = Math.max(0, Math.min(1, (elapsed - fromTime) / (toTime - fromTime)));
        let percent = Math.round(lerp(fromVal, toVal, t));

        if (isPageLoaded && elapsed > 1000) {
            percent = 100;
            fill.style.width = "100%";
            percentText.innerText = "100%";

            setTimeout(() => {
                loader.classList.add('ak-exit');
                // Unlock scroll
                document.documentElement.classList.remove('ak-no-scroll');
                document.body.classList.remove('ak-no-scroll');
                setTimeout(() => {
                    loader.remove();
                }, 800);
            }, 400);
            return;
        }

        fill.style.width = percent + "%";
        percentText.innerText = percent + "%";

        if (elapsed < PROGRESS_KEYFRAMES[PROGRESS_KEYFRAMES.length - 1][0] || !isPageLoaded) {
            requestAnimationFrame(animate);
        } else {
            fill.style.width = "100%";
            percentText.innerText = "100%";
            setTimeout(() => {
                loader.classList.add('ak-exit');
                // Unlock scroll
                document.documentElement.classList.remove('ak-no-scroll');
                document.body.classList.remove('ak-no-scroll');
                setTimeout(() => {
                    loader.remove();
                }, 800);
            }, 400);
        }
    }
    requestAnimationFrame(animate);
}
