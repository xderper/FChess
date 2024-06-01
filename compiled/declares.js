var declares = /** @class */ (function () {
    function declares() {
    }
    declares.desk_length = 8; // - desk amount of columns and rows
    declares.pieces = document.getElementsByClassName('piece'); // - figures on desk
    declares.squares = document.getElementsByClassName('square'); // - fields (squares)
    declares.chessboard = document.getElementById('chessBoard'); // - desk as element
    return declares;
}());
export { declares };
