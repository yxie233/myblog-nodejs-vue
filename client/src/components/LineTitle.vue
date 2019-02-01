<template lang="html">
    <p class="line-title">
         <span class="line"></span><span class="title" v-if="title">{{title}}</span>
    </p>
</template>

<script>
export default {
    name: "LineTitle",
    props: {
        title: {
            type: String
        }
    },
    data () {
        return {};
    }
};
</script>
<style>
.line-title {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
}
.line-title .title {
  text-decoration: none;
  text-transform: uppercase;
  font-weight: bold;
  font-size: 13px;
  top: 0px;
  padding: 0 10px;
  color: #999;
  background-color: #fff;
}
.line-title .title::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 0;
  z-index: -1;
  width: 100%;
  height: 1px;
  background-color: #999;
}
</style>