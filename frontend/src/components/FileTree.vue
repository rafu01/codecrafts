<template>
  <div>
    <Tree :value="nodes" :filter="true" filterMode="lenient"/>
  </div>
</template>

<script>
import Tree from "primevue/tree";

export default {
  name: "FileTree",
  components: {
    Tree,
  },
  data() {
    return {
      nodes: [
        {
          "key": "0",
          "label": "Documents",
          "data": "Documents Folder",
          "icon": "pi pi-fw pi-folder",
          "children": [{
            "key": "0-0",
            "label": "Work",
            "data": "Work Folder",
            "icon": "pi pi-fw pi-cog",
            "children": [{ "key": "0-0-0", "label": "temp.txt", "icon": "pi pi-fw pi-file", "data": "Expenses Document" }, { "key": "0-0-1", "label": "temp.doc", "icon": "pi pi-fw pi-file", "data": "Resume Document" }]
          },
            {
              "key": "0-1",
              "label": "home.json",
              "data": "Home Folder",
              "icon": "pi pi-fw pi-code",
            }]
        },
        {
          "key": "1",
          "label": "index.js"
        }
      ]
    };
  }
};
</script>
<style>
.p-tree-container {
  height: 566px !important;
}
</style>