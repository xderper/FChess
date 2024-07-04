// imports
import Main from "./app.js";
import {declares as dec, cords} from "./launch/declares.js"


export default class Cords {
    // array width keys object - cords
    public static sq: Array<{
        x: number;
        y: number;
        piece: HTMLElement;
        square: HTMLElement;
        width: number;
        height: number;
        color: any;
        attack: boolean;

    }>;
    // fill array
    public static fillCords(): void {
        this.sq = new Array(dec.squares.length);

        for (let i = 0; i < dec.squares.length; i++) {
            let color : string | null = null;
            if (dec.squares[i].querySelector('.piece') as HTMLElement != null) {
                color = dec.squares[i].getElementsByClassName('piece')[0].attributes[1].value;
            }

            this.sq[i] = {
                x: dec.squares[i].getBoundingClientRect().width * (i % 8) + dec.chessboard.getBoundingClientRect().left,
                y: dec.squares[i].getBoundingClientRect().height * (Math.floor(i / 8)) + dec.chessboard.getBoundingClientRect().top,
                piece: dec.squares[i].querySelector('.piece') as HTMLElement,
                color: color,
                square: dec.squares[i] as HTMLElement,
                width: dec.squares[i].getBoundingClientRect().width,
                height: dec.squares[i].getBoundingClientRect().height,
                attack: false
            };

        }
    }

    // take object by cords
    public static getcords(x, y) {
        for (let i = 0; i < this.sq.length; i++) {
            const s: any = this.sq[i];
            
            if (s.x + s.width >= x + s.width /2
                && s.y + s.width >= y + s.height /2
                && s.x <= x + s.width /2
                && s.y <= y + s.height /2) {
                return this.sq[i];
            }
        }

    }
    //update cords
    public static updatecords(obj, x, y) {
        let under_obj: any = this.getcords(x, y);
        under_obj.piece = obj.piece;
        under_obj.color = obj.color;
        obj.piece = null;
        obj.color = null;
    }


    public static equality(first : cords, second : cords) : boolean | undefined{
        const first_obj : any = this.getcords(first.x, first.y);
        const second_obj : any = this.getcords(second.x, second.y);
        if (first_obj != undefined && second_obj != undefined && first_obj.x == second_obj.x && first_obj.y == second_obj.y) return true;
        else return false;
    }

}