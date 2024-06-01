
import Cords from './cords.js';
import { declares as dec, cords, steps } from './declares.js';

class moves {
    square: string;
    start: cords;
    end: cords;
    end_obj: any;
    width: number;
    move_color: string;
    color_sign: number;
    step: steps;

    constructor(square: any, start: cords, end: cords) {

        this.square = square;
        this.start = start;
        this.end = end;
        this.end_obj = Cords.getcords(end.x, end.y);
        this.width = this.square.width;
        this.move_color = this.square.color;
        this.color_sign = (this.move_color == 'black') ? 1 : -1;
        this.step = {
            x_sign: 0,
            y_sign: 0,
            x_step: Math.abs((this.end_obj.x - this.start.x) / this.width),
            y_step: Math.abs((this.end_obj.y - this.start.y) / this.width),
        };
        if (this.end_obj.x - this.start.x >= 0)
            this.step.x_sign = 1;
        else
            this.step.x_sign = -1;
        if (this.end_obj.y - this.start.y >= 0)
            this.step.y_sign = 1;
        else
            this.step.y_sign = -1;
    }

    remove(): void {
        this.end_obj.piece.remove();
        this.end_obj.piece == null;
        this.end_obj.color == null;
    }

    verify_bishop(): boolean {
        let c = 0;
        for (let i = 1; i < this.step.x_step; i++) {
            if (Cords.getcords(this.start.x + this.step.x_sign * i * this.width, this.start.y + this.step.y_sign * i * this.width)?.piece == null)
                c++;
        }
        if (c == this.step.x_step - 1)
            return true;
        else
            return false;
    }

    verify_rook(): boolean {
        let c = 0;
        let direction = {
            step: (this.step.x_step > this.step.y_step) ? this.step.x_step : this.step.y_step,
            x_sign: (this.step.x_step > this.step.y_step) ? 1 : 0,
            y_sign: (this.step.x_step > this.step.y_step) ? 0 : 1,
        };
        for (let i = 1; i < direction.step; i++) {
            if (Cords.getcords(this.start.x + this.step.x_sign * i * this.width * direction.x_sign, this.start.y + this.step.y_sign * i * this.width * direction.y_sign)?.piece == null)
                c++;
        }
        if (c == direction.step - 1)
            return true;
        else
            return false;
    }

    pawn(): boolean {
        if (((this.start.y == Cords.sq[dec.desk_length + 1].y || this.start.y == Cords.sq[dec.desk_length * (dec.desk_length - 1) - 1].y) && this.start.x == this.end_obj.x && this.start.y + this.width * 2 * this.step.y_sign == this.end_obj.y) || // - first step 2 fields
            (this.start.x == this.end_obj.x && this.start.y + this.width * this.step.y_sign == this.end_obj.y) || // 1 field step
            (this.end_obj.x == this.start.x + this.width * this.step.x_sign && this.end_obj.y == this.start.y + this.width * this.step.y_sign && this.end_obj.piece != null) // - diagonally step for eat 
            && this.step.y_sign == this.color_sign) {
            return true;
        }
    }

    knight(): boolean {
        let vertical_cords = { x: this.start.x + this.width * this.step.x_sign, y: this.start.y + this.width * 2 * this.step.y_sign }; // - check x+1 y+2
        let horizontal_cords = { x: this.start.x + this.width * 2 * this.step.x_sign, y: this.start.y + this.width * this.step.y_sign }; // - check x+2 y+1
        if (Cords.equality(vertical_cords, this.end_obj) || Cords.equality(horizontal_cords, this.end_obj)) {
            return true;
        }
    }

    bishop(): boolean {
        let diagonally_cords = { x: this.start.x + this.width * this.step.x_sign * this.step.x_step, y: this.start.y + this.width * this.step.y_sign * this.step.y_step }; // - сheck diagonally
        if (Cords.equality(diagonally_cords, this.end) && this.step.y_step == this.step.x_step && this.verify_bishop()) {
            return true;
        }
    }

    rook(): boolean {
        let vertical_cords = { x: this.start.x, y: this.start.y + this.width * this.step.y_sign * this.step.y_step }; // - check x+0 y+++
        let horizontal_cords = { x: this.start.x + this.width * this.step.x_sign * this.step.x_step, y: this.start.y }; // - check x+++ y+0
        if ((Cords.equality(vertical_cords, this.end) || Cords.equality(horizontal_cords, this.end)) && this.verify_rook()) {
            return true;
        }
    }

