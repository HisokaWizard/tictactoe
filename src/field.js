import { CROSS, ZERO, Cell } from './cell';
import { clickListener } from './eventsys';

export class Field {
    constructor() {
        this.field = new Map();
        this.fieldSize = 3;
        this.steps = 0;
    }

    initField() {
        for (let x = 0; x < this.fieldSize; x++) {
            for (let y = 0; y < this.fieldSize; y++) {
                const cell = new Cell(x, y, `${x}${y}`);
                this.field.set(`${x}${y}`, cell);
            }
        }
    }

    clickHandler(event) {
        const click = clickListener(event);
        click.subscribe(observer => {
            const currentItemId = observer.srcElement.id;
            this.fillCell(currentItemId);
            this.drawItemInCell(currentItemId);
            const winner = whoIsWinner(this.field);
            if (winner && winner === CROSS) {
                alert('Cross is winner!');
            }
            if (winner && winner === ZERO) {
                alert('Zero is winner!');
            }
        });
    }

    fillCell(id) {
        const cell = this.field.get(id);
        if (cell.isBusy) {
            return;
        }
        if (this.steps % 2 === 0) {
            cell.type = CROSS;
        } else {
            cell.type = ZERO;
        }
        cell.isBusy = true;
        this.steps++;
    }

    reset(event) {
        const click = clickListener(event);
        click.subscribe(observer => {
            this.steps = 0;
            this.field.forEach(item => {
                const cell = this.field.get(item.id);
                cell.isBusy = false;
                cell.type = undefined;
                const cellView = document.getElementById(item.id);
                cellView.innerText = '';
            });
        });
    }

    drawField() {
        const fieldView = document.getElementById('field');
        fieldView.style.marginTop = '50px';
        fieldView.style.textAlign = 'center';

        const title = document.createElement('div');
        title.innerText = 'Tic tac toe';
        title.style.fontSize = '20px';
        title.style.fontWeight = 'bold';
        title.style.color = '#14c694';
        title.style.marginBottom = '20px';
        fieldView.appendChild(title);

        if (this.field.size !== 0) {
            for (let x = 0; x < this.fieldSize; x++) {
                const line = document.createElement('div');
                line.id = `line${x}`;
                line.style.display = 'flex';
                line.style.justifyContent = 'center';
                fieldView.appendChild(line);

                for (let y = 0; y < this.fieldSize; y++) {
                    const borders = specialBorder(`${x}${y}`);
                    const cell = document.createElement('div');
                    cell.id = `${x}${y}`;
                    cell.style.width = '50px';
                    cell.style.height = '50px';
                    cell.style.margin = '-2px';
                    cell.style.padding = '0';
                    cell.style.borderLeft = borders[0];
                    cell.style.borderTop = borders[1];
                    cell.style.borderRight = borders[2];
                    cell.style.borderBottom = borders[3];
                    cell.style.cursor = 'pointer';
                    cell.onclick = this.clickHandler(cell);
                    line.appendChild(cell);
                }
            }
        }

        const reset = document.createElement('button');
        reset.innerText = 'Clear field';
        reset.style.fontSize = '16px';
        reset.style.color = 'darkblue';
        reset.style.marginTop = '20px';
        reset.onclick = this.reset(reset);
        fieldView.appendChild(reset);
    }

    drawItemInCell(id) {
        const cellView = document.getElementById(id);
        const cell = this.field.get(id);
        if (cell.type === CROSS) {
            cellView.innerText = 'X';
        } else {
            cellView.innerText = 'O';
        }
        cellView.style.fontWeight = 'bold';
        cellView.style.fontSize = '20px';
        cellView.style.display = 'flex';
        cellView.style.alignItems = 'center';
        cellView.style.justifyContent = 'center';
    }
}

function specialBorder(id) {
    const borderFill = '4px solid black';
    const borderTransparent = '4px solid transparent';
    return (id === '00' || id === '02' || id === '11' || id === '20' || id === '22') ?
        [borderFill, borderFill, borderFill, borderFill] :
        id === '01' ?
            [borderTransparent, borderFill, borderTransparent, borderTransparent] :
            id === '10' ?
                [borderFill, borderTransparent, borderTransparent, borderTransparent] :
                id === '12' ?
                    [borderTransparent, borderTransparent, borderFill, borderTransparent] :
                    [borderTransparent, borderTransparent, borderTransparent, borderFill];
}

