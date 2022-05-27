// 入口函数
$(function () {
    // 点击去注册账号，跳转到注册页面（隐藏登录显示注册）
    $("#link_reg").on("click", function () {
        $(".login-box").hide();
        $(".reg-box").show();

    })
    // 点击去登录，跳转到登录页面（隐藏注册显示登录）
    $("#link_login").on("click", function () {
        $(".login-box").show();
        $(".reg-box").hide();

    })

    // 从layui中获取from对象
    // layui.form是因为导入了layui.all.js文件，就会有layui这个对象（类似于导入了jquery.js就会有$这个对象）
    var form = layui.form
    var layer = layui.layer
    // 通过form.verify()函数自定义校验规则
    form.verify({
        pwd: [
            // \S表示匹配非空格的字符,相当于[^\t\r\n\v\f]
            // [] 方括号表示有一系列字符可供选择，只要匹配其中一个就可以了
            // {6,12}表示重复6到12次
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        // 校验两次密码是否一致的规则
        repwd: function (value) {
            // 通过形参拿到的是确认密码框中的内容，还需要拿到密码框中的内容;然后进行一次等于的判断，如果判断失败,则return一个提示消息即可
            var pwd = $(".reg-box [name=password]").val();
            if (pwd != value) {
                return '两次密码不一致';
            }
        }
    });

    // 监听注册表单的提交事件
    $("#form_reg").on("submit", function (e) {
        // 阻止表单的默认提交行为
        e.preventDefault();
        // 发起AJAX的POST请求
        var data = {
            username: $("#form_reg [name=username]").val(),
            password: $("#form_reg [name=password]").val()
        }
        $.post('/api/reguser', data,
            function (res) {
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                layer.msg('注册成功，请登录！')
                // 注册成后，自动跳转到登录页面
                // 模拟人点击"去登录"a链接的行为
                $("#link_login").click();
            }
        )
    })

    // 监听登录表单的提交事件
    $("#form_login").submit(function (e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/api/login',
            // 快速获取表单中的数据
            data: $(this).serialize(),
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg("登陆失败！")
                }
                layer.msg('登陆成功！')
                // 将登录成功得到的token字符串，保存到localStorage中
                localStorage.setItem('token', res.token)
                // 跳转到后台主页
                location.href = '/index.html'
            }
        })
    })
})