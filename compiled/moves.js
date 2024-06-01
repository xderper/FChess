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
import Cords from './cords.js';
import { declares as dec } from './declares.js';
var moves = /** @class */ (function () {
    function moves(square, start, end) {
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
    moves.prototype.remove = function () {
        this.end_obj.piece.remove();
        this.end_obj.piece == null;
        this.end_obj.color == null;
    };
    moves.prototype.verify_bishop = function () {
        var _a;
        var c = 0;
        for (var i = 1; i < this.step.x_step; i++) {
            if (((_a = Cords.getcords(this.start.x + this.step.x_sign * i * this.width, this.start.y + this.step.y_sign * i * this.width)) === null || _a === void 0 ? void 0 : _a.piece) == null)
                c++;
        }
        if (c == this.step.x_step - 1)
            return true;
        else
            return false;
    };
    moves.prototype.verify_rook = function () {
        var _a;
        var c = 0;
        var direction = {
            step: (this.step.x_step > this.step.y_step) ? this.step.x_step : this.step.y_step,
            x_sign: (this.step.x_step > this.step.y_step) ? 1 : 0,
            y_sign: (this.step.x_step > this.step.y_step) ? 0 : 1,
        };
        for (var i = 1; i < direction.step; i++) {
            if (((_a = Cords.getcords(this.start.x + this.step.x_sign * i * this.width * direction.x_sign, this.start.y + this.step.y_sign * i * this.width * direction.y_sign)) === null || _a === void 0 ? void 0 : _a.piece) == null)
                c++;
        }
        if (c == direction.step - 1)
            return true;
        else
            return false;
    };
    moves.prototype.pawn = function () {
        if (((this.start.y == Cords.sq[dec.desk_length + 1].y || this.start.y == Cords.sq[dec.desk_length * (dec.desk_length - 1) - 1].y) && this.start.x == this.end_obj.x && this.start.y + this.width * 2 * this.step.y_sign == this.end_obj.y) || // - first step 2 fields
            (this.start.x == this.end_obj.x && this.start.y + this.width * this.step.y_sign == this.end_obj.y) || // 1 field step
            (this.end_obj.x == this.start.x + this.width * this.step.x_sign && this.end_obj.y == this.start.y + this.width * this.step.y_sign && this.end_obj.piece != null) // - diagonally step for eat 
                && this.step.y_sign == this.color_sign) {
            return true;
        }
    };
    moves.prototype.knight = function () {
        var vertical_cords = { x: this.start.x + this.width * this.step.x_sign, y: this.start.y + this.width * 2 * this.step.y_sign }; // - check x+1 y+2
        var horizontal_cords = { x: this.start.x + this.width * 2 * this.step.x_sign, y: this.start.y + this.width * this.step.y_sign }; // - check x+2 y+1
        if (Cords.equality(vertical_cords, this.end_obj) || Cords.equality(horizontal_cords, this.end_obj)) {
            return true;
        }
    };
    moves.prototype.bishop = function () {
        var diagonally_cords = { x: this.start.x + this.width * this.step.x_sign * this.step.x_step, y: this.start.y + this.width * this.step.y_sign * this.step.y_step }; // - сheck diagonally
        if (Cords.equality(diagonally_cords, this.end) && this.step.y_step == this.step.x_step && this.verify_bishop()) {
            return true;
        }
    };
    moves.prototype.rook = function () {
        var vertical_cords = { x: this.start.x, y: this.start.y + this.width * this.step.y_sign * this.step.y_step }; // - check x+0 y+++
        var horizontal_cords = { x: this.start.x + this.width * this.step.x_sign * this.step.x_step, y: this.start.y }; // - check x+++ y+0
        if ((Cords.equality(vertical_cords, this.end) || Cords.equality(horizontal_cords, this.end)) && this.verify_rook()) {
            return true;
        }
    };
    moves.prototype.queen = function () {
        var diagonally_cords = { x: this.start.x + this.width * this.step.x_sign * this.step.x_step, y: this.start.y + this.width * this.step.y_sign * this.step.y_step }; // - сheck diagonally
        var vertical_cords = { x: this.start.x, y: this.start.y + this.width * this.step.y_sign * this.step.y_step }; // - check x+0 y+++
        var horizontal_cords = { x: this.start.x + this.width * this.step.x_sign * this.step.x_step, y: this.start.y }; // - check x+++ y+0
        if (((Cords.equality(vertical_cords, this.end) || Cords.equality(horizontal_cords, this.end)) && this.verify_rook()) || (Cords.equality(diagonally_cords, this.end) && this.step.y_step == this.step.x_step && this.verify_bishop())) {
            return true;
        }
    };
    moves.prototype.king = function () {
        var diagonally_one_cords = { x: this.start.x + this.width * this.step.x_sign, y: this.start.y + this.width * this.step.y_sign }; // - check x+1 +1
        var horizontal_one_cords = { x: this.start.x + this.width * this.step.x_sign, y: this.start.y }; // - check x+1 y+0
        var vertical_one_cords = { x: this.start.x, y: this.start.y + this.width * this.step.y_sign }; // - check x+0 y+1
        if (Cords.equality(diagonally_one_cords, this.end) || Cords.equality(vertical_one_cords, this.end) || Cords.equality(horizontal_one_cords, this.end)) {
            return true;
        }
    };
    return moves;
}());
export default moves;
var attack_moves = /** @class */ (function (_super) {
    __extends(attack_moves, _super);
    function attack_moves(square, start, end) {
        var _this = _super.call(this, square, start, end) || this;
        _this.signs = [
            { x: 1, y: 1 },
            { x: 1, y: -1 },
            { x: -1, y: 1 },
            { x: -1, y: -1 }
        ];
        return _this;
    }
    attack_moves.prototype.pawn = function () {
        var signs = [1, -1];
        for (var i = 0; i < signs.length; i++) {
            var end = {
                x: this.start.x + this.width * signs[i],
                y: this.start.y
            };
            if (Cords.equality(end, this.end))
                return true;
        }
    };
    attack_moves.prototype.knight = function () {
        for (var i = 0; i < this.signs.length; i++) {
            var horizontal_end = {
                x: this.start.x + this.width * 2 * this.signs[i].x,
                y: this.start.y + this.width * this.signs[i].y
            };
            var vertical_end = {
                x: this.start.x + this.width * this.signs[i].x,
                y: this.start.y + this.width * 2 * this.signs[i].y
            };
            if (Cords.equality(horizontal_end, this.end_obj) || Cords.equality(vertical_end, this.end_obj))
                return true;
        }
    };
    attack_moves.prototype.bishop = function () {
        for (var i = 0; i < dec.desk_length; i++) {
            for (var j = 0; j < this.signs.length; j++) {
                var end = {
                    x: this.start.x + this.width * this.signs[j].x * i,
                    y: this.start.y + this.width * this.signs[j].y * i
                };
                if (Cords.equality(end, this.end_obj))
                    return true;
            }
        }
    };
    attack_moves.prototype.rook = function () {
        for (var i = 0; i < dec.desk_length; i++) {
            for (var j = 0; j < this.signs.length; j++) {
                var vertical_end = {
                    x: this.start.x,
                    y: this.start.y + this.width * i * this.signs[j].y
                };
                var horizontal_end = {
                    x: this.start.x + this.width * i * this.signs[j].x,
                    y: this.start.y
                };
                if (Cords.equality(vertical_end, this.end_obj) || Cords.equality(horizontal_end, this.end_obj))
                    return true;
            }
        }
    };
    attack_moves.prototype.queen = function () {
        for (var i = 0; i < dec.desk_length; i++) {
            for (var j = 0; j < this.signs.length; j++) {
                var diagonally_end = {
                    x: this.start.x + this.width * this.signs[j].x * i,
                    y: this.start.y + this.width * this.signs[j].y * i
                };
                var vertical_end = {
                    x: this.start.x,
                    y: this.start.y + this.width * i * this.signs[j].y
                };
                var horizontal_end = {
                    x: this.start.x + this.width * i * this.signs[j].x,
                    y: this.start.y
                };
                if (Cords.equality(diagonally_end, this.end_obj) || Cords.equality(vertical_end, this.end_obj) || Cords.equality(horizontal_end, this.end_obj))
                    return true;
            }
        }
    };
    attack_moves.prototype.king = function () {
        for (var i = 0; i < this.signs.length; i++) {
            var diagonally_end = {
                x: this.start.x + this.width * this.signs[i].x,
                y: this.start.y + this.width * this.signs[i].y
            };
            var vertical_end = {
                x: this.start.x,
                y: this.start.y + this.width * this.signs[i].y
            };
            var horizontal_end = {
                x: this.start.x + this.width * this.signs[i].x,
                y: this.start.y
            };
            if (Cords.equality(diagonally_end, this.end_obj) || Cords.equality(vertical_end, this.end_obj) || Cords.equality(horizontal_end, this.end_obj))
                return true;
        }
    };
    return attack_moves;
}(moves));
export { attack_moves };
