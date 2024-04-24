import { exec } from 'get-pty-output'
import path from "path";

let workingFilePath:string = '';
export async function initiate(filePath:string): Promise<{output:string, cwd:string}> {
    const cwd = `/workspace/${filePath}`;
    console.log(cwd);
    workingFilePath = filePath;
    const res = await exec(`cd ${cwd}`);
    return {output: res.output, cwd};
}
export async function runCommand(command: string): Promise<string> {
    const cwd = `/workspace/${workingFilePath}`;
    console.log(cwd);
    try {
        let out = '';
        const timeoutPromise = new Promise<void>((resolve) => {
            setTimeout(() => {
                resolve();
            }, 500);
        });
        // @ts-ignore
        const { output } = await Promise.race([
            exec(command, { cwd, timeout: 500 }),
            timeoutPromise
        ]);
        out = output;
        return out;
    }
    catch (err) {
        return 'Unknown Command';
    }
}