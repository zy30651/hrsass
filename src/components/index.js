import PageTools from './PageTools'
import UploadExcel from './UploadExcel'
import UploadImage from './ImageUpload'
import Print from 'vue-print-nb'
export default {
    install(Vue) {
        Vue.component('UploadImage', UploadImage)
        Vue.component('PageTools', PageTools)
        Vue.component('UploadExcel', UploadExcel) // 注册导入excel组件
        Vue.use(Print)
    }
}