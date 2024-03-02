<template>
  <div>
    <img alt="CodeCraft logo" class="logo" src="../assets/logo.png" />
    <label class="label" for="dropdown">Select Language:</label>
    <div class="select">
      <select id="dropdown" v-model="selectedOption">
        <option disabled value="">Please select one</option>
        <option v-for="(option, index) in options" :key="index" :value="option">
          {{ option }}
        </option>
      </select>
      <br />
      <button class="button is-dark">Let's Go!</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomePage",
  data() {
    return {
      options: ["Node Js", "Python"],
      selectedOption: null,
    };
  },
};
</script>

<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

.logo {
  width: 280px;
  height: 190px;
}
</style>
