<template>
  <div class="terminal-container">
    <div class="terminal-header">
      <div class="terminal-buttons">
        <span class="terminal-button"></span>
        <span class="terminal-button"></span>
        <span class="terminal-button"></span>
      </div>
      <div class="terminal-title">Terminal</div>
    </div>
    <div ref="terminalContainer" class="terminal-view"></div>
  </div>
</template>

<script>
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css';
import '../assets/xterm-custom.css';
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
  },
  beforeUnmount() {
    this.term.dispose();
  },
  methods: {
    initTerminal() {
      this.term = new Terminal({
        theme: {
          background: '#282c34',
          foreground: '#abb2bf',
        },
        rows: 24,
        cols: 80,
      });
      this.term.open(this.$refs.terminalContainer);
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
        if (e.key !== '\u007f') { // Only write keys that are not backspace
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
    processInput(input) {
      if (input !== undefined && !input.startsWith('undefined')) {
        this.$socket.emit('executeCommand', input, (err, outputObject) => {
          if (err == null) {
            let {output} = outputObject;
            if (output==='') {
              output = 'Invalid Command';
            }
            this.term.write(`\r\n${this.pathSuffix}> ${output}\r\n${this.pathSuffix}>`);
          }
        });
      }
    },
  },
};
</script>
