<template>
  <div>
    <Tree :value="nodes" :filter="true" filterMode="lenient"/>
  </div>
</template>

<script>
import Tree from "primevue/tree";

export default {
  name: "FileTree",
  props: {
    fileTree: {
      type: Array,
      required: true
    }
  },
  components: {
    Tree,
  },
  mounted() {
    console.log('data received', this.fileTree);
    this.nodes = this.fileTree;
  },
  data() {
    return {
      nodes: null
    };
  }
};
</script>
<style>
.p-tree-container {
  height: 566px !important;
}
</style>