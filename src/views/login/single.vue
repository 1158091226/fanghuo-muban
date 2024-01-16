<template>
  <!--  -->

  <div v-loading.fullscreen="loading" />

</template>

<script>
export default {
  components: {

  },
  filters: {
  },
  data() {
    return {
      loading: true,
      redirect: undefined
    };
  },
  computed: {
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query;
        if (query) {
          this.redirect = query.redirect;
        }
      },
      immediate: true
    }
  },
  created() {
    // 获取路由路径，生成权限路径
    const token = this.$route.query.token;
    console.log(token);

    if (token === undefined) {
      return;
    }

    this.$store.dispatch('user/setToken', token);

    setTimeout(() => {
      if (this.redirect) {
        // alert('进来了');
        this.$router.replace(this.redirect);
      } else {
        // alert('没重定向');
        this.$router.replace('/');
      }
    }, 400);
  },
  mounted() {

  },
  methods: {

  }
};
</script>
<style scoped>
</style>
