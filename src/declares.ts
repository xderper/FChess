export type cords = {
    x: number;
    y: number;
}

export type steps = {
    x_sign: number;
    y_sign: number;
    x_step: number;
    y_step: number;
}

export type cords_sign ={
    x: number;
    y: number
}

export class declares {
    public static readonly desk_length: number = 8; // - desk amount of columns and rows
    public static readonly pieces: any = document.getElementsByClassName('piece'); // - figures on desk
    public static readonly squares: any = document.getElementsByClassName('square'); // - fields (squares)
    public static readonly chessboard: any = document.getElementById('chessBoard') as HTMLElement; // - desk as element
}