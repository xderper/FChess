// imports
import Cords from './cords.js'
import { cords, steps, declares as dec, cords_sign } from './declares.js';


export default class moves {

    public end_obj: any; // - object which was moved to

    private step: steps; // - step of moving object

    private color_sign: number; // - step in dependence of color

    protected readonly width: number;
    protected readonly move_color: string

    protected result: boolean;

    constructor(
        protected readonly square,
        protected readonly start: cords, // - start cords of moving object
        public end: cords) // - end cords of moving object)
    {
        this.end_obj = Cords.getcords(end.x, end.y);
        this.width = this.square.width;
        this.move_color = this.square.color;
        this.color_sign = (this.move_color == 'black') ? 1 : -1;

        this.step = {
            x_sign: 0,
            y_sign: 0,
            x_step: Math.abs((this.end_obj.x - this.start.x) / this.width),
            y_step: Math.abs((this.end_obj.y - this.start.y) / this.width),
        }

        if (this.end_obj.x - this.start.x >= 0) this.step.x_sign = 1;
        else this.step.x_sign = -1;

        if (this.end_obj.y - this.start.y >= 0) this.step.y_sign = 1;
        else this.step.y_sign = -1;
    }

    protected remove(): void {
        this.end_obj.piece.remove();
        this.end_obj.piece == null;
        this.end_obj.color == null;
    }

    private verify_bishop(): boolean | undefined {
        let c: number = 0
        for (let i = 1; i < this.step.x_step; i++) {
            if (Cords.getcords(this.start.x + this.step.x_sign * i * this.width, this.start.y + this.step.y_sign * i * this.width)?.piece == null) c++;
        }
        if (c == this.step.x_step - 1) return true;
        else return false;
    }

    private verify_rook(): boolean | undefined {
        let c: number = 0;
        let direction: any = {
            step: (this.step.x_step > this.step.y_step) ? this.step.x_step : this.step.y_step,
            x_sign: (this.step.x_step > this.step.y_step) ? 1 : 0,
            y_sign: (this.step.x_step > this.step.y_step) ? 0 : 1,
        }
        for (let i = 1; i < direction.step; i++) {
            if (Cords.getcords(this.start.x + this.step.x_sign * i * this.width * direction.x_sign, this.start.y + this.step.y_sign * i * this.width * direction.y_sign)?.piece == null) c++;
        }

        if (c == direction.step - 1) return true;
        else return false;
    }

    protected pawn(): boolean | undefined {
        if (
            ((this.start.y == Cords.sq[dec.desk_length + 1].y || this.start.y == Cords.sq[dec.desk_length * (dec.desk_length - 1) - 1].y) && this.start.x == this.end_obj.x && this.start.y + this.width * 2 * this.step.y_sign == this.end_obj.y) || // - first step 2 fields
            (this.start.x == this.end_obj.x && this.start.y + this.width * this.step.y_sign == this.end_obj.y) || // 1 field step
            (this.end_obj.x == this.start.x + this.width * this.step.x_sign && this.end_obj.y == this.start.y + this.width * this.step.y_sign && this.end_obj.piece != null) // - diagonally step for eat 
            && this.step.y_sign == this.color_sign
        ) {
            return true;
        }
    }
    protected knight(): boolean | undefined {
        const vertical_cords = { x: this.start.x + this.width * this.step.x_sign, y: this.start.y + this.width * 2 * this.step.y_sign } // - check x+1 y+2
        const horizontal_cords = { x: this.start.x + this.width * 2 * this.step.x_sign, y: this.start.y + this.width * this.step.y_sign } // - check x+2 y+1
        if (Cords.equality(vertical_cords, this.end_obj) || Cords.equality(horizontal_cords, this.end_obj)) {
            return true;
        }
    }

    protected bishop(): boolean | undefined {
        const diagonally_cords: cords = { x: this.start.x + this.width * this.step.x_sign * this.step.x_step, y: this.start.y + this.width * this.step.y_sign * this.step.y_step } // - сheck diagonally
        if (Cords.equality(diagonally_cords, this.end) && this.step.y_step == this.step.x_step && this.verify_bishop()) {
            return true;
        }
    }

    protected rook(): boolean | undefined {
        const vertical_cords: cords = { x: this.start.x, y: this.start.y + this.width * this.step.y_sign * this.step.y_step } // - check x+0 y+++
        const horizontal_cords: cords = { x: this.start.x + this.width * this.step.x_sign * this.step.x_step, y: this.start.y } // - check x+++ y+0
        if ((Cords.equality(vertical_cords, this.end) || Cords.equality(horizontal_cords, this.end)) && this.verify_rook()) {
            return true;
        }
    }

