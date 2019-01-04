<template>
  <section>
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </section>
</template>

<script>
export default {
  data() {
    return {
    }
  }
}
</script>

<style>
@import './assets/reset.css';
@import './assets/viewport.css';
.loading {
  border: 0;
  outline: 0;
  background: transparent;
}
.pageLoading {
  font-size: 14px;
  color: #42bd56;
  padding-top: 30px;
  text-align: center;
}
</style>
