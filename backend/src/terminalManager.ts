// @ts-ignore
import { fork, IPty } from 'node-pty';
import path from "path";

const SHELL = "bash";

export class TerminalManager {
    private sessions: { [id: string]: {terminal: IPty, replId: string, outputBuffer: string} } = {};

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
            replId: filePath,
            outputBuffer: ''
        };
        term.on('exit', () => {
            delete this.sessions[term.pid];
        });
        return term;
    }

    async write(terminalId: string, command: string) {
        const session = this.sessions[terminalId];
        if (session) {
            command = command.trim();
            session.outputBuffer = '';
            let outputBuffer = '';

            session.terminal.onData((output: string) => {
                outputBuffer += output;
                if (outputBuffer.trim() === command) {
                    outputBuffer = '';
                } else {
                    session.outputBuffer += outputBuffer;
                    outputBuffer = '';
                }
            });

            session.terminal.write(command + '\n');
        }
    }
    getOutput(terminalId: string) {
        const session = this.sessions[terminalId];
        if (session) {
            const outputArr = session.outputBuffer.split('\n');
            console.log(outputArr);
            return session.outputBuffer;
        }
        return '';
    }
    clear(terminalId: string) {
        this.sessions[terminalId].terminal.kill();
        delete this.sessions[terminalId];
    }
}
