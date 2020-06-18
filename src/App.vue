<template>
  <div id="app">
    <div v-if="!activeUser">Authenticating</div>
    <div v-else>
      <div>
        <div v-if="activeUser">
          Welcome {{ activeUser.email }} -
          <a href="#" @click.prevent="logout">Logout</a>
        </div>
      </div>
      <router-view />
      <div v-if="errorMsg">
        <hr />
        <p>Error:</p>
        <p>{{ errorMsg }}</p>
      </div>
      <div v-if="activeUser">
        <hr />
        <p>ID Token:</p>
        <p>{{ activeUser.idToken }}</p>
        <p>Access Token:</p>
        <p>{{ activeUser.accessToken }}</p>
      </div>
      <div>
        <hr />
        <p>App version: {{ appVersion }}</p>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'App',
  data() {
    return {
      activeUser: null,
      errorMsg: null,
      appVersion: null,
    };
  },
  watch: {
    // everytime a route is changed refresh the activeUser
    $route() {
      this.errorMsg = null;
    },
  },
  async created() {
    console.info('[App.created] App created');
    import('../package.json').then(data => {
      this.appVersion = data.version;
    });
  },
  mounted() {
    this.activeUser = this.$auth.app.getAccount();
  },
  errorCaptured(err) {
    this.errorMsg = JSON.stringify(err);
    console.error('ERROR: ', err);
    return false;
  },
  methods: {
    async logout() {
      console.info('[App.logout] Logging out');
      await this.$auth.signOut();
      // window.location.href = 'logged-out.html';
    },
  },
};

</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
