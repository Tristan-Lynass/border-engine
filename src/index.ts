import {Vector3D, x, y, z} from "./maths/vectors";
import {Triangle} from "./maths/triangles";
import {DomEngine} from "./engine/engine";

// (1,1,2.1),(1,.5,2),(1,1,.5)
const triangles: Triangle<Vector3D>[] = [
    [
        [1, 1, 20],
        [-10, 5.5, 21],
        [-15, -6, 32.5],
    ]
];

const engine = new DomEngine(document.body);
engine.triangles = triangles;
engine.render();

const [a, b, c] = triangles[0];


document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', handleButtonClick);
});

function handleButtonClick(event: Event) {
    const button = event.target as HTMLButtonElement;
    const id = button.id;

    // Perform an action based on the button ID
    const loc = engine.camera.location;
    switch (id) {
        case 'cameraXDown':
            engine.camera.location = {
                ...engine.camera.location,
                position: [x(loc.position) - 1, y(loc.position), z(loc.position)]
            }
            break;
        case 'cameraXUp':
            engine.camera.location = {
                ...engine.camera.location,
                position: [x(loc.position) + 1, y(loc.position), z(loc.position)]
            }
            break;
        case 'cameraYDown':
            engine.camera.location = {
                ...engine.camera.location,
                position: [x(loc.position), y(loc.position) - 1, z(loc.position)]
            }
            break;
        case 'cameraYUp':
            engine.camera.location = {
                ...engine.camera.location,
                position: [x(loc.position), y(loc.position) + 1, z(loc.position)]
            }
            break;
        case 'cameraZDown':
            engine.camera.location = {
                ...engine.camera.location,
                position: [x(loc.position), y(loc.position), z(loc.position) - 1]
            }
            break;
        case 'cameraZUp':
            engine.camera.location = {
                ...engine.camera.location,
                position: [x(loc.position), y(loc.position), z(loc.position) + 1]
            }
            break;
        case 'fovDown':
            engine.camera.location = {
                ...engine.camera.location,
                fov: loc.fov - 1
            }
            break;
        case 'fovUp':
            engine.camera.location = {
                ...engine.camera.location,
                fov: loc.fov + 1
            }
            break;
        case 'distanceDown':
            engine.camera.location = {
                ...engine.camera.location,
                viewportDepth: loc.viewportDepth - 1
            }
            break;
        case 'distanceUp':
            engine.camera.location = {
                ...engine.camera.location,
                viewportDepth: loc.viewportDepth + 1
            }
            break;
        default:
            console.log("Unknown button clicked");
    }
    engine.render();
}