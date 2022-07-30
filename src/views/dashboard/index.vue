<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <page-tools :show-before="true">
      <template v-slot:before>
        <span>我是title</span>
      </template>
      <!-- <el-button slot="after" type="primary">导入excel</el-button> -->
      <template v-slot:after>
        <el-button type="primary" size="small">导入Excel</el-button>
        <el-button type="primary" size="small">导出Excel</el-button>
      </template>
    </page-tools>
    <upload-image></upload-image>

    <upload-excel></upload-excel>
  </div>
</template>

<script>
const obj = {
  created() {
    alert(1)
  },
}
import { mapGetters } from 'vuex'
// import PageTools from '@/components/PageTools'
export default {
  name: 'Dashboard',
  mixins: [obj],
  computed: {
    ...mapGetters(['name']),
  },
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
