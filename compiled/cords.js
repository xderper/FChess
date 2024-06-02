import { declares as dec } from "./declares.js";
var Cords = /** @class */ (function () {
    function Cords() {
    }
    // fill array
    Cords.fillCords = function () {
        this.sq = new Array(dec.squares.length);
        for (var i = 0; i < dec.squares.length; i++) {
            var color = null;
            if (dec.squares[i].querySelector('.piece') != null) {
                color = dec.squares[i].getElementsByClassName('piece')[0].attributes[1].value;
            }
            this.sq[i] = {
                x: dec.squares[i].getBoundingClientRect().width * (i % 8) + dec.chessboard.getBoundingClientRect().left,
                y: dec.squares[i].getBoundingClientRect().height * (Math.floor(i / 8)) + dec.chessboard.getBoundingClientRect().top,
                piece: dec.squares[i].querySelector('.piece'),
                color: color,
                square: dec.squares[i],
                width: dec.squares[i].getBoundingClientRect().width,
                height: dec.squares[i].getBoundingClientRect().height,
                attack: false
            };
        }
    };
    // take object by cords
    Cords.getcords = function (x, y) {
        for (var i = 0; i < this.sq.length; i++) {
            var s = this.sq[i];
            if (s.x + s.width >= x + s.width / 2
                && s.y + s.width >= y + s.height / 2
                && s.x <= x + s.width / 2
                && s.y <= y + s.height / 2) {
                return this.sq[i];
            }
        }
    };
    //update cords
    Cords.updatecords = function (obj, x, y) {
        var under_obj = this.getcords(x, y);
        under_obj.piece = obj.piece;
        under_obj.color = obj.color;
        obj.piece = null;
        obj.color = null;
    };
    Cords.equality = function (first, second) {
        var first_obj = this.getcords(first.x, first.y);
        var second_obj = this.getcords(second.x, second.y);
        if (first_obj != undefined && second_obj != undefined && first_obj.x == second_obj.x && first_obj.y == second_obj.y)
            return true;
        else
            return false;
    };
    return Cords;
}());
export default Cords;
