<template>
  <div>
    <h1>Queues Page</h1>
    <div>
      <router-link to="/">Go back</router-link>
    </div>
    <h5>Data from GET /queues:</h5>
    <div class="results">
      <pre>{{ data }}</pre>
    </div>
  </div>
</template>

<script>
// import axios from 'axios';
import ApiService from '../services/api-service';

export default {
  data() {
    return {
      data: null,
    };
  },
  async mounted() {
    const apiService = new ApiService(this.$auth.getIdToken());
    this.data = await apiService.getQueues();
  },
};
</script>

<style>
.results {
  width: 300px;
  margin: 0 auto;
  text-align: left;
  background: #eee;
  padding: 10px;
}
</style>
