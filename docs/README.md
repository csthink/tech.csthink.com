---
home: true
footer: MIT Licensed | Copyright © 2015-present CSTHINK
---

<div id="home-button-div">
  <a href="/terminal" class="home-guide-button">Make Magic</a>
</div>

## 💡 实验室

- [SSM-OA](https://github.com/csthink/SSM-OA): 基于 SSM 框架的 OA 系统
- [SPRING-CRM](https://github.com/csthink/SPRING-CRM): 基于Spring的CRM系统
- [SECOND-KILL](https://github.com/csthink/SECOND-KILL): 支持高并发的秒杀系统
- [vue-ssr](https://github.com/csthink/vue-ssr): VUE 服务端渲染案例
- [cpf](https://github.com/csthink/cpf): 瞎捣腾出来的 PHP 框架 - csthink cpf framework
- [alpha](https://github.com/csthink/alpha): 基于 Laravel 的商城项目
- [alpha-docker](https://github.com/csthink/alpha-docker): 基于 Docker 虚拟化技术，一键部署 alpha 网站项目 

## 📮 联系

- **GitHub**: [csthink](https://github.com/csthink)
- **Email**: security.2009@live.cn
- **WeChat**: kcly119
- **QQ**: 1454591941

<style scoped>
main ul {
  line-height: 2.5;
}

.show-in-github {
  display: none;
}

#home-button-div {
  text-align: center;
}

#home-button-div .home-guide-button {
    display: inline-block;
    width: 160px;
    height: 50px;
    line-height: 50px;
    font-size: 1.3rem;
    border: none;
    outline: none;
    color: #fff;
    background-color: #111;
    cursor: pointer;
    position: relative;
    z-index: 0;
    border-radius: 10px;
}

#home-button-div .home-guide-button:before {
    content: '';
    background: linear-gradient(45deg, #ff0000, #ff7300, #fffb00, #48ff00, #00ffd5, #002bff, #7a00ff, #ff00c8, #ff0000);
    position: absolute;
    top: -2px;
    left:-2px;
    background-size: 400%;
    z-index: -1;
    filter: blur(5px);
    width: calc(100% + 4px);
    height: calc(100% + 4px);
    animation: glowing 20s linear infinite;
    opacity: 0;
    transition: opacity .3s ease-in-out;
    border-radius: 10px;
}

#home-button-div .home-guide-button:active {
    color: #000
}

#home-button-div .home-guide-button:active:after {
    background: transparent;
}

#home-button-div .home-guide-button:hover:before {
    opacity: 1;
}

#home-button-div .home-guide-button:after {
    z-index: -1;
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: #111;
    left: 0;
    top: 0;
    border-radius: 10px;
}

@keyframes glowing {
    0% { background-position: 0 0; }
    50% { background-position: 400% 0; }
    100% { background-position: 0 0; }
}

</style>
