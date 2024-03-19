<template>
  <div ref="terminalContainer" style="width: 40vw; height: 400px; text-align: left;"></div>
</template>

<script>
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';

const fitAddon = new FitAddon();

function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
}

const OPTIONS_TERM = {
  useStyle: true,
  screenKeys: true,
  cursorBlink: true,
  cols: 200,
  theme: {
    background: 'black',
  },
};

export default {
  name: 'TerminalComponent',
  data() {
    return {
      term: null,
    };
  },
  mounted() {
    this.initTerminal();
  },
  // beforeUnmount() {
  //   this.$socket.off('terminal');
  // },
  methods: {
    initTerminal() {
      // if (!this.$refs.terminalContainer || !this.$socket) {
      //   return;
      // }

      this.$socket.emit('requestTerminal');
      this.$socket.on('terminal', this.terminalHandler);

      this.term = new Terminal(OPTIONS_TERM);
      this.term.loadAddon(fitAddon);
      this.term.open(this.$refs.terminalContainer);
      fitAddon.fit();

      this.term.onData((data) => {
        console.log(data);
        this.$socket.emit('terminalData', {
          data,
        });
      });

      this.$socket.emit('terminalData', {
        data: '\n',
      });
    },
    terminalHandler({ data }) {
      if (data instanceof ArrayBuffer) {
        console.error(data);
        console.log(ab2str(data));
        this.term.write(ab2str(data));
      }
    },
  },
};
</script>