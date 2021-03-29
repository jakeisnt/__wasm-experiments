import { Universe, Cell } from "wasm-game-of-life";
import { memory } from "wasm-game-of-life/wasm_game_of_life_bg";

const CELL_SIZE = 5; // px
const GRID_COLOR = "#CCCCCC";
const DEAD_COLOR = "#FFFFFF";
const ALIVE_COLOR = "#000000";

const universe = Universe.new();
const width = universe.width();
const height = universe.height();

// Select the whole canvas! Add a border for all of the cells.
const canvas = document.getElementById("game-of-life-canvas");
canvas.height = (CELL_SIZE + 1) * height + 1;
canvas.width = (CELL_SIZE + 1) * width + 1;

const ctx = canvas.getContext('2d');

const drawGrid = () => {
    ctx.beginPath();
    ctx.strokeStyle = GRID_COLOR;

    for(let i = 0; i <= width; i++) {
        const upperLeft = i * (CELL_SIZE + 1) + 1;
        const upperRight = (CELL_SIZE + 1) * height + 1;
        
        ctx.moveTo(upperLeft, 0);
        ctx.lineTo(upperLeft, upperRight);
    }

    for (let j = 0; j <= height; j++) {
        const heightI = j * (CELL_SIZE + 1) + 1;
        const widthI = (CELL_SIZE + 1) * width + 1;
        ctx.moveTo(0, heightI);
        ctx.lineTo(widthI, heightI);
    }

    ctx.stroke();
}

const renderLoop = () => {
    universe.tick();

    drawGrid();
    drawCells();

    requestAnimationFrame(renderLoop);
};

// the memory import: allows us to access wasm's raw memory
// we can directly snag a pointer to the cells and construct an array with them,
// then use them to render to the screen!
const getIndex = (row, col) => {
    return row * width + col;
}

const drawCells = () => {
    const cellsPtr = universe.cells();
    const cells = new Uint8Array(memory.buffer, cellsPtr, width * height);

    ctx.beginPath();

    for(let row = 0; row < height; row++) {
        for(let col = 0; col < width; col++) {
            const idx = getIndex(row, col);

            ctx.fillStyle = cells[idx] === Cell.Dead ? DEAD_COLOR : ALIVE_COLOR;

            ctx.fillRect(
                col * (CELL_SIZE + 1) + 1,
                row * (CELL_SIZE + 1) + 1,
                CELL_SIZE,
                CELL_SIZE
            );
        }
    }

    ctx.stroke();
}

drawGrid();
drawCells();
requestAnimationFrame(renderLoop);
