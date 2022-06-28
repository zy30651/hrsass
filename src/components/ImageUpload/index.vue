<template>
    <div>
        <el-upload
            :on-change="changeFile"
            :on-preview="preview"
            :on-remove="handleRemove"
            :before-upload="beforeUpload"
            :http-request="upload"
            list-type="picture-card"
            :limit="1"
            action="#"
            :file-list="fileList"
            :class="{disabled: fileComputed }">
            <i class="el-icon-plus"></i>
        </el-upload>
        <el-progress v-if="showPrecent" style="width: 180px" :precentage="precent"></el-progress>
        <el-dialog :visible.sync="showDialog" title="图片预览">
            <img :src="imgUrl" style="width:100%" alt="">
        </el-dialog>
    </div>
</template>

<script>
import COS from 'cos-js-sdk-v5'

const cos = new COS({
    SecretId: '',
    SecretKey: ''
})

export default {
    data() {
        return {
            showPrecent: false,
            currentFileUid: '',
            precent: 0,
            imgUrl: '',
            showDialog: false,
            fileList: [{url: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2F1114%2F0G020114924%2F200G0114924-15-1200.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1657551787&t=6535e954e7d952d50ae52256b7d15b9b'}]
        }
    },
    computed: {
        // 设定一个计算属性 判断是否已经上传完了一张
        fileComputed() {
            return this.fileList.length === 1
        }
  },
    methods: {
        preview(file) {
            this.imgUrl = file.url
            this.showDialog = true
        },
        handleRemove(file, fileList) {
            this.fileList = fileList
            // this.fileList = this.fileList.filter(item => item.uid !== file.uid)
        },
        changeFile(file, fileList) {
            // this.fileList = fileList
            // 修改文件时触发，可以用fileList因为该方法会进来很多遍；不能每次都去push
            // fileList因为fileList参数是当前传进来的最新参数，我们只需要将其转化为数组即可
            // [] => [...fileList][] => fileList.map()
            this.fileList = fileList.map(item => item)
        },
        beforeUpload(file) {
            const types = ['image/jpeg', 'image/git', 'image/bmp', 'image/png']
            if (!types.includes(file.type)) {
                this.$message.error('上传图片只能是JPG， GIF， BMP， PNG格式')
                return false
            }
            const maxSize = 5 * 1024 * 2048
            if (maxSize < file.size) {
                this.$message.error('上传图片不能超过5M')
                return false
            }
            return true
        },
        upload(params) {
            console.log(params.file)
            cos.putObject({
                // 配置
                Bucket: 'laogao-1302806742', // 存储桶名称
                Region: 'ap-guangzhou', // 存储桶地域
                Key: params.file.name, // 文件名作为key
                StorageClass: 'STANDARD', // 此类写死
                Body: params.file, // 将本地的文件赋值给腾讯云配置
                onProgress: (params) => {
                    this.precent = params.percent * 100
                }
            }, (err, data) => {
                if (!err && data.statusCode === 200) {
                    this.fileList = this.fileList.map(item => {
                        if (item.uid === this.currentFileUid) {
                            return {url: 'http://' + data.Location, upload: true}
                        }
                        return item
                    })
                    setTimeout(() => {
                        this.showPrecent = false
                        this.percent = 0
                    }, 2000)
                }
            })
        }
    }
}
</script>

<style>
.disabled .el-upload--picture-card {
  display: none
}
</style>