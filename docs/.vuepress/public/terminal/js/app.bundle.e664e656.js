(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{115:function(e,t,s){"use strict";s.r(t);var n=s(53),a=s(19),i=s.n(a),o=(s(94),s(55)),c=s.n(o),r={contact:{description:"contact author",messages:[{message:"Website: https://csthink.com"},{message:"Email: security.2009@live.cn"},{message:"Github: https://github.com/csthink"},{message:"WeChat: kcly119"},{message:"QQ: 1454591941"}]},about:{description:"About author",messages:[{message:"My name is du mingyang. I'm a programmer, You can visit my personal website at http://csthink.com to learn more about me and my GitHub page (https://github.com/csthink) to see some of the projects that I've worked on."}]}};function m(){var e=new Date,t=e.getHours(),s=e.getMinutes(),n=e.getSeconds(),a=""+t;return a+=(s<10?":0":":")+s,a+=(n<10?":0":":")+n}var u=[{time:m(),type:"info",label:"System",message:"Welcome to CSTHINK, You can also visit my GitHub page (https://github.com/csthink) to see some of the projects that I've worked on."},{time:m(),type:"info",label:"Info",message:"Initialization Start ..."},{time:m(),type:"info",label:"Info",message:"✈………………✈………………✈………………✈"}],l={echo:{description:"Echoes input",echo:function(e,t){return(t=t.split(" ")).splice(0,1),new i.a(function(s){e({time:m(),label:"Echo",type:"success",message:t.join(" ")}),s({type:"success",label:"",message:""})})}},defaultTask:{description:"this is default task.",defaultTask:function(e){var t=0;return new i.a(function(s){var n=setInterval(function(){u[t].time=m(),e(u[t]),u[++t]||(clearInterval(n),s({type:"success",label:"Success",message:"ღ Initialization Complete ..."}))},1e3)})}},open:{description:"Open a specified url in a new tab.",open:function(e,t){return new i.a(function(s,n){var a=t.split(" ")[1];a?(e({type:"success",label:"Success",message:"Opening"}),-1===t.split(" ")[1].indexOf("http")&&(a="http://"+t.split(" ")[1]),window.open(a,"_blank"),s({type:"success",label:"Done",message:"Page Opened!"})):n({type:"error",label:"Error",message:"a url is required!"})})}}},p={components:{VueTerminal:c.a},data:function(){return{taskList:l,commandList:r}}},h=s(54),g=Object(h.a)(p,function(){var e=this.$createElement,t=this._self._c||e;return t("div",{staticStyle:{margin:"-10px"},attrs:{id:"csthink-terminal-div"}},[t("vue-terminal",{staticClass:"csthink-terminal",staticStyle:{width:"100%",margin:"0 auto"},attrs:{"task-list":this.taskList,"command-list":this.commandList}})],1)},[],!1,null,"26c623e6",null).exports;new n.a({render:function(e){return e(g)}}).$mount("#root")}},[[115,1,2]]]);