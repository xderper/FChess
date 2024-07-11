var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import moves, { attack_moves } from './moves.js';
import Cords from './cords.js';
import Main from './app.js';
var verify_moves = /** @class */ (function (_super) {
    __extends(verify_moves, _super);
    function verify_moves(square, start, end) {
        var _this = _super.call(this, square, start, end) || this;
        _this.verify_result = false;
        _this.defence = false;
        _this.main = new Main();
        if (_this.square.piece)
            _this.figure = _this.square.piece.classList[1];
        return _this;
    }
    verify_moves.prototype.eat_figures = function () {
        if (this.end_obj.piece == null) {
            return true;
        }
        else if (this.end_obj.piece != null && this.end_obj.color != this.move_color && this.end_obj.piece.classList[1] != 'king') {
            this.remove();
            return true;
        }
    };
    verify_moves.prototype.output = function () {
        var main = new Main();
        if (this.verify_result) {
            main.main();
            main.fill_colors(this.start);
            main.move_to(this.square, this.end.x, this.end.y);
            Main.motion_count++;
            Cords.updatecords(this.square, this.square.piece.getBoundingClientRect().left, this.square.piece.getBoundingClientRect().top);
        }
        else {
            main.move_to(this.square, this.start.x, this.start.y);
        }
    };
    verify_moves.prototype.primary_move = function () {
        this.end_obj = Cords.getcords(this.end.x, this.end.y);
        this.end =
            {
                x: this.end_obj.x,
                y: this.end_obj.y
            };
        console.log(this.move_king.attack, this.defence);
        this.verify_result = (((this.figure == 'pawn' && this.pawn()) ||
            (this.figure == 'knight' && this.knight()) ||
            (this.figure == 'bishop' && this.bishop()) ||
            (this.figure == 'rook' && this.rook()) ||
            (this.figure == 'queen' && this.queen()) ||
            (this.figure == 'king' && this.king()))
            &&
                (!this.move_king.attack) || this.defence
            &&
                ((this.move_color == 'white' && Main.motion_count % 2 == 0) ||
                    (this.move_color == 'black' && Main.motion_count % 2 == 1))) ? this.eat_figures() : false;
        this.output();
    };
    return verify_moves;
}(moves));
export { verify_moves };
var verify_attack = /** @class */ (function (_super) {
    __extends(verify_attack, _super);
    function verify_attack(square, start, end) {
        var _this = _super.call(this, square, start, end) || this;
        // find kings on desk
        _this.find_king();
        var king = {
            x: _this.opposite_king.x,
            y: _this.opposite_king.y
        };
        _this.attack_moves = new attack_moves(square, end, king);
        return _this;
    }
    verify_attack.prototype.find_king = function () {
        for (var i = 0; i < Cords.sq.length; i++) {
            if (Cords.sq[i].piece && Cords.sq[i].piece.classList[1] == 'king') {
                if (Cords.sq[i].color != this.move_color)
                    this.opposite_king = Cords.sq[i];
                else
                    this.move_king = Cords.sq[i];
            }
        }
    };
    verify_attack.prototype.primary_attack = function () {
        if (this.move()) {
            this.opposite_king.attack = true;
            this.opposite_king.square.style.background = 'red';
            this.defence = false;
            console.log('true');
        }
        else if (this.move_king.attack && !this.move()) {
            console.log('def');
            this.defence = true;
            this.move_king = false;
        }
        else {
            this.defence = false;
            this.opposite_king.attack = false;
        }
    };
    verify_attack.prototype.move = function () {
        this.end_obj = Cords.getcords(this.end.x, this.end.y);
        this.end =
            {
                x: this.end_obj.x,
                y: this.end_obj.y
            };
        if ((this.figure == 'knight' && this.attack_moves.knight())
            || (this.figure == 'bishop' && this.attack_moves.bishop())
            || (this.figure == 'rook' && this.attack_moves.rook())
            || (this.figure == 'queen' && this.attack_moves.queen())
            || (this.figure == 'king' && this.attack_moves.king())
            || (this.figure == 'pawn' && this.attack_moves.pawn()))
            return true;
    };
    return verify_attack;
}(verify_moves));
export default verify_attack;
