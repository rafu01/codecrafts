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
      pathSuffix: ''
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
      this.term.onData((data) => {
        this.handleUserInput(data);
      });
    },
    handleUserInput(data) {
      const key = data.toString();

      if (key === '\r') {
        this.processInput(this.inputBuffer);
        this.inputBuffer = '';
      } else if (key === '\u007f') { // Backspace key
        this.inputBuffer = this.inputBuffer.slice(0, -1);
        this.term.write('\b \b');
      } else if (key.match(/^[\x20-\x7e]*$/)) {
        this.inputBuffer += key;
        this.term.write(key);
      }
    },
    processInput(input) {
      console.log(input);
      this.term.write(`${this.pathSuffix} >\r\n`);
    },
  },
};
</script>
