<template>
  <div>
    <div v-if="!podCreated">
      Loading...
    </div>
    <div v-if="podCreated">
      <div class="columns">
        <div class="column is-half">
          <MegaMenu class="topbar" :model="topbarItems" aria-orientation="horizontal"></MegaMenu>
        </div>
        <div class="column is-half background-dark">
          <Button v-if="selectedFilePath" @click="executeCommand" label="Run" icon="pi pi-play"
                  class="p-button-text run-button p-button-plain"/>
        </div>
      </div>
      <div class="row">
        <div class="columns bg-card">
          <div v-if="fileTree && podCreated" class="column is-2 card primary-bg is-fullheight">
            <FileTree :file-tree="fileTree" @file-selected="fetchFileContent"></FileTree>
          </div>
          <div class="column is-8">
            <MonacoEditor :language="language"
                          :code="code"
                          @mounted="onMounted"
                          @codeChange="onCodeChange"
                          :changeThrottle="2000">
            </MonacoEditor>
          </div>
          <div v-if="fileTree && podCreated" class="column is-2 card primary-bg is-fullheight">
            <TerminalComponent></TerminalComponent>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import MonacoEditor from "vue-monaco-editor";
import MegaMenu from 'primevue/megamenu';
import Button from 'primevue/button';
import FileTree from "@/components/FileTree.vue";
import Vue from "vue";
import axios from "axios";
import TerminalComponent from "@/components/TerminalCore.vue";
import eventBus from '../services/eventBus';
import {SocketPlugin} from "@/socket";

export default {
  name: "EditorLayout",
  components: {
    TerminalComponent,
    FileTree,
    MonacoEditor,
    MegaMenu,
    Button
  },
  beforeMount() {
    const id = this.$route.query.id;
    const language = this.$route.query.language;
    axios.post(`${process.env.VUE_APP_BACKEND}/project`, {id, language})
        .then(response => {
          this.fileTree = response.data;
          this.podCreated = true;
          const idObject = this.$route.query;
          this.changeMenuItems(idObject);
          const socketUrl = `https://${idObject['id']}.${process.env.VUE_APP_WS}`;
          Vue.use(SocketPlugin, {
            url: socketUrl
          });
          Vue.prototype.$socket.open();
        })
        .catch(error => {
          console.error("Error:", error);
        });
  },
  methods: {
    onMounted(editor) {
      this.editor = editor;
    },
    onCodeChange() {
      this.$socket.emit('saveChange', this.editor.getValue(), this.selectedFilePath, (err, saved) => {
        if (err != null || !saved) {
          console.log("Saving failed", err, saved);
        }
      });
    },
    fetchFileContent(filePath) {
      console.log("filepath", filePath);
      this.$socket.emit('fetchFileContent', filePath, (err, fileContent) => {
        if (err == null) {
          this.editor.setValue(fileContent);
          this.selectedFilePath = filePath
        }
      });
    },
    changeMenuItems(id) {
      this.topbarItems[0].label = `${id['id']}`;
    },
    executeCommand() {
      const file = this.selectedFilePath.split('/');
      this.fileName = `${file[file.length - 1]}`;
      eventBus.emit('executeFileCommand', {'executeFile': this.fileName})
    }
  },
  data() {
    return {
      code: "#start your code here",
      podCreated: false,
      language: "python",
      selectedFilePath: null,
      fileTree: null,
      socket: null,
      executeFileCommand: null,
      topbarItems: [
        {
          label: 'project title', icon: 'pi pi-fw pi-folder'
        },
      ]
    };
  },
};

</script>
<style lang="less" rel="stylesheet/less">
.vtl {
  .vtl-drag-disabled {
    background-color: #d0cfcf;

    &:hover {
      background-color: #d0cfcf;
    }
  }

  .vtl-disabled {
    background-color: #d0cfcf;
  }
}
.primary-bg {
  background-color: #1e1e1e !important;
  border: 1px solid #383838;
}
.column {
  padding: 0;
}
.p-megamenu {
  padding: 15px 5px 10px 5px !important;
  border: 0 !important;
  border-bottom-right-radius: 0 !important;
}

.number {
  all: unset
}

.run-button {
  padding: 25px 5px 10px 5px !important;
}
.bg-card {
  height: 100vh !important;
}
.background-dark {
  background-color: #1e1e1e;
}
</style>

<style lang="less" rel="stylesheet/less" scoped>
.icon {
  &:hover {
    cursor: pointer;
  }
}

.topbar {
  padding: 0 0 10px 0;
}

.muted {
  color: gray;
  font-size: 80%;
}
</style>