<template>
  <div>
    <MegaMenu class="topbar" :model="topbarItems" aria-orientation="horizontal">
      <template #item="{ item }">
        <a :href="item.url">{{ item.label }}</a>
      </template>
    </MegaMenu>
    <div class="row">
      <div class="columns">
        <div v-if="fileTree" class="column is-2">
          <FileTree :file-tree="fileTree" @file-selected="fetchFileContent"></FileTree>
        </div>
        <div class="column is-8">
          <MonacoEditor height="645"
                        :language="language"
                        :code="code"
                        @mounted="onMounted"
                        @codeChange="onCodeChange"
                        :changeThrottle="2000">
          </MonacoEditor>
        </div>
        <div class="column is-2">
          <TerminalComponent></TerminalComponent>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import MonacoEditor from "vue-monaco-editor";
import MegaMenu from 'primevue/megamenu';
import FileTree from "@/components/FileTree.vue";
import Vue from "vue";
import axios from "axios";
import TerminalComponent from "@/components/TerminalCore.vue";

export default {
  name: "EditorLayout",
  components: {
    TerminalComponent,
    FileTree,
    MonacoEditor,
    MegaMenu
  },
  beforeMount() {
    const id = this.$route.query.id;
    const language = this.$route.query.language;
    axios.post(`${process.env.VUE_APP_BACKEND}/project`, {id, language})
        .then(response => {
          this.fileTree = response.data;
        })
        .catch(error => {
          console.error("Error:", error);
        });
  },
  mounted() {
    const id = this.$route.query;
    Vue.prototype.$socket.open();
    this.$socket.emit('init', id);
  },
  methods: {
    onMounted(editor) {
      this.editor = editor;
    },
    onCodeChange() {
      this.$socket.emit('saveChange', this.editor.getValue(), this.selectedFilePath, (err, saved) => {
        console.log('changes ', saved);
      });
    },
    fetchFileContent(filePath) {
      this.$socket.emit('fetchFileContent', filePath, (err, fileContent) => {
        if(err==null) {
          this.editor.setValue(fileContent);
          this.selectedFilePath = filePath
        }
      });
    }
  },
  data() {
    return {
      code: "#start your code here",
      language: "python",
      selectedFilePath: null,
      fileTree: null,
      socket: null,
      topbarItems: [
        {
          label: 'project title', icon: 'pi pi-fw pi-folder', url: '#'
        },
        {
          label: 'Run', icon: 'pi pi-play', url: 'https://google.com'
        }
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

.column {
  padding: 0;
}

.number {
  all: unset
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