function whoIsWinner(field) {
    const x0y0 = field.get('00');
    const x0y1 = field.get('01');
    const x0y2 = field.get('02');
    const x1y0 = field.get('10');
    const x1y1 = field.get('11');
    const x1y2 = field.get('12');
    const x2y0 = field.get('20');
    const x2y1 = field.get('21');
    const x2y2 = field.get('22');

    const isLineOneCross = (x0y0.isBusy && x0y0.type === CROSS) &&
        (x0y1.isBusy && x0y1.type === CROSS) &&
        (x0y2.isBusy && x0y2.type === CROSS);
    const isLineOneZero = (x0y0.isBusy && x0y0.type === ZERO) &&
        (x0y1.isBusy && x0y1.type === ZERO) &&
        (x0y2.isBusy && x0y2.type === ZERO);
    const isLineTwoCross = (x1y0.isBusy && x1y0.type === CROSS) &&
        (x1y1.isBusy && x1y1.type === CROSS) &&
        (x1y2.isBusy && x1y2.type === CROSS);
    const isLineTwoZero = (x1y0.isBusy && x1y0.type === ZERO) &&
        (x1y1.isBusy && x1y1.type === ZERO) &&
        (x1y2.isBusy && x1y2.type === ZERO);
    const isLineThreeCross = (x2y0.isBusy && x2y0.type === CROSS) &&
        (x2y1.isBusy && x2y1.type === CROSS) &&
        (x2y2.isBusy && x2y2.type === CROSS);
    const isLineThreeZero = (x2y0.isBusy && x2y0.type === ZERO) &&
        (x2y1.isBusy && x2y1.type === ZERO) &&
        (x2y2.isBusy && x2y2.type === ZERO);

    const isColumnOneCross = (x0y0.isBusy && x0y0.type === CROSS) &&
        (x1y0.isBusy && x1y0.type === CROSS) &&
        (x2y0.isBusy && x2y0.type === CROSS);
    const isColumnOneZero = (x0y0.isBusy && x0y0.type === ZERO) &&
        (x1y0.isBusy && x1y0.type === ZERO) &&
        (x2y0.isBusy && x2y0.type === ZERO);
    const isColumnTwoCross = (x0y1.isBusy && x0y1.type === CROSS) &&
        (x1y1.isBusy && x1y1.type === CROSS) &&
        (x2y1.isBusy && x2y1.type === CROSS);
    const isColumnTwoZero = (x0y1.isBusy && x0y1.type === ZERO) &&
        (x1y1.isBusy && x1y1.type === ZERO) &&
        (x2y1.isBusy && x2y1.type === ZERO);
    const isColumnThreeCross = (x0y2.isBusy && x0y2.type === CROSS) &&
        (x1y2.isBusy && x1y2.type === CROSS) &&
        (x2y2.isBusy && x2y2.type === CROSS);
    const isColumnThreeZero = (x0y2.isBusy && x0y2.type === ZERO) &&
        (x1y2.isBusy && x1y2.type === ZERO) &&
        (x2y2.isBusy && x2y2.type === ZERO);

    const isDiagonalOneCross = (x0y0.isBusy && x0y0.type === CROSS) &&
        (x1y1.isBusy && x1y1.type === CROSS) &&
        (x2y2.isBusy && x2y2.type === CROSS);
    const isDiagonalOneZero = (x0y0.isBusy && x0y0.type === ZERO) &&
        (x1y1.isBusy && x1y1.type === ZERO) &&
        (x2y2.isBusy && x2y2.type === ZERO);

    const isDiagonalTwoCross = (x0y2.isBusy && x0y2.type === CROSS) &&
        (x1y1.isBusy && x1y1.type === CROSS) &&
        (x2y0.isBusy && x2y0.type === CROSS);
    const isDiagonalTwoZero = (x0y2.isBusy && x0y2.type === ZERO) &&
        (x1y1.isBusy && x1y1.type === ZERO) &&
        (x2y0.isBusy && x2y0.type === ZERO);

    if (isLineOneCross ||
        isLineTwoCross ||
        isLineThreeCross ||
        isColumnOneCross ||
        isColumnTwoCross ||
        isColumnThreeCross ||
        isDiagonalOneCross ||
        isDiagonalTwoCross) {
        return CROSS;
    } else if (isLineOneZero ||
        isLineTwoZero ||
        isLineThreeZero ||
        isColumnOneZero ||
        isColumnTwoZero ||
        isColumnThreeZero ||
        isDiagonalOneZero ||
        isDiagonalTwoZero) {
        return ZERO;
    } else {
        return undefined;
    }
}