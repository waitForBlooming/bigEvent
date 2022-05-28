$(function () {
    var form = layui.form
    form.verify({
        pwd: [//数组第一项：正则表达式；数组第二项：错误提示消息
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        samePwd: function (value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能相同！'
            }
        }, rePwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码不一致！'
            }
        }
    })

    // 发起请求实现重置密码的功能
    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('更新密码失败！')
                }
                layui.layer.msg('更新密码成功！')
                // 重置表单
                // $('.layui-form')[0]，[0]表示将jQuery对象转换为原生的DOM对象
                //.reset()：调用form表单的reset方法（reset()方法是原生的DOM元素才有的方法，使用jQuery是无法调用的）
                $('.layui-form')[0].reset()
            }
        })
    })
})