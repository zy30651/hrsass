// 负责管理所有自定义组件

// 指令对象
export const imageerror = {
    // 指令对象会在当前的dom元素插入到节点之后执行, options是指令中变量的解释
    inserted(dom, options) {
        // dom表示当前指令作用的dom对象
        // dom认为此时就是图片
        // 当前地址有地址，但是地址无法加载成功；会报错;会触发图片的一个事件
        // => onerror
        dom.src = dom.src || options.value
        dom.onerror = function() {
            // dom可以注册error事件
            dom.src = options.value
        }
    },
    // 钩子函数，数据更新完毕后执行; 因为inserted函数只会执行一次
    componentUpdated(dom, options) {
        dom.src = dom.src || options.value
    }
}