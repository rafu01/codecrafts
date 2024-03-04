<template>
    <monaco-editor height="600"
                  :language="language"
                  :code="code"
                  @mounted="onMounted"
                  @codeChange="onCodeChange"
                  :changeThrottle="500">
    </monaco-editor>
</template>

<script>

import MonacoEditor from "vue-monaco-editor";

export default {
  name: "EditorLayout",
  components: {
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
      language: "python"
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