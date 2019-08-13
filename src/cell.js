export const CROSS = 'cross';
export const ZERO = 'zero';

export class Cell {
    constructor (x, y, id) {
        this.id = id;
        this.isBusy = false;
        this.type = undefined;
        this.position = {
            x: x,
            y: y
        }
    }
}