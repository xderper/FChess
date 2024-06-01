import Cords from './cords.js'
import Main from './app.js'


function main() {
    Cords.fillCords();
    const main = new Main();
    main.main()
}

main();
