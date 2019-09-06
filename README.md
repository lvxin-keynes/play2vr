# play2vr
### 原play2VR网站的全景播放器源代码   
基于第三方开源库:gl-matrix, gl-mat4, webvr-polyfill, tween.js

### 功能特性
>WebGL实现的全景视频/图片播放器, 支持主流PC和手机/微信浏览器   
>支持球形/双球形/盒形/平面投影, 支持多码率切换   
>支持热点编辑和显示和javascript API控制   
>支持用户行为采集和播放行为统计 (统计代码后期开源)   
>支持跨域视频播放 (采用iframe和跨域通讯技术postMessage)     
>使用png图片存储和解析视频播放设置   

### 文件结构
    ├─js
    |   ├─src                            //播放器源代码(COMMONJS打包)
    |     ├─vrvideo.js                   //源代码入口    
    |   ├─play2VR.js                     //打包后的播放器代码
    |   ├─*.skin.js                      //打包后的编译器皮肤代码
    ├─docs                               //JS API文档
    ├─testcase                           //示例
    |   ├─publish                        //更多示例
    ├─utils                              
    |   ├─mangle                         //js代码混淆工具,混淆字符串和原生DOM元素
    |   ├─pre                            //js代码加前缀,比如copyright信息
    |   ├─str2png                        //字符串生成播放配置图片的工具
    
### 使用方法
```
  1. 在testcase目录中, 编写视频播放配置，比如myVideo.json
    {
        "key": "myVideo",                   //视频key, 和配置图片同名
        "skin": "default",                  //皮肤, 对应.skin.js
        "type": "sphere",                   //投影模式, 2d, sphere, cube, doublesphere
        "fullScreen": false,                //是否全屏
        "wm": false,                        //是否显示水印
        "landscapeFullscreen": false,       //横屏是否全屏
        "landscapeFullscreenVR": false,     //横屏是否全屏VR
        "track": true,                      //是否追踪播放数据
        "enableTouch": false,               //是否支持触控
        "enableGyro": false,                //是否支持陀螺仪
        "yawOnly": false,                   //是否只支持水平移动
        "loop": false,                      //是否循环播放
        "src": "myVideo.mp4",               //视频文件路径,可以是相对或绝对地址
        "status": 1,                        //视频状态, 小于1不能播放
        "hotspots": null,                   //热点数据数组
        "poster": null,                     //预览图路径
        "urls": null                        //各码率文件路径
    }  
  2．使用str2png转成视频播放配置图, [php路径]php ./str2png/str2png.php ../testcase
  3. 在网页引入play2VR.js，然后定义视频容器，比如
    <html>
    <body>
    <div play2vr="myVideo" style="width:640px;height:360px;"></div>
    <script src="/play2VR.js"></script>
    </body>
    </html>
　4. 更多的使用方法请参考docs/api.html
```
    
### 代码编译
```
  1. 本地安装node.js和php
  2. 安装依赖
    >npm install -g bundle-collapser
    
    >cd utils
    >npm install

    >cd mangle 
    >npm install

    >cd pre
    >npm install
    
  2. 打包播放器代码 npm run build (打包并混淆使用 npm run build-mangle)
  3. 打包播放器皮肤 npm run build-skin-default
```

### str2png文本转图片原理
把字符转成ascii值, 每个真彩色像素可以存储3个字符(RGB)   
优点是数据非明文存储, 并且文件更小   
前端可以通过canvas读取像素还原文本　　　

### JS代码混淆原理
bundle-collapser: 把require路径引用变成数字   
mangle-string文本混淆: 使用ECMAScript解析器提取所有文本, 然后混淆   
mangle-identity网页原生元素和函数混淆:　使用赋值别名Alias替换原生名字   
uglifyjs: 使用正则匹配（_）混淆内部变量名   
混淆采用管道的方式，每步的输出做为下步的输入   

### 著作权
软著登字第3018228号

### 开源协议
[WTFPL](http://www.wtfpl.net/)随便用