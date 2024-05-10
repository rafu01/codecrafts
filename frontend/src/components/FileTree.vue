<template>
  <div>
    <Tree selectionMode="single" :value="nodes" :filter="true" filterMode="lenient" @node-select="handleNodeClick">
      <template #node="{ node }">
        <span>{{ node.label }}</span>
      </template>
    </Tree>
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
    this.nodes = this.fileTree;
  },
  data() {
    return {
      nodes: null,
      selectedNodeKey: null,
    };
  },
  methods: {
    handleNodeClick(event) {
      this.selectedNodeKey = event.key;
      if (this.selectedNodeKey.slice(-1) !== '/') {
        this.$emit('file-selected', this.selectedNodeKey);
      }
    }
  }
};
</script>
<style>
.p-tree {
  border: none !important;
}
</style>