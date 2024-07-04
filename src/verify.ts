import moves, { attack_moves } from './moves.js';
import Cords from './cords.js'
import { cords } from './launch/declares.js';
import Main from './app.js'



export default class verify_moves extends moves {

    private readonly figure: string;
    private opposite_king: any;
    private move_king: any;
    private verify_result: boolean | undefined = false;

    private attack_moves: attack_moves;

    constructor(square: any, start: cords, end: cords) {
        super(square, start, end);
        this.find_king()
        const king: cords = {
            x: this.opposite_king.x,
            y: this.opposite_king.y
        }
        this.attack_moves = new attack_moves(square, end, king);
        if (this.square.piece) this.figure = this.square.piece.classList[1];
    }

    public verify_move(end_obj: any, mode: boolean = false) {
        const end_cords: cords =
        {
            x: end_obj.x,
            y: end_obj.y
        }

        if (mode) {
            this.end = end_cords;
            this.end_obj = end_obj;
        }
        else {
            this.attack_moves.end = end_cords;
            this.attack_moves.end_obj = end_obj;
        }

        if (mode) {
            this.verify_result = (
                ((this.figure == 'pawn' && this.pawn()) ||
                    (this.figure == 'knight' && this.knight()) ||
                    (this.figure == 'bishop' && this.bishop()) ||
                    (this.figure == 'rook' && this.rook()) ||
                    (this.figure == 'queen' && this.queen()) ||
                    (this.figure == 'king' && this.king())) &&
                (!this.move_king.attack)
            ) ? this.verify_eat_figures() : false;
            this.result_verify_move();
        }
        else {
            if (
                (this.figure == 'knight' && this.attack_moves.knight())
                || (this.figure == 'bishop' && this.attack_moves.bishop())
                || (this.figure == 'rook' && this.attack_moves.rook())
                || (this.figure == 'queen' && this.attack_moves.queen())
                || (this.figure == 'king' && this.attack_moves.king())
                || (this.figure == 'pawn' && this.attack_moves.pawn())
            ) {
                return true
            }
        }

    }

    private result_verify_move() {
        const main: any = new Main();
        if (this.verify_result) {
            main.main();
            main.fill_colors(this.start);
            main.move_to(this.square, this.end.x, this.end.y);
            Cords.updatecords(this.square, this.square.piece.getBoundingClientRect().left, this.square.piece.getBoundingClientRect().top);
        }
        else {
            main.move_to(this.square, this.start.x, this.start.y)
        }
    }

    private verify_eat_figures(): boolean | undefined {
        if (this.end_obj.piece == null) {
            return true;
        }
        else if (this.end_obj.piece != null && this.end_obj.color != this.move_color && this.end_obj.piece.classList[1] != 'king') {
            this.remove();
            return true;
        }
    }

    public verify_attack() {
        if (this.verify_move(this.opposite_king)) {
            this.opposite_king.attack = true;
            this.opposite_king.square.style.background = 'red';
            console.log('true');
        }
        else {
            this.opposite_king.attack = false;
        }
    }

    private find_king() {
        for (let i = 0; i < Cords.sq.length; i++) {
            if (Cords.sq[i].piece && Cords.sq[i].piece.classList[1] == 'king') {
                if (Cords.sq[i].color != this.move_color) this.opposite_king = Cords.sq[i];
                else this.move_king = Cords.sq[i];
            }
        }
    }
}


