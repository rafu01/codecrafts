<template>
  <div class="body">
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
      <button class="button is-dark" @click="handleClick">Let's Go!</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import {generateRandomPhrase} from "@/services/phrasesService.js";
export default {
  name: "HomePage",
  data() {
    return {
      options: ["Node Js", "Python"],
      selectedOption: null,
      id: null
    };
  },
  mounted() {
    this.id = generateRandomPhrase();
  },
  methods: {
    handleClick() {
      if (this.selectedOption) {
        const language = this.selectedOption;
        this.onSubmit(this.id, language);
      } else {
        console.error("Please select a language.");
      }
    },
    onSubmit(id, language) {
      axios.post(`${process.env.VUE_APP_BACKEND}/project`, {id, language})
          .then(response => {
            console.log("Response from backend:", response);
          })
          .catch(error => {
            console.error("Error:", error);
          });

    }
  }
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

.body {
  text-align: center;
}

.logo {
  width: 280px;
  height: 190px;
}
</style>
