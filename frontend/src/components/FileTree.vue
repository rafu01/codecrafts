<template>
  <div>
    <Tree :value="nodes" :filter="true" filterMode="lenient" @node-click="handleNodeClick">
    <template #default="slotProps">
      <span>{{ slotProps.node.label }}</span>
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
    console.log('data received', this.fileTree);
    this.nodes = this.fileTree;
  },
  data() {
    return {
      nodes: null
    };
  },
  methods: {
    handleNodeClick(event) {
      const node = event.node;
      console.log("here");
      if (node.icon === 'pi pi-fw pi-file') {
        this.$emit('file-selected', node.data);
      }
    }
  }
};
</script>
<style>
.p-tree-container {
  height: 566px !important;
}
</style>