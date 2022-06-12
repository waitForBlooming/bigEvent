$(function () {
    var layer = layui.layer
    var form = layui.form

    initArtCateList()
    // 获取文章分类的列表
    function initArtCateList() {
        $.ajax({
            type: 'get',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res);
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }

    // 为添加类别按钮绑定点击事件
    var indexAdd = null
    $("#btnAddCate").on("click", function () {
        var iw = window.innerWidth;
        if (iw > 766) {
            indexAdd = layer.open({//开启弹出层的时候拿到一个返回值赋值给索引变量（以便后面根据索引关掉弹出层）
                type: 1,
                area: ['500px', '250px'],
                title: '添加文章分类',
                content: $("#dialog-add").html()
            })
        } else {
            indexAdd = layer.open({//开启弹出层的时候拿到一个返回值赋值给索引变量（以便后面根据索引关掉弹出层）
                type: 1,
                area: ['90%', ''],
                title: '添加文章分类',
                content: $("#dialog-add").html()
            })
        }

    })

    // 通过事件代理的方式，为form-add表单绑定submit事件
    // $("#form-add").on("submit",function(){})//这样写是不行的（因为此时form元素还不存在），需要通过代理的形式来绑定事件（不能给form直接绑定事件，应该绑给一个已存在的元素）
    $("body").on("submit", "#form-add", function (e) {
        // 阻止表单的默认提交行为
        e.preventDefault()
        // 发起AJAX请求
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                initArtCateList()//重新渲染表格
                layer.msg('新增分类成功！')
                // 根据索引，关闭对应的弹出层
                layer.close(indexAdd)
            }
        })
    })

    // 因为编辑按钮是通过模板引擎动态添加的
    // 故而需通过代理的形式,为btn-edit按钮绑定点击事件
    var indexEdit = null
    $("tbody").on('click', '.btn-edit', function () {
        var iw = window.innerWidth;
        if (iw > 766) {
            indexEdit = layer.open({//开启弹出层的时候拿到一个返回值赋值给索引变量indexEdit（以便后面根据索引关掉弹出层）
                type: 1,
                area: ['500px', '250px'],
                title: '修改文章分类',
                content: $("#dialog-edit").html()
            })
        } else {
            indexEdit = layer.open({//开启弹出层的时候拿到一个返回值赋值给索引变量indexEdit（以便后面根据索引关掉弹出层）
                type: 1,
                area: ['90%', ''],
                title: '修改文章分类',
                content: $("#dialog-edit").html()
            })
        }


        // 只要触发了编辑按钮的点击事件，就可以获取自定义属性对应的值
        var id = $(this).attr('data-id');
        // console.log(id);
        //根据id, 发请求获取对应的文章分类数据
        $.ajax({
            method: 'GET',
            // url: '/my/article/cates/',
            // data: id,
            url: '/my/article/cates/' + id,
            success: function (res) {
                // console.log(res);
                // 如何在layui中快速为一个表单填充数据？使用lay-filter
                form.val('form-edit', res.data)
            }
        })
    })


    // 通过代理的形式，为修改分类的表单绑定submit事件
    $("body").on("submit", "#form-edit", function (e) {
        // 阻止表单的默认提交行为
        e.preventDefault()
        // 发起AJAX请求
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败！')
                }
                initArtCateList()//重新渲染表格
                layer.msg('更新分类数据成功！')
                // 根据索引，关闭对应的弹出层
                layer.close(indexEdit)
            }
        })
    })


    // 通过代理的形式,为删除按钮绑定点击事件(删除按钮也是通过模板引擎动态添加的元素，需要用到事件委托来绑定事件)
    $("tbody").on('click', '.btn-delete', function () {
        // 只要触发了编辑按钮的点击事件，就可以获取自定义属性对应的值
        var id = $(this).siblings('.btn-edit').attr('data-id');
        // 提示用户是否要删除
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function (index) {
            //根据id, 发请求删除对应的文章分类
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类数据失败！')
                    }
                    layer.msg('删除分类数据成功！')
                    layer.close(index)//关闭弹出层
                    initArtCateList()//重新渲染表格
                }
            })

        });

    })
})