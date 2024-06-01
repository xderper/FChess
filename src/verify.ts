import moves, { attack_moves } from './moves.js';
import Cords from './cords.js';
import Main from './app.js';

class verify_moves extends moves {
    square: any;
    start: any;
    end: any;
    verify_result: boolean;
    opposite_king: any;
    figure: string;
    attack_moves: attack_moves;
    end_obj: any;
    move_color: string;

    constructor(square: any, start: any, end: any) {
        super(square, start, end);
        this.verify_result = false;
        this.find_king();
        const king = {
            x: this.opposite_king.x,
            y: this.opposite_king.y
        };
        this.attack_moves = new attack_moves(square, end, king);
        if (this.square.piece)
            this.figure = this.square.piece.classList[1];
    }

    verify_move(end_obj: any, mode: boolean = false) {
        const end_cords = {
            x: end_obj.x,
            y: end_obj.y
        };
        if (mode) {
            this.end = end_cords;
            this.end_obj = end_obj;
        }
        else {
            this.attack_moves.end = end_cords;
            this.attack_moves.end_obj = end_obj;
        }
        if (mode) {
            this.verify_result = ((this.figure == 'pawn' && this.pawn()) ||
                (this.figure == 'knight' && this.knight()) ||
                (this.figure == 'bishop' && this.bishop()) ||
                (this.figure == 'rook' && this.rook()) ||
                (this.figure == 'queen' && this.queen()) ||
                (this.figure == 'king' && this.king())) ? this.verify_eat_figures() : false;
            this.result_verify_move();
        }
        else {
            if ((this.figure == 'knight' && this.attack_moves.knight())
                || (this.figure == 'bishop' && this.attack_moves.bishop())
                || (this.figure == 'rook' && this.attack_moves.rook())
                || (this.figure == 'queen' && this.attack_moves.queen())
                || (this.figure == 'king' && this.attack_moves.king())
                || (this.figure == 'pawn' && this.attack_moves.king())) {
                return true;
            }
        }
    }

    result_verify_move() {
        const main = new Main();
        if (this.verify_result) {
            main.main();
            main.fill_colors(this.start);
            main.move_to(this.square, this.end.x, this.end.y);
            Cords.updatecords(this.square, this.square.piece.getBoundingClientRect().left, this.square.piece.getBoundingClientRect().top);
        }
        else {
            main.move_to(this.square, this.start.x, this.start.y);
        }
    }

    verify_eat_figures() {
        if (this.end_obj.piece == null) {
            return true;
        }
        else if (this.end_obj.piece != null && this.end_obj.color != this.move_color && this.end_obj.piece.classList[1] != 'king') {
            this.remove();
            return true;
        }
    }

    verify_attack() {
        if (this.verify_move(this.opposite_king)) {
            console.log('true');
        }
    }

    find_king() {
        for (let i = 0; i < Cords.sq.length; i++) {
            if (Cords.sq[i].piece && Cords.sq[i].piece.classList[1] == 'king' && Cords.sq[i].color != this.move_color) {
                this.opposite_king = Cords.sq[i];
            }
        }
    }
}

export default verify_moves;