    queen(): boolean {
        let diagonally_cords = { x: this.start.x + this.width * this.step.x_sign * this.step.x_step, y: this.start.y + this.width * this.step.y_sign * this.step.y_step }; // - сheck diagonally
        let vertical_cords = { x: this.start.x, y: this.start.y + this.width * this.step.y_sign * this.step.y_step }; // - check x+0 y+++
        let horizontal_cords = { x: this.start.x + this.width * this.step.x_sign * this.step.x_step, y: this.start.y }; // - check x+++ y+0
        if (((Cords.equality(vertical_cords, this.end) || Cords.equality(horizontal_cords, this.end)) && this.verify_rook()) || (Cords.equality(diagonally_cords, this.end) && this.step.y_step == this.step.x_step && this.verify_bishop())) {
            return true;
        }
    }

    king(): boolean {
        let diagonally_one_cords = { x: this.start.x + this.width * this.step.x_sign, y: this.start.y + this.width * this.step.y_sign }; // - check x+1 +1
        let horizontal_one_cords = { x: this.start.x + this.width * this.step.x_sign, y: this.start.y }; // - check x+1 y+0
        let vertical_one_cords = { x: this.start.x, y: this.start.y + this.width * this.step.y_sign }; // - check x+0 y+1
        if (Cords.equality(diagonally_one_cords, this.end) || Cords.equality(vertical_one_cords, this.end) || Cords.equality(horizontal_one_cords, this.end)) {
            return true;
        }
    }
}

export default moves;

class attack_moves extends moves {
    signs: { x: number, y: number }[];

    constructor(square: string, start: { x: number, y: number }, end: { x: number, y: number }) {
        super(square, start, end);
        this.signs = [
            { x: 1, y: 1 },
            { x: 1, y: -1 },
            { x: -1, y: 1 },
            { x: -1, y: -1 }
        ];
    }

    pawn(): boolean {
        let signs = [1, -1];
        for (let i = 0; i < signs.length; i++) {
            let end = {
                x: this.start.x + this.width * signs[i],
                y: this.start.y
            };
            if (Cords.equality(end, this.end))
                return true;
        }
    }

    knight(): boolean {
        for (let i = 0; i < this.signs.length; i++) {
            let horizontal_end = {
                x: this.start.x + this.width * 2 * this.signs[i].x,
                y: this.start.y + this.width * this.signs[i].y
            };
            let vertical_end = {
                x: this.start.x + this.width * this.signs[i].x,
                y: this.start.y + this.width * 2 * this.signs[i].y
            };
            if (Cords.equality(horizontal_end, this.end_obj) || Cords.equality(vertical_end, this.end_obj))
                return true;
        }
    }

    bishop(): boolean {
        for (let i = 0; i < dec.desk_length; i++) {
            for (let j = 0; j < this.signs.length; j++) {
                let end = {
                    x: this.start.x + this.width * this.signs[j].x * i,
                    y: this.start.y + this.width * this.signs[j].y * i
                };
                if (Cords.equality(end, this.end_obj))
                    return true;
            }
        }
    }

    rook(): boolean {
        for (let i = 0; i < dec.desk_length; i++) {
            for (let j = 0; j < this.signs.length; j++) {
                let vertical_end = {
                    x: this.start.x,
                    y: this.start.y + this.width * i * this.signs[j].y
                };
                let horizontal_end = {
                    x: this.start.x + this.width * i * this.signs[j].x,
                    y: this.start.y
                };
                if (Cords.equality(vertical_end, this.end_obj) || Cords.equality(horizontal_end, this.end_obj))
                    return true;
            }
        }
    }

    queen(): boolean {
        for (let i = 0; i < dec.desk_length; i++) {
            for (let j = 0; j < this.signs.length; j++) {
                let diagonally_end = {
                    x: this.start.x + this.width * this.signs[j].x * i,
                    y: this.start.y + this.width * this.signs[j].y * i
                };
                let vertical_end = {
                    x: this.start.x,
                    y: this.start.y + this.width * i * this.signs[j].y
                };
                let horizontal_end = {
                    x: this.start.x + this.width * i * this.signs[j].x,
                    y: this.start.y
                };
                if (Cords.equality(diagonally_end, this.end_obj) || Cords.equality(vertical_end, this.end_obj) || Cords.equality(horizontal_end, this.end_obj))
                    return true;
            }
        }
    }

    king(): boolean | undefined {
        for (let i = 0; i < this.signs.length; i++) {
            let diagonally_end = {
                x: this.start.x + this.width * this.signs[i].x,
                y: this.start.y + this.width * this.signs[i].y
            };
            let vertical_end = {
                x: this.start.x,
                y: this.start.y + this.width * this.signs[i].y
            };
            let horizontal_end = {
                x: this.start.x + this.width * this.signs[i].x,
                y: this.start.y
            };
            if (Cords.equality(diagonally_end, this.end_obj) || Cords.equality(vertical_end, this.end_obj) || Cords.equality(horizontal_end, this.end_obj))
                return true;
        }
    }
}

export { attack_moves };
