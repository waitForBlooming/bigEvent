$(function () {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage;

    // 只要导入了template-web.js,就可以调用下面的方法
    // 定义美化时间的过滤器
    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }


    // 渲染表格数据
    // 定义一个查询的参数对象，将来请求数据的时候，
    // 需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 3, // 每页显示几条数据，默认每页显示2条（写多少条，服务器就响应会多少条数据）
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }
    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                // console.log(res);
                // 使用模板引擎渲染页面的数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                // 调用渲染分页的方法
                renderPage(res.total)

            }
        })
    }
    initTable()//调用一定要写到请求参数对象q的下面


    initCate()

    // 初始化文章分类下拉选择框的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                // 调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // console.log(htmlStr);
                // 通过 layui 重新渲染表单区域的UI结构
                form.render()
            }
        })
    }

    // 为筛选表单绑定submit事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        // 获取表单中选中项的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        // 为查询参数对象 q 中对应的属性赋值
        q.cate_id = cate_id
        q.state = state
        // 根据最新的筛选条件，重新渲染表格的数据
        initTable()
    })

    // 定义宣染分页的方法
    function renderPage(total) {
        // 调用laypage.render()方法来宣染分页的结构
        laypage.render({
            elem: 'pageBox',//注意，这里的 test1 是 ID，不用加 # 号
            count: total, // 总数据条数
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum, // 设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [3, 5, 8, 10],
            // 分页发生切换的时候，触发 jump 回调
            // 触发 jump 回调的方式有两种：
            // 1. 点击页码的时候，会触发 jump 回调
            // 2. 只要调用了 laypage.render() 方法，就会触发 jump 回调
            jump: function (obj, first) {
                // 可以通过 first 的值，来判断是通过哪种方式，触发的 jump 回调
                // 如果 first 的值为 true，证明是方式2触发的
                // 否则就是方式1触发的
                // console.log(obj.curr)
                // console.log(first);
                // 把最新的页码值，赋值到 q 这个查询参数对象中
                q.pagenum = obj.curr
                // 把最新的条目数，赋值到 q 这个查询参数对象的 pagesize 属性中
                q.pagesize = obj.limit
                //根据最新的q获取对应的数据列表，并渲染表格
                // initTable()//会产生死循环，无法实现分页切换的需求
                if (!first) {
                    initTable()
                }
            }
        })
    }

    // 通过代理的形式,为删除按钮绑定点击事件处理函数
    $('tbody').on('click', '.btn-delete', function () {
        // 获取删除按钮的个数（选择器会将页面上所有带有btn-delete类名的按钮选出来）
        var len = $('.btn-delete').length
        // 获取到文章的 id
        var id = $(this).attr('data-id')
        // 询问用户是否要删除数据
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')
                    if (len === 1) {
                        // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
                        // 页码值最小必须是 1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    // 当页码值减一成功以后，再调用initTabletable，就能够根据最新的页码值，获取那一页的数据了（来防止我们删除数据后所产生的bug）
                    initTable()
                }
            })

            layer.close(index)
        })
    })

    // 自己补充的功能
    // 需求：点击文章标题，弹出文章预览层
    $('tbody').on("click", "#art_preview", function () {

        var id = $(this).attr('data-id');
        $.ajax({
            method: 'GET',
            url: '/my/article/' + id,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('预览文章失败！')
                }
                // console.log(res);
                var htmlStr = template('dialog-preview', res)
                // res.data.content = $(res.data.content).text()
                // console.log(htmlStr);
                layer.open({
                    type: 1,
                    offset: '10px',
                    area: ['90%', ''],
                    title: '文章预览',
                    content: htmlStr
                })
            }
        })
    })

})