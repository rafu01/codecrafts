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

<style scoped>
.terminal-container {
  background-color: #282c34;
  color: #abb2bf;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  position: relative;
}

.terminal-header {
  display: flex;
  align-items: center;
  padding: 8px;
  background-color: #21252b;
}

.terminal-buttons {
  display: flex;
  margin-right: 8px;
}

.terminal-button {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 4px;
}

.terminal-button:nth-child(1) {
  background-color: #ff5f57;
}

.terminal-button:nth-child(2) {
  background-color: #febc2e;
}

.terminal-button:nth-child(3) {
  background-color: #28c840;
}

.terminal-title {
  font-size: 14px;
  font-weight: bold;
}

.terminal-view {
  padding: 8px;
  height: 610px;
  overflow: auto;
}
</style>