import {degToRad} from "../maths/trigonometry";

export function dragToLook(element: HTMLElement, config: { onMove: (pitch: number, yaw: number) => void }): void {

    let isDragging = false;
    let previousMousePosition = {x: 0, y: 0};

    let pitch = 0; // Rotation around X-axis (up/down)
    let yaw = 0;   // Rotation around Y-axis (left/right)

    const sensitivity = {pitch: 0.1, yaw: 0.1};

    element.addEventListener("mousedown", (event) => {
        console.log('mousedown');
        isDragging = true;
        previousMousePosition.x = event.clientX;
        previousMousePosition.y = event.clientY;
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
        console.log('mousedown');
    });

    element.addEventListener("mousemove", (event) => {
        if (!isDragging) return;

        // Calculate movement delta
        const deltaX = event.clientX - previousMousePosition.x;
        const deltaY = event.clientY - previousMousePosition.y;

        // Update previous mouse position
        previousMousePosition.x = event.clientX;
        previousMousePosition.y = event.clientY;

        // Map delta to pitch and yaw
        yaw += deltaX * sensitivity.yaw;
        pitch -= deltaY * sensitivity.pitch; // Inverted because moving up decreases pitch

        // Constrain pitch to avoid gimbal lock
        pitch = Math.max(-90, Math.min(90, pitch));

        config.onMove(degToRad(pitch), degToRad(yaw));
        // console.log(`Pitch: ${pitch.toFixed(2)}°, Yaw: ${yaw.toFixed(2)}°`);
    });
}