    protected queen(): boolean | undefined {
        const diagonally_cords: cords = { x: this.start.x + this.width * this.step.x_sign * this.step.x_step, y: this.start.y + this.width * this.step.y_sign * this.step.y_step }// - сheck diagonally
        const vertical_cords: cords = { x: this.start.x, y: this.start.y + this.width * this.step.y_sign * this.step.y_step } // - check x+0 y+++
        const horizontal_cords: cords = { x: this.start.x + this.width * this.step.x_sign * this.step.x_step, y: this.start.y } // - check x+++ y+0
        if (((Cords.equality(vertical_cords, this.end) || Cords.equality(horizontal_cords, this.end)) && this.verify_rook()) || (Cords.equality(diagonally_cords, this.end) && this.step.y_step == this.step.x_step && this.verify_bishop())) {
            return true;
        }
    }

    protected king(): boolean | undefined {
        const diagonally_one_cords: cords = { x: this.start.x + this.width * this.step.x_sign, y: this.start.y + this.width * this.step.y_sign } // - check x+1 +1
        const horizontal_one_cords: cords = { x: this.start.x + this.width * this.step.x_sign, y: this.start.y } // - check x+1 y+0
        const vertical_one_cords: cords = { x: this.start.x, y: this.start.y + this.width * this.step.y_sign } // - check x+0 y+1
        if (Cords.equality(diagonally_one_cords, this.end) || Cords.equality(vertical_one_cords, this.end) || Cords.equality(horizontal_one_cords, this.end)) {
            return true;
        }
    }
}


export class attack_moves extends moves {

    private signs: Array<cords_sign>;

    constructor(square: any, start: cords, end: cords) {
        super(square, start, end);
        this.signs = [
            { x: 1, y: 1 },
            { x: 1, y: -1 },
            { x: -1, y: 1 },
            { x: -1, y: -1 }]
    }
    public pawn(): boolean | undefined
    {
        const signs : Array<number> = [1, -1];
        for (let i = 0; i < signs.length; i++)
        {
            const end : cords = {
                x: this.start.x + this.width * signs[i],
                y: this.start.y
            }
            if (Cords.equality(end, this.end)) return true;
        }
    }

    public knight(): boolean | undefined {

        for (let i = 0; i < this.signs.length; i++) {
            const horizontal_end: cords = {
                x: this.start.x + this.width * 2 * this.signs[i].x,
                y: this.start.y + this.width * this.signs[i].y
            }
            const vertical_end: cords =
            {
                x: this.start.x + this.width * this.signs[i].x,
                y: this.start.y + this.width * 2 * this.signs[i].y
            }

            if (Cords.equality(horizontal_end, this.end_obj) || Cords.equality(vertical_end, this.end_obj)) return true;
        }

    }

    public bishop(): boolean | undefined {
        for (let i = 0; i < dec.desk_length; i++) {
            for (let j = 0; j < this.signs.length; j++) {
                const end: cords = {
                    x: this.start.x + this.width * this.signs[j].x * i,
                    y: this.start.y + this.width * this.signs[j].y * i
                }

                if (Cords.equality(end, this.end_obj)) return true;
            }
        }
    }

    public rook(): boolean | undefined {
        for (let i = 0; i < dec.desk_length; i++) {
            for (let j = 0; j < this.signs.length; j++) {
                const vertical_end: cords =
                {
                    x: this.start.x,
                    y: this.start.y + this.width * i * this.signs[j].y
                }

                const horizontal_end: cords =
                {
                    x: this.start.x + this.width * i * this.signs[j].x,
                    y: this.start.y
                }

                if (Cords.equality(vertical_end, this.end_obj) || Cords.equality(horizontal_end, this.end_obj)) return true;
            }

        }
    }

    public queen(): boolean | undefined {
        for (let i = 0; i < dec.desk_length; i++) {
            for (let j = 0; j < this.signs.length; j++) {
                const diagonally_end: cords = {
                    x: this.start.x + this.width * this.signs[j].x * i,
                    y: this.start.y + this.width * this.signs[j].y * i
                }

                const vertical_end: cords =
                {
                    x: this.start.x,
                    y: this.start.y + this.width * i * this.signs[j].y
                }

                const horizontal_end: cords =
                {
                    x: this.start.x + this.width * i * this.signs[j].x,
                    y: this.start.y
                }

                if (Cords.equality(diagonally_end, this.end_obj) || Cords.equality(vertical_end, this.end_obj) || Cords.equality(horizontal_end, this.end_obj)) return true;
            }
        }


    }

    public king(): boolean | undefined {
        for (let i = 0; i < this.signs.length; i++) {
            const diagonally_end: cords = {
                x: this.start.x + this.width * this.signs[i].x,
                y: this.start.y + this.width * this.signs[i].y
            }

            const vertical_end: cords = {
                x: this.start.x,
                y: this.start.y + this.width * this.signs[i].y
            }

            const horizontal_end: cords = {
                x: this.start.x + this.width * this.signs[i].x,
                y: this.start.y
            }

            if (Cords.equality(diagonally_end, this.end_obj) || Cords.equality(vertical_end, this.end_obj) || Cords.equality(horizontal_end, this.end_obj)) return true;

        }

    }
}