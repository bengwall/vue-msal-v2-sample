<template>
  <div>
    <h1>Profile Page</h1>
    <div>
      <router-link to="/">Go back</router-link>
    </div>
    <h5>User info from OIDC claim:</h5>
    <div>
      <h3>{{ userName }}</h3>
      <p>{{ userEmail }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userName: null,
      userEmail: null,
    };
  },
  async mounted() {
    const user = await this.$auth.getProfile();
    console.log('user:', user);
    this.userName = user.displayName;
    this.userEmail = user.mail;
  },
  methods: {
    async getProfile() {
      await this.$auth.getProfile();
    },
  },
};
</script>
