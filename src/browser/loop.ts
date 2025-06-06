export interface Loop {
    play: () => void;
    pause: () => void;
    checkRunning: () => boolean;
}

export function wait(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function createLoop(cb: (dt: number) => void): Loop {
    let isRunning: boolean = false;
    let previousTime: number;

    function play() {
        previousTime = performance.now();
        isRunning = true;
    
        async function loop() {
            if (!isRunning) {
                return;
            }
            const currentTime = performance.now();
            const dt = (currentTime - previousTime) / 1000;

            await cb(dt);
        
            previousTime = currentTime;

            requestAnimationFrame(loop);
        }
    
        requestAnimationFrame(loop);
    }
    
    function pause() {
        isRunning = false;
    }
    
    function checkRunning() {
        return isRunning;
    }

    return {
        play,
        pause,
        checkRunning,
    }
}