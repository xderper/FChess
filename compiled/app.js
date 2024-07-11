// Import necessary modules and classes
import Cords from './cords.js';
import { declares as dec } from './launch/declares.js';
import Verify from './verify.js';
var Main = /** @class */ (function () {
    function Main() {
        // Private property to store the width of a square on the board
        this.width = Cords.sq[0].width;
    }
    // Private method to move a piece to a new position on the board
    Main.prototype.move_to = function (square, x, y) {
        // Update the left and top CSS properties of the piece to move it to the new position
        square.piece.style.left = x + 'px';
        square.piece.style.top = y + 'px';
    };
    // Private method to set the background color of each square on the board
    Main.prototype.fill_colors = function (mode, start_cords, tracking_cords) {
        if (mode === void 0) { mode = false; }
        if (start_cords === void 0) { start_cords = this.start_cords; }
        if (tracking_cords === void 0) { tracking_cords = this.tracking_cords; }
        // Loop through each square on the board
        for (var i = 0; i < Cords.sq.length; i++) {
            var square = Cords.sq[i].square;
            // If the mode is true or the square is not the starting square, set the background color
            if ((mode || (Cords.sq[i].x != start_cords.x || Cords.sq[i].y != start_cords.y)) && !Cords.sq[i].attack) {
                square.style.background = (square.classList[1] == 'black') ? '#b58863' : '#f0d9b5';
            }
        }
    };
    // Private method to indicate the starting move of a piece
    // private start_indicate_move() {
    //     // Get the starting square of the piece
    //     const start_obj: any = Cords.getcords(this.start_cords.x, this.start_cords.y);
    //     // Set the background color of the starting square to lime
    //     start_obj.square.style.background = 'lime';
    // }   
    // // Private method to indicate the current move of a piece
    // private indicate_move(): void {
    //     // Fill the colors of the board
    //     this.fill_colors();
    //     // Get the current square of the piece
    //     const under_move_obj: any = Cords.getcords(this.tracking_cords.x, this.tracking_cords.y);
    //     // If the piece has moved, set the background color of the current square to green
    //     if (!Cords.equality(this.tracking_cords, this.start_cords)) under_move_obj.square.style.background = 'green';
    // }
    // Private method to handle the mouse up event of a piece
    Main.prototype.OnMouseUp = function (square, piece) {
        // Create a new Verify object to verify the move
        var verify = new Verify(square, this.start_cords, this.tracking_cords);
        // Verify the move
        verify.primary_move();
        verify.primary_attack();
        // Reset the event handlers of the piece
        piece.onmousemove = null;
        piece.onmouseup = null;
        // Call the main method
        this.main();
        // Fill the colors of the board
        this.fill_colors(true);
    };
    // Private method to handle the mouse move event of a piece
    Main.prototype.OnMouseMove = function (square, event) {
        // Update the tracking coordinates of the piece
        this.tracking_cords.x = event.pageX - this.width / 2;
        this.tracking_cords.y = event.pageY - this.width / 2;
        // Indicate the current move of the piece
        // this.indicate_move();
        // Move the piece to the new position
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
                    // self.start_indicate_move();
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
    Main.motion_count = 0;
    return Main;
}());
export default Main;
