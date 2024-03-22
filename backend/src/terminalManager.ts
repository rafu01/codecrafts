//@ts-ignore => someone fix this
import { fork, IPty } from 'node-pty';
import path from "path";

const SHELL = "bash";

export class TerminalManager {
    private sessions: { [id: string]: {terminal: IPty, replId: string;} } = {};

    constructor() {
        this.sessions = {};
    }

    createPty(id: string, filePath: string, onData: (data: string, cwd:string, id: number) => void) {
        const cwd = path.join(__dirname, `../../tmp/${filePath}`);
        let term = fork(SHELL, [], {
            cols: 100,
            name: 'xterm',
            cwd: cwd
        });

        term.on('data', (data: string) => onData(data, cwd, term.pid));
        this.sessions[id] = {
            terminal: term,
            replId: filePath
        };
        term.on('exit', () => {
            delete this.sessions[term.pid];
        });
        return term;
    }

    write(terminalId: string, data: string) {
        this.sessions[terminalId]?.terminal.write(data);
    }

    clear(terminalId: string) {
        this.sessions[terminalId].terminal.kill();
        delete this.sessions[terminalId];
    }
}
