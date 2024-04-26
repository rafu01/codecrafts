import shell from 'shelljs';

let workingFilePath: string = '';

export async function initiate(filePath: string): Promise<{ output: string, cwd: string }> {
    const cwd = `/workspace/${filePath}`;
    workingFilePath = filePath;
    const {output} = await executeCommand(`cd ${cwd}`);
    return {output, cwd};
}

export async function executeFile(fileName: string): Promise<{ output: string, cwd: string }> {
    const cwd = `/workspace/${workingFilePath}`;
    const command = `python3 ${fileName}`;
    const commands: string[] = [`cd ${cwd}`, command];
    return await runCommand(commands.join(' && '));
}

export async function runCommand(command: string): Promise<{ output: string, cwd: string }> {
    return await executeCommand(command);
}


async function executeCommand(command: string): Promise<{ output: string, cwd: string }> {
    const {stdout, stderr, code} = shell.exec(command, {silent: true});
    const cwd = shell.exec('pwd', {silent: true});
    if (code !== 0) {
        console.log(stderr);
        return {output: 'Command not allowed', cwd};
    }
    const output = stdout.trim().split('\n').join(' ');
    return {output, cwd};
}
