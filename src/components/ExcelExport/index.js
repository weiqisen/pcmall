import downloadExcel from 'vue-json-excel/JsonExcel.vue'

const DownloadExcel = {
  install: function (Vue) {
    Vue.component('downloadExcel', downloadExcel)
  }
}

export default DownloadExcel