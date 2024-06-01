import Cords from './cords.js';
import { declares as dec, cords} from './declares.js';
import Verify from './verify.js';




class Main {
  private width: number = Cords.sq[0].width;
  private start_cords: cords;
  private tracking_cords: cords;

  public move_to(square: any, x: number, y: number): void {
    square.piece.style.left = x + 'px';
    square.piece.style.top = y + 'px';
  }

  public fill_colors(mode: boolean = false, start_cords: cords = this.start_cords, tracking_cords: cords = this.tracking_cords): void {
    for (let i = 0; i < Cords.sq.length; i++) {
      const square = Cords.sq[i].square;
      if (mode || (Cords.sq[i].x != start_cords.x || Cords.sq[i].y != start_cords.y)) {
        square.style.background = (square.classList[1] == 'black') ? '#b58863' : '#f0d9b5';
      }
    }
  }

  private start_indicate_move(): void {
    const start_obj = Cords.getcords(this.start_cords.x, this.start_cords.y);
    start_obj.square.style.background = 'lime';
  }

  private indicate_move(): void {
    this.fill_colors();
    const under_move_obj = Cords.getcords(this.tracking_cords.x, this.tracking_cords.y);
    if (!Cords.equality(this.tracking_cords, this.start_cords)) {
      under_move_obj.square.style.background = 'green';
    }
  }

  private OnMouseUp(square: any, piece: HTMLElement): void {
    console.log(typeof(square))
    const verify = new Verify(square, this.start_cords, this.tracking_cords);
    verify.verify_attack();
    verify.verify_move(Cords.getcords(this.tracking_cords.x, this.tracking_cords.y), true);
    piece.onmousemove = null;
    piece.onmouseup = null;
    this.main();
    this.fill_colors(true);
  }

  private OnMouseMove(square: any, event: MouseEvent): void {
    this.tracking_cords.x = event.pageX - this.width / 2;
    this.tracking_cords.y = event.pageY - this.width / 2;
    this.indicate_move();
    this.move_to(square, this.tracking_cords.x, this.tracking_cords.y);
  }

  public main(): void {
    const self = this;
    for (let i = 0; i < dec.squares.length; i++) {
      const piece = Cords.sq[i].piece;
      if (piece != null && piece != undefined) {
        piece.onmousedown = function (event: MouseEvent) {
          self.start_cords = {
            x: Cords.getcords(piece.getBoundingClientRect().left, piece.getBoundingClientRect().top)?.x,
            y: Cords.getcords(piece.getBoundingClientRect().left, piece.getBoundingClientRect().top)?.y
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
          piece.onmousemove = function (event: MouseEvent) { self.OnMouseMove(Cords.sq[i], event); };
          piece.onmouseup = function (event: MouseEvent) { self.OnMouseUp(Cords.sq[i], piece); };
        };
        piece.ondragstart = function () {
          return false;
        };
      }
    }
  }
}

export default Main;