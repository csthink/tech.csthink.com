(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{122:function(e,t,s){"use strict";s.r(t);var n=s(7),a=s(24),i=s.n(a),o=(s(101),s(60)),c=s.n(o),r={contact:{description:"contact author",messages:[{message:"Website: http://csthink.com"},{message:"Email: security.2009@live.cn"},{message:"Github: https://github.com/csthink"},{message:"WeChat: kcly119"},{message:"QQ: 1454591941"}]},about:{description:"About author",messages:[{message:"My name is du mingyang. I'm a programmer, You can visit my personal website at http://csthink.com to learn more about me and my GitHub page (https://github.com/csthink) to see some of the projects that I've worked on."}]},document:{description:"Document of this project.",messages:[{message:{text:"Under Construction",list:[{label:"hello",type:"error",message:"this is a test message"}]}}]}};function u(){var e=new Date,t=e.getHours(),s=e.getMinutes(),n=e.getSeconds(),a=""+t;return a+=(s<10?":0":":")+s,a+=(n<10?":0":":")+n}var l=[{time:u(),type:"info",label:"System",message:"Welcome to CSTHINK, You can also visit my GitHub page (https://github.com/csthink) to see some of the projects that I've worked on."},{time:u(),type:"info",label:"Info",message:"Initialization Start ..."},{time:u(),type:"info",label:"Info",message:"✈………………✈………………✈………………"}],m={echo:{description:"Echoes input",echo:function(e,t){return(t=t.split(" ")).splice(0,1),new i.a(function(s){e({time:u(),label:"Echo",type:"success",message:t.join(" ")}),s({type:"success",label:"",message:""})})}},defaultTask:{description:"this is default task.",defaultTask:function(e){var t=0;return new i.a(function(s){var n=setInterval(function(){l[t].time=u(),e(l[t]),l[++t]||(clearInterval(n),s({type:"success",label:"Success",message:"ღ Initialization Complete..."}))},1e3)})}},open:{description:"Open a specified url in a new tab.",open:function(e,t){return new i.a(function(s,n){var a=t.split(" ")[1];a?(e({type:"success",label:"Success",message:"Opening"}),-1===t.split(" ")[1].indexOf("http")&&(a="http://"+t.split(" ")[1]),window.open(a,"_blank"),s({type:"success",label:"Done",message:"Page Opened!"})):n({type:"error",label:"Error",message:"a url is required!"})})}}},p={components:{VueTerminal:c.a},data:function(){return{taskList:m,commandList:r}}},h=s(59),d=Object(h.a)(p,function(){var e=this.$createElement,t=this._self._c||e;return t("div",{attrs:{id:"csthink-terminal-div"}},[t("vue-terminal",{staticClass:"csthink-terminal",staticStyle:{width:"100%",margin:"0 auto"},attrs:{"task-list":this.taskList,"command-list":this.commandList}})],1)},[],!1,null,"6f0d54ec",null).exports,g=s(61);s(62),s(65);n.default.use(g.a),new n.default({render:function(e){return e(d)}}).$mount("#root")},62:function(e,t,s){},65:function(e,t,s){}},[[122,1,2]]]);