import Cords from './cords.js';
import { declares as dec } from './declares.js';
import Verify from './verify.js';
var Main = /** @class */ (function () {
    function Main() {
        this.width = Cords.sq[0].width;
    }
    Main.prototype.move_to = function (square, x, y) {
        square.piece.style.left = x + 'px';
        square.piece.style.top = y + 'px';
    };
    Main.prototype.fill_colors = function (mode, start_cords, tracking_cords) {
        if (mode === void 0) { mode = false; }
        if (start_cords === void 0) { start_cords = this.start_cords; }
        if (tracking_cords === void 0) { tracking_cords = this.tracking_cords; }
        for (var i = 0; i < Cords.sq.length; i++) {
            var square = Cords.sq[i].square;
            if (mode || (Cords.sq[i].x != start_cords.x || Cords.sq[i].y != start_cords.y)) {
                square.style.background = (square.classList[1] == 'black') ? '#b58863' : '#f0d9b5';
            }
        }
    };
    Main.prototype.start_indicate_move = function () {
        var start_obj = Cords.getcords(this.start_cords.x, this.start_cords.y);
        start_obj.square.style.background = 'lime';
    };
    Main.prototype.indicate_move = function () {
        this.fill_colors();
        var under_move_obj = Cords.getcords(this.tracking_cords.x, this.tracking_cords.y);
        if (!Cords.equality(this.tracking_cords, this.start_cords)) {
            under_move_obj.square.style.background = 'green';
        }
    };
    Main.prototype.OnMouseUp = function (square, piece) {
        console.log(typeof (square));
        var verify = new Verify(square, this.start_cords, this.tracking_cords);
        verify.verify_attack();
        verify.verify_move(Cords.getcords(this.tracking_cords.x, this.tracking_cords.y), true);
        piece.onmousemove = null;
        piece.onmouseup = null;
        this.main();
        this.fill_colors(true);
    };
    Main.prototype.OnMouseMove = function (square, event) {
        this.tracking_cords.x = event.pageX - this.width / 2;
        this.tracking_cords.y = event.pageY - this.width / 2;
        this.indicate_move();
        this.move_to(square, this.tracking_cords.x, this.tracking_cords.y);
    };
    Main.prototype.main = function () {
        var self = this;
        var _loop_1 = function (i) {
            var piece = Cords.sq[i].piece;
            if (piece != null && piece != undefined) {
                piece.onmousedown = function (event) {
                    var _a, _b;
                    self.start_cords = {
                        x: (_a = Cords.getcords(piece.getBoundingClientRect().left, piece.getBoundingClientRect().top)) === null || _a === void 0 ? void 0 : _a.x,
                        y: (_b = Cords.getcords(piece.getBoundingClientRect().left, piece.getBoundingClientRect().top)) === null || _b === void 0 ? void 0 : _b.y
                    };
                    self.tracking_cords = {
                        x: event.clientX - self.width / 2,
                        y: event.clientY - self.width / 2
                    };
                    piece.style.height = self.width + 'px';
                    piece.style.width = self.width + 'px';
                    piece.style.zIndex = '100';
                    piece.style.position = 'absolute';
                    document.body.append(piece);
                    self.move_to(Cords.sq[i], event.clientX - self.width / 2, event.clientY - self.width / 2);
                    self.start_indicate_move();
                    piece.onmousemove = function (event) { self.OnMouseMove(Cords.sq[i], event); };
                    piece.onmouseup = function (event) { self.OnMouseUp(Cords.sq[i], piece); };
                };
                piece.ondragstart = function () {
                    return false;
                };
            }
        };
        for (var i = 0; i < dec.squares.length; i++) {
            _loop_1(i);
        }
    };
    return Main;
}());
export default Main;
