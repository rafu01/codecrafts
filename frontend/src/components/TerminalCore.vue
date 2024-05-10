<template>
  <div class="terminal-container">
    <div class="terminal-header">
      <div class="terminal-title">Terminal</div>
    </div>
    <div ref="terminalContainer" class="terminal-view"></div>
  </div>
</template>

<script>
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';
import '../assets/xterm-custom.css';
import eventBus from "@/services/eventBus";
export default {
  name: 'TerminalComponent',
  data() {
    return {
      term: null,
      pathSuffix: '',
      inputBuffer: ''
    };
  },
  mounted() {
    this.initTerminal();
    eventBus.on('executeFileCommand', (data)=> {
      this.executeCurrentFile(data['executeFile']);
    })

  },
  beforeUnmount() {
    this.term.dispose();
  },
  methods: {
    initTerminal() {
      this.term = new Terminal({
        theme: {
          background: '#1e1e1e',
          foreground: '#abb2bf',
        },
        rendererType: 'canvas',
        rows: 24,
        cols: 80,
      });
      const fitAddon = new FitAddon();
      this.term.loadAddon(fitAddon);
      this.term.open(this.$refs.terminalContainer);
      fitAddon.fit();

      window.addEventListener('resize', () => {
        fitAddon.fit();
      });

      const id = this.$route.query;
      this.$socket.emit('requestTerminal', id, (err, dataObj)=>{
        if(err==null) {
          const {cwd} = dataObj;
          const pathArr = cwd.split('/');
          this.pathSuffix = pathArr[pathArr.length-1];
          this.term.write(this.pathSuffix+' >');
        }
      });
      this.term.onKey( e => {
        if (e.key !== '\u007f') {
          this.term.write(e.key);
          this.inputBuffer += e.key;
        }

        if (e.key === '\r') {
          this.processInput(this.inputBuffer);
          this.inputBuffer = '';
        } else if (e.key === '\u007f') {
          this.term.write('\b \b');
          if (this.inputBuffer) {
            this.inputBuffer = this.inputBuffer.slice(0, -1);
          }
        }
      })
    },
    executeCurrentFile(fileName) {
      if (fileName !== undefined && !fileName.startsWith('undefined')) {
        this.$socket.emit('executeFile', fileName, (err, outputObject) => {
          if (err == null) {
            let {output, cwd} = outputObject;
            if (output==='') {
              output = 'Invalid Command';
            }
            this.pathSuffix = cwd;
            this.term.write(`\r\n${cwd.slice(0,-1)}> ${output}\r\n${cwd.slice(0,-1)}>`);
          }
        });
      }
    },
    processInput(input) {
      if (input !== undefined && !input.startsWith('undefined')) {
        input = input.slice(0,-1);
        this.$socket.emit('executeCommand', input, (err, outputObject) => {
          if (err == null) {
            let {output, cwd} = outputObject;
            this.pathSuffix = cwd;
            cwd = cwd.endsWith('\n') ? cwd.slice(0,-1):cwd;
            this.term.write(`\r\n${cwd}> ${output}\r\n${cwd}>`);
          }
        });
      }
    },
  },
};
</script>

