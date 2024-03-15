<template>
  <div>
    <MegaMenu class="topbar" :model="topbarItems" aria-orientation="horizontal">
      <template #item="{ item }">
        <a :href="item.url">{{ item.label }}</a>
      </template>
    </MegaMenu>
    <div class="row">
      <div class="columns">
        <div class="column is-2">
          <FileTree :file-tree="fileTree"></FileTree>
        </div>
        <div class="column is-10">
          <MonacoEditor height="645"
                        :language="language"
                        :code="code"
                        @mounted="onMounted"
                        @codeChange="onCodeChange"
                        :changeThrottle="500">
          </MonacoEditor>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import MonacoEditor from "vue-monaco-editor";
import MegaMenu from 'primevue/megamenu';
import FileTree from "@/components/FileTree.vue";

export default {
  name: "EditorLayout",
  props: {
    fileTree: {
      type: Array,
      required: true
    }
  },
  components: {
    FileTree,
    MonacoEditor,
    MegaMenu
  },
  methods: {
    onMounted(editor) {
      this.editor = editor;
    },
    onCodeChange() {
      console.log(this.editor.getValue());
    },
    handleItemClick(item) {
      console.log('Clicked:', item);
    }
  },
  data() {
    return {
      code: "#start your code here",
      language: "python",
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