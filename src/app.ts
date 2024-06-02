// Import necessary modules and classes
import Cords from './cords.js';
import Moves from './moves.js';
import { cords, declares as dec } from './declares.js'
import Verify from './verify.js';


export default class Main {
    // Private properties to store the starting and tracking coordinates of a piece
    private start_cords: cords;
    private tracking_cords: cords;

    // Private property to store the width of a square on the board
    private readonly width: number = Cords.sq[0].width;

    // Private method to move a piece to a new position on the board
    private move_to(square: any, x: number, y: number): void {
        // Update the left and top CSS properties of the piece to move it to the new position
        square.piece.style.left = x + 'px';
        square.piece.style.top = y + 'px';
    }

    // Private method to set the background color of each square on the board
    private fill_colors(mode: boolean = false, start_cords: cords = this.start_cords, tracking_cords: cords = this.tracking_cords): void {
        // Loop through each square on the board
        for (let i = 0; i < Cords.sq.length; i++) {
            const square: any = Cords.sq[i].square;
            // If the mode is true or the square is not the starting square, set the background color
            if ((mode || (Cords.sq[i].x != start_cords.x || Cords.sq[i].y != start_cords.y)) && !Cords.sq[i].attack) {
                square.style.background = (square.classList[1] == 'black') ? '#b58863' : '#f0d9b5';
            }
        }
    }

    // Private method to indicate the starting move of a piece
    private start_indicate_move() {
        // Get the starting square of the piece
        const start_obj: any = Cords.getcords(this.start_cords.x, this.start_cords.y);
        // Set the background color of the starting square to lime
        start_obj.square.style.background = 'lime';
    }   

    // Private method to indicate the current move of a piece
    private indicate_move(): void {
        // Fill the colors of the board
        this.fill_colors();
        // Get the current square of the piece
        const under_move_obj: any = Cords.getcords(this.tracking_cords.x, this.tracking_cords.y);
        // If the piece has moved, set the background color of the current square to green
        if (!Cords.equality(this.tracking_cords, this.start_cords)) under_move_obj.square.style.background = 'green';
    }

    // Private method to handle the mouse up event of a piece
    private OnMouseUp(square: any, piece: any) {
        // Create a new Verify object to verify the move
        const verify = new Verify(
            square,
            this.start_cords,
            this.tracking_cords,
        );

        // Verify the move
        verify.verify_attack();
        verify.verify_move(Cords.getcords(this.tracking_cords.x, this.tracking_cords.y), true);

        // Reset the event handlers of the piece
        piece.onmousemove = null;
        piece.onmouseup = null;

        // Call the main method
        this.main();

        // Fill the colors of the board
        this.fill_colors(true);
    }

    // Private method to handle the mouse move event of a piece
    private OnMouseMove(square: any, event: MouseEvent) {
        // Update the tracking coordinates of the piece
        this.tracking_cords.x = event.pageX - this.width / 2;
        this.tracking_cords.y = event.pageY - this.width / 2;

        // Indicate the current move of the piece
        this.indicate_move();

        // Move the piece to the new position
        this.move_to(square, this.tracking_cords.x, this.tracking_cords.y);
    }

    public main(): void {
        var self = this;
        for (let i = 0; i < dec.squares.length; i++) {
            let piece: HTMLElement = Cords.sq[i].piece as HTMLElement;
            if (piece != null && piece != undefined) {
                piece.onmousedown = function (event: MouseEvent) {
                    
                    self.start_cords = { // - start cords
                        x: Cords.getcords(piece.getBoundingClientRect().left, piece.getBoundingClientRect().top)?.x,
                        y: Cords.getcords(piece.getBoundingClientRect().left, piece.getBoundingClientRect().top)?.y
                    }
                    self.tracking_cords = { // - cords for tracking
                        x: event.clientX - self.width / 2,
                        y: event.clientY - self.width / 2
                    }


                    piece.style.height = self.width + 'px';
                    piece.style.width = self.width + 'px';
                    piece.style.zIndex = '100';
                    piece.style.position = 'absolute';
                    document.body.append(piece);

                    self.move_to(Cords.sq[i], event.clientX - self.width / 2, event.clientY - self.width / 2);
                    self.start_indicate_move();

                    piece.onmousemove = function (event: MouseEvent) { self.OnMouseMove(Cords.sq[i], event) }
                    piece.onmouseup = function (event: MouseEvent) { self.OnMouseUp(Cords.sq[i], piece) }

                }


                piece.ondragstart = function () {
                    return false;
                }
            }
        }
    }
}


