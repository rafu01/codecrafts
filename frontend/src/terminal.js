// // terminal.js
// require('os');
// const pty = require('node-pty');
//
// const shell = process.env.SHELL || 'sh';
// const cwd = process.cwd();
//
// class Terminal {
//     constructor() {
//         this.terminal = pty.spawn(shell, [], {
//             name: 'xterm-color',
//             cols: 80,
//             rows: 30,
//             cwd: cwd,
//             env: process.env,
//         });
//
//         this.terminal.onData((data) => {
//             this.sendOutput(data);
//         });
//     }
//
//     sendInput(input) {
//         this.terminal.write(input);
//     }
//
//     sendOutput(output) {
//         // Implement a method to send the output to the Xterm.js instance
//         console.log(output);
//     }
//
//     resize(cols, rows) {
//         this.terminal.resize(cols, rows);
//     }
// }
//
// module.exports = Terminal;