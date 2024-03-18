<template>
  <div>
    <div id="terminal"></div>
  </div>
</template>

<script>
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css';

export default {
  name: 'TerminalComponent',
  mounted() {
    this.initTerminal();
  },
  methods: {
    initTerminal() {
      this.term = new Terminal();
      this.term.open(document.getElementById('terminal'));
      this.term.write('Welcome to the terminal!\r\n');

      this.term.onData((data) => {
        this.handleUserInput(data);
      });
    },
    handleUserInput(data) {
      const key = data.toString();

      if (key === '\r') { // Enter key
        this.processInput(this.inputBuffer);
        this.inputBuffer = '';
      } else if (key === '\u007f') { // Backspace key
        this.inputBuffer = this.inputBuffer.slice(0, -1);
        this.term.write('\b \b'); // Move the cursor back and overwrite the last character
      } else if (key.match(/^[\x20-\x7e]*$/)) { // Printable characters
        this.inputBuffer += key;
        this.term.write(key);
      }
    },
    processInput(input) {
      const trimmedInput = input.trim();

      switch (trimmedInput) {
        case 'clear':
          this.term.clear();
          break;
        case 'help':
          this.term.write('Available commands: clear, help, delete\r\n');
          break;
        case 'delete':
          this.term.clear();
          this.term.write('Terminal cleared.\r\n');
          break;
        default:
          this.term.write(`Unknown command: ${trimmedInput}\r\n`);
      }

      this.term.write('\r\n'); // Move to a new line
    },
  },
};
</script>