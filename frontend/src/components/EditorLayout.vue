<template>
  <div class="row">
    <div class="columns">
      <div class="column is-2">
        <FileTree></FileTree>
      </div>
      <div class="column is-10">
        <MonacoEditor height="600"
                       :language="language"
                       :code="code"
                       @mounted="onMounted"
                       @codeChange="onCodeChange"
                       :changeThrottle="500">
        </MonacoEditor>
      </div>
    </div>
  </div>
</template>

<script>

import MonacoEditor from "vue-monaco-editor";
import FileTree from "@/components/FileTree.vue";

export default {
  name: "EditorLayout",
  components: {
    FileTree,
    MonacoEditor,
  },
  methods: {
    onMounted(editor) {
      this.editor = editor;
    },
    onCodeChange() {
      console.log(this.editor.getValue());
    }
  },
  data() {
    return {
      code: "#start your code here",
      language: "python",
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
.muted {
  color: gray;
  font-size: 80%;
}
</style>