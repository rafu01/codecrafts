import {IPty, spawn} from 'node-pty';

interface Terminal {
    pty: IPty | null,
    socket: any
}

const terminals : Record<string, Terminal> = {};

export const initTerminal = async (socket: any) => {


    // terminals[terminalId] = {
    //     pty,
    //     socket,
    // };
    //
    // pty.onData((data) => {
    //     console.log(data);
    //     socket.emit('terminal', data);
    // });
}
const destroyTerminal = (terminalId: string) => {
    const terminal = terminals[terminalId];

    if (!terminal) {
        console.log('No terminal found for this socket');
        return;
    }

    terminal.pty?.kill();
    delete terminals[terminalId];

    console.log('Terminal destroyed');
}