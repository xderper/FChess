import moves, { attack_moves } from './moves.js';
import Cords from './cords.js'
import { cords } from './launch/declares.js';
import Main from './app.js'



export class verify_moves extends moves {

    protected readonly figure: string;
    protected move_king: any;
    protected opposite_king: any;

    private verify_result: boolean | undefined = false;
    protected defence : boolean = false;

    protected main : Main = new Main();



    constructor(square: any, start: cords, end: cords) {
        super(square, start, end);
        if (this.square.piece) this.figure = this.square.piece.classList[1];
    }

    private eat_figures(): boolean | undefined {
        if (this.end_obj.piece == null) {
            return true;
        }
        else if (this.end_obj.piece != null && this.end_obj.color != this.move_color && this.end_obj.piece.classList[1] != 'king') {
            this.remove();
            return true;
        }
    }

    private output() {
        const main: any = new Main();
        if (this.verify_result) {
            main.main();
            main.fill_colors(this.start);
            main.move_to(this.square, this.end.x, this.end.y);
            Main.motion_count++;
            Cords.updatecords(this.square, this.square.piece.getBoundingClientRect().left, this.square.piece.getBoundingClientRect().top);
        }
        else {
            main.move_to(this.square, this.start.x, this.start.y)
        }
    }

    public primary_move() {

        this.end_obj = Cords.getcords(this.end.x, this.end.y);
        this.end =
        {
            x: this.end_obj.x,
            y: this.end_obj.y
        }

        console.log(this.move_king.attack, this.defence)


        this.verify_result = (
            ((this.figure == 'pawn' && this.pawn()) ||
                (this.figure == 'knight' && this.knight()) ||
                (this.figure == 'bishop' && this.bishop()) ||
                (this.figure == 'rook' && this.rook()) ||
                (this.figure == 'queen' && this.queen()) ||
                (this.figure == 'king' && this.king()))
             &&
            (!this.move_king.attack) || this.defence
            &&
            (
                (this.move_color == 'white' && Main.motion_count%2==0)||
                (this.move_color == 'black' && Main.motion_count%2==1)
                
            )
        ) ? this.eat_figures() : false;

        this.output();
    }


}


export default class verify_attack extends verify_moves {

    private attack_moves: attack_moves;


    constructor(square: any, start: cords, end: cords) {
        super(square, start, end);

        // find kings on desk
        this.find_king()
        const king: cords = {
            x: this.opposite_king.x,
            y: this.opposite_king.y
        }

        this.attack_moves = new attack_moves(square, end, king);
    }

    private find_king() {
        for (let i = 0; i < Cords.sq.length; i++) {
            if (Cords.sq[i].piece && Cords.sq[i].piece.classList[1] == 'king') {
                if (Cords.sq[i].color != this.move_color) this.opposite_king = Cords.sq[i];
                else this.move_king = Cords.sq[i];
            }
        }
    }

    public primary_attack() {


        if (this.move()) {
            this.opposite_king.attack = true;
            this.opposite_king.square.style.background = 'red';
            this.defence = false;
            console.log('true');
        }
        else if (this.move_king.attack && !this.move()){
            console.log('def');
            this.defence = true;
            this.move_king = false;
            
        }
        else {
            this.defence = false;
            this.opposite_king.attack = false;
        }
    }

    private move() {
        this.end_obj = Cords.getcords(this.end.x, this.end.y);
        this.end =
        {
            x: this.end_obj.x,
            y: this.end_obj.y
        }
        if (
            (this.figure == 'knight' && this.attack_moves.knight())
            || (this.figure == 'bishop' && this.attack_moves.bishop())
            || (this.figure == 'rook' && this.attack_moves.rook())
            || (this.figure == 'queen' && this.attack_moves.queen())
            || (this.figure == 'king' && this.attack_moves.king())
            || (this.figure == 'pawn' && this.attack_moves.pawn())
        ) return true

    }
}

