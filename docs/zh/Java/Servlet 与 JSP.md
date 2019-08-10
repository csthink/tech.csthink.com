# Servlet 与 JSP
## CGI、fast-cgi、servlet 区别

>Sun Microsystems 公司在1996年发布 Servlet 技术就是为了和 CGI 进行竞争，Servlet 是一个特殊的 Java 程序，一个基于 Java 的 Web 应用通常包含一个或多个Servlet 类。Servlet 不能够自行创建并执行，它是在 Servlet 容器中运行的，容器将用户的请求传递给 Servlet 程序，并将 Servlet 的响应回传给用户。通常一个Servlet 会关联一个或多个 JSP 页面。以前CGI经常因为性能开销上的问题被诟病，不过 Fast CGI经解决了 CGI 效率上的问题

<!-- more -->

### CGI
- Web服务器每收到一个请求，都会去 fork 一个 cgi 进程，请求结束再 kill 掉这个进程。这样假如有10000个请求，就需要 fork、kill cgi 进程10000次，带来很大的开销

### fast-cgi
- fast-cgi 每次处理完请求后，不会 kill 掉这个进程，而是保留这个进程，使这个进程可以一次处理多个请求。这样每次就不用重新 fork 一个进程了，大大提高了效率
- 比如 php-fpm 是 FastCGI 的实现，并提供了进程管理的功能,进程包含 master 进程和 worker 进程两种进程。master 进程只有一个，负责监听端口，接收来自 Web服务器的请求，而 worker 进程则一般有多个(具体数量根据实际需要配置)，每个进程内部都嵌入了一个 PHP 解释器，是 PHP 代码真正执行的地方

### servlet
- 只需要启动一个操作系统进程以及加载一个JVM，大大降低了系统的开销
- 如果多个请求需要做同样处理的时候，这时候只需要加载一个类，这也大大降低了开销
- 所有动态加载的类可以实现对网络协议以及请求解码的共享，大大降低了工作量
- Servlet 能直接和 Web服务器交互，而普通的 CGI 程序不能
- Servlet 还能在各个程序之间共享数据，使数据库连接池之类的功能很容易实现    


## Cookie 与 Session 
**背景: HTTP 是无状态的协议，所以服务端需要记录用户的状态时，就需要用某种机制来识别具体的用户，这个机制就是 Session**

### Cookie
**由服务器发给客户端的特殊信息，以文本的形式存放在客户端**
    
1. 当用户使用浏览器访问一个支持 Cookie 的网站时，用户会提供包括用户名在内的个人信息提交至服务器
2. 服务器向客户端响应相应的资源，也会将用户的个人信息回传给客户端，这些个人信息不会存放在 HTTP 响应体及 Response Body 中，而是存放在 HTTP 响应头以及 Response Header 中
3. 客户端接收到来自服务端的响应后，浏览器会将这些信息存放在一个统一的位置
4. 客户端再次请求服务器时，会把 Cookie 携带上发给服务器，这时 Cookie 存放在 Http 的请求头中
5. 服务器接收到 Cookie 后，会解析 Cookie，生成与客户端相对应的内容

	**网站登陆"记住我"的功能就是基于Cookie的实现**

### Cookie 的设置以及发送过程

```shell
Web Client				                        Web Server
		1. ===== HTTP Request =================>
		2. <==== HTTP Response + Set-Cookie =====
		3. ===== HTTP Request + Cookie =========>
		4. <==== HTTP Response ==================
```

### Session
**服务器端的机制，在服务器上保存的信息,解析客户端请求并操作 session id ,按需保存状态信息， session id 会被发送给客户端**


### **Session 的实现方式**
	
#### 方式一: 使用 Cookie 来实现
	
```shell
Web Client			                    Web Server
        ----------- Request ---------->
        <-------- Response ----------
        Set-Cookie：JSESSIONID=xxx
        --------- Request ----------->
        Cookie:JSESSIONID=xxxx
        <--------- Response ----------
```
		
#### 方式二: 使用 URL回写来实现

- 服务器发送给浏览器的所有页面中的链接中，都携带 JSESSIONID 的参数，这样浏览器发送请求时就会携带上 JSESSIONID 带回服务器
- Tomcat 同时支持 Cookie 和 URL 回写两种方式实现 Session，默认使用 Cookie

###  Cookie 和 Session 的区别?

1. Cookie 存放在客户端浏览器，Session 存在服务器上
2. Session 相对 Cookie 更安全
3. 若考虑减轻服务器负担，应使用 Cookie，Session 占用服务器空间

## get 与 post 请求的区别

- HTTP 报文层面: 
    - GET 将请求信息放在 URL(键值对)，POST 放在报文体中,需要解析，都是明文传输，安全性无太大差别，安全需要靠 HTTPS
    - 某些浏览器如 FF 等对 GET 请求的 URL 长度有限制(2048个字符)，POST 因为数据在报文体中，所以无限制
- 数据库层面:
    - GET 符合幂等性和安全性，POST不符合(有副作用)
        - 幂等性: 对数据库的一次操作与多次操作，获得的结果是一致的
        - 安全性: 指的是没有改变数据库中的数据
- 其他层面:
    - GET 可以被缓存，被存储，而 POST 不行

## Servlet
**在 Java Web 程序中，Servlet 主要负责接收用户请求 HttpServletRequest,在 doGet(),doPost() 中做相应的处理，并通过 HttpServletResponse 响应给用户**

- Java Servlet 的简称，称为小服务程序或服务连接器
- 用 Java 编写的服务器端程序
- 主要功能在与交互式地浏览和修改数据，生成动态的 web 内容

### Servlet 的使用

- 可以设置初始化参数，供 Servlet内部使用
- 一个 Servlet 类只会有一个实例，在它初始化时调用 init() 方法，销毁时调用 destroy() 方法
- Servlet 需要在 web.xml 中配置，或使用注解配置 URL，一个 Servlet 可以设置多个 URL 访问
- Servlet 不是线程安全，因此要谨慎使用类变量

### Servlet 的生命周期

**init 方法和 destroy 方法只会执行一次，service 方法客户端每次请求Servlet 都会执行**

1. Web容器加载 Servlet 并将其实例化后，Servlet 生命周期开始，容器运行其init() 方法进行 Servlet 的初始化
    - 初始化资源的代码放入init方法中 
2. 响应客户请求阶段调用 service()方法，根据请求类型去调用 doGet() 或 doPost()
3. 当服务器关闭或项目被卸载时服务器会将 Servlet 实例销毁，此阶段调用 destroy()方法
    - 销毁资源的代码放入 destroy 方法中

### 请求与响应

- 浏览器对服务器的一次访问称为一次请求，请求用 HttpServletRequest 对象表示
- 服务器给浏览器的一次反馈称为一次响应，响应用 HttpServletResponse 对象表示

### ServletContext 与 ServletConfig

- 整个 JavaWeb 工程用一个对象来表示就是 ServletContext
- web.xml 中给某一个 Servlet 配置一些信息，当服务器启动的时候，这些配置就会被加载到某一个 ServletConfig 对象中，所以 ServletConfig 表示的就是某一个 Servlet 的配置文件

### 转发(Forward)和重定向(Redirect)的区别
**转发是服务器行为，重定向是客户端行为。**

1. 实现方式
    - **转发的实现方式是 HttpServletRequest 对象中的方法**
        - ``request.getRequestDispatcher("xxx").forward(request, response);``
    - **重定向的实现方式是 HttpServletResponse 对象中的方法**
        -  ``response.sendRedirect("xxxx");``
2. 地址栏显示
    - **转发时浏览器 URL 不改变**
        - 转发是服务器请求资源,服务器直接访问目标地址的URL,把那个URL的响应内容读取过来,然后把这些内容再发给浏览器.浏览器根本不知道服务器发送的内容从哪里来的,所以它的地址栏还是原来的地址
    - **重定向时浏览器 URL 会改变**
        - 重定向是服务端根据逻辑,服务端发送一个状态码,告诉浏览器重新去请求那个地址.所以地址栏显示的是新的 URL
3. 数据共享
    - **转发页面和转发到的页面可以共享request里面的数据**
    - **重定向不能共享数据**
4. 效率
    - 转发效率高于重定向

### 自动刷新
**自动刷新不仅可以实现一段时间之后自动跳转到另一个页面，还可以实现一段时间之后自动刷新本页面**

```java
Response.setHeader("Refresh","5;URL=https://localhost:8080/servlet/example.htm"); // 5 是指时间5秒，URL就是要跳转的页面，若设置为自己的路径，实现的就是5秒自动刷新本页面一次
```

```html
<meta http-equiv="refresh" content="0;url=<%=request.getContextPath() %>/forum/list.do">
```

## JSP
**Java Server Pages，一个简化的 Servlet 设计。在 HTML 文件中插入 Java 程序和 JSP 标记（tag）,形成后缀名为(.jsp)的文件，跨平台，JSP 会被服务器处理成一个类似于Servlet 的 Java 程序，可以简化页面内容的生成**

### JSP 与 Servlet 的区别

1. JSP 本质上是简化的 Servlet,由 HTML 代码和 JSP 标签构成
2. Servlet 是由 Java 程序代码构成的，
3. Servlet 的应用逻辑是在 Java 文件中，且从表示层中的 HTML 里分离处理，MVC 架构模式中,JSP 侧重于视图，Servlet 适合用于控制逻辑

### JSP 工作原理
**HttpServlet 是先由源代码编译为 class 文件后部署到服务器下，为先编译后部署,而 JSP 则是先部署后编译**

- 客户端第一次请求 JSP 文件时,JSP 会被编译为 HttpJspPage 类
    - Servlet 类的一个子类，该类会被服务器临时存放在服务器工作目录里面
- JSP 被编译成的 .class 文件就是JSP对应的 Servlet，编译完毕后运行 class 文件来响应客户端的请求，以后再次请求的时候，Tomcat 将不再重新编译 JSP 文件，而是直接调用 class 文件来响应客户端的请求
    - 客户端第一次请求的时候 JSP 文件会被编译，所以第一次请求 JSP 时感觉比较慢，之后会感觉快很多，若将服务器上的 class文件删除，服务器也会重新编译 JSP
    
开发Web程序时经常需要修改 JSP。Tomcat 能够自动检测到 JSP 程序的改动。如果检测到J SP 源代码发生了改动。Tomcat 会在下次客户端请求 JSP 时重新编译 JSP，而不需要重启 Tomcat。这种自动检测功能是默认开启的，检测改动会消耗少量的时间，在部署 Web 应用的时候可以在 web.xml 中将它关掉

### JSP 语法
### 声明语法

- 定义成员变量，以及成员方法
- 不能直接包含程序语句

![JSP 声明语法](https://images.csthink.com/Carbonize%202019-04-09%20at%2019.37.13.png)


### 程序脚本

- 包括变量的声明、表达式和程序逻辑
- 声明的变量转换为 service 方法中的变量，因此是局部变量
- 语句块可以自由地将 Java 脚本与页面代码组合使用

![程序脚本](https://images.csthink.com/Carbonize%202019-04-09%20at%2019.45.00.png)

### JSP 注释

![JSP 注释](https://images.csthink.com/Carbonize%202019-04-09%20at%2019.47.47.png)

### JSP 内容输出表达式

![JSP 内容输出表达式](https://images.csthink.com/Carbonize%202019-04-09%20at%2019.51.45.png)

### JSP 包引入语法

![JSP 包引入语法](https://images.csthink.com/Carbonize%202019-04-09%20at%2019.54.12.png)


### JSP 内置对象

**内置对象(隐含对象，9个内置对象),不需要预先声明就可以在脚本代码和表达式中随意使用**

1. request: 封装客户端的请求，其中包含来自 GET 或 POST 请求的参数，作用域是用户的请求周期
2. response: 封装服务器对客户端的响应
3. session: 封装用户会话的对象
4. out: 输出服务器响应的输出流对象
5. application: 封装服务器运行环境的对象(服务器版本，应用级初始化参数和应用内资源绝对路径，注册信息的方式)，作用域是 web 容器的生命周期
6. page: 正在运行的由 JSP 文件产生的类对象，JSP 页面本身（相当于 Java 程序中的 this）
7. pageContext: 通过该对象可以获取其他对象
8. exception: 封装页面抛出异常的对象
9. config: Web 应用的配置对象

#### JSP 中的四大作用域

**JSP 中的四种作用域包括 page、request、session 和 application**

- page 代表与一个页面相关的对象和属性
- request 代表 Web 客户端发出的一个请求相关的对象和属性。一个请求可能跨越多个页面，涉及多个 Web 组件；需要在页面显示的临时数据可以置于此作用域
- session 代表某个用户与服务器建立的一次会话相关的对象和属性。跟某个用户相关的数据应该放在用户自己的 session 中
- application 代表整个Web应用程序相关的对象和属性，它实质上是跨越整个Web应用程序，包括多个页面、请求和会话的一个全局作用域

#### JSP 三大指令
##### page 指令

![page 指令](https://images.csthink.com/Carbonize%202019-04-09%20at%2021.56.08.png)


| 属性 | 描述 |
| --- | --- |
| buffer | 指定 out 对象使用缓冲区大小 |
| autoFlush | 控制 out 对象的缓冲区 |
| contentType | 指定当前 JSP 页面的 MIME 类型和字符编号 |
| errorPage | 指定当前 JSP 页面发生异常时需要转向的错误处理页面 |
| isErrorPage | 指定当前页面是否可以作为另一个JSP页面的错误处理页面 |
| extends | 指定 servlet 从哪一个类继承 |
| import | 导入需要使用的类 |
| info | 定义 JSP 页面的描述信息 |
| language | 指定对 JSP 页面所用的脚本语言，默认是 java |
| isThreadSafe | 指定对 JSP页面的访问是否是线程安全 |
| session | 指定 JSP 页面是否使用 session |
| isELIgnored | 指定是否执行 EL 表达式 |
| isScriptEnable | 确定脚本元素能否被使用 |


##### include 指令

![include 指令与 include 行为](https://images.csthink.com/Carbonize%202019-04-09%20at%2021.39.24.png)

###### include 指令与 include 行为的区别

- include 指令: JSP 可以通过 include 指令来包含其他文件。被包含的文件可以是 JSP 文件、HTML 文件或文本文件。包含的文件就好像是该 JSP 文件的一部分，会被同时编译执行。 语法格式如下： `<%@ include file="文件相对 url 地址" %>`

- include 行为： jsp:include 行为元素用来包含静态和动态的文件。该动作把指定文件插入正在生成的页面。语法格式如下： `<jsp:include page="相对 URL 地址" flush="true" />`

##### taglib 指令  
**taglib 指令是用来在当前 jsp 页面中导入第三方的标签库**

- prefix：指定标签前缀，这个东西可以随意起名 
- uri：指定第三方标签库的uri（唯一标识） 
当然，需要先把第三方标签库所需jar包放到类路径中

![taglib 指令](https://images.csthink.com/Carbonize%202019-04-09%20at%2021.41.27.png)

#### JSP 七大动作

- jsp:include：在页面被请求的时候引入一个文件 
- jsp:useBean：寻找或者实例化一个 JavaBean
- jsp:setProperty：设置 JavaBean 的属性
- jsp:getProperty：输出某个 JavaBean 的属性 
- jsp:forward：把请求转到一个新的页面
- jsp:plugin：根据浏览器类型为 Java 插件生成 OBJECT 或 EMBED 标记

### 附录: 内置对象常用方法
#### request 请求对象常用方法

**隐藏对象 request 是 javax.servlet.ServletRequest 类的实例，代表客户端的请求。request 包含客户端的信息以及请求的信息，如请求哪个文件，附带的地址参数等。每次客户端的请求都会产生一个 request 实例**

| 方法名 | 描述 |
| --- | --- |
| Object getAttribute(String name) | 返回由 name 指定属性的属性值 |
| Enumeration getAttributeNames() | 返回 request 对象所有属性的名字集合，结果是一个枚举的实例 |
| String getCharacterEncoding() | 返回请求中的字符编码方式 |
| int getContextLength() | 返回请求体 Body 的长度 |
| String getContentType() | 得到请求体的 MIME 类型 |
| ServletInputStream getInputStream() | 返回请求的输入流，用于获得请求中的数据 |
| String getParameter(String name) | 获得客户端传送给服务器端的有 name指定的参数值  |
| Enumeration getParameterNames() | 获得客户端传送给服务器端的所有参数的名字，结果是一个枚举的实例  |
| String[] getparameterValues(String name)  | 获得有 name 指定的参数的所有值  |
| String getProtocol()  | 获取客户端向服务器端传送数据所依据的协议名称  |
| String getScheme() | 返回请求用的计划名,如:http https及ftp等  |
| int getServerPort()  | 返回服务器端口号 |
| String getServerName() | 返回服务器主机名 |
| BufferedReader getReader() | 返回解码过了的请求体 |
| String getRemoteAddr() | 返回客户端IP地址  |
| String getRemoteHost()  | 返回客户端主机名  |
| void setAttribute(String name, Object obj)  | 设置名字为 name 的request 属性值  |
| String getRealPath(String path)  | 返回一虚拟路径的真实路径  |
| String getQueryString() | 获取查询字符串 |
| void setCharacterEncoding(“utf-8”) | 设置接受参数的字符集 |
| String getCharacterEncoding() | 返回请求体中的字符编码方式 |
| String getHeader(String name) | 返回HTTP协议定义的文件头信息 |
| String getMethod() | 获取客户端向服务器传送数据的方法 |
| HttpSession getSession() | 返回和请求相关的 Session |
| String getServletPath() | 获取客户端所请求的脚本文件的路径 |
| Cookie[] getCookies() | 返回客户端的所有 Cookie 对象，结果是 Cookie数组 |
| void removeAttribute(String name) | 删除请求中的一个属性 |


##### getAttribute 与 getParameter 的区别

- 从获取方向来看：
    - **getParameter() 是获取 POST/GET 传递的参数值**
    - **getAttribute() 是获取对象容器中的数据值**
- 从用途来看：
    - **getParameter用于客户端重定向时，即点击了链接或提交按扭时传值用，即用于在用表单或url重定向传值时接收数据用**
    - **getAttribute用于服务器端重定向时，即在 servlet 中使用了 forward 函数,或 struts 中使用了 mapping.findForward。 getAttribute 只能收到程序用 setAttribute 传过来的值**
    - **可以用 setAttribute,getAttribute 发送接收对象**
    - **getParameter 只能传字符串**

setAttribute 是应用服务器把这个对象放在该页面所对应的一块内存中去，当你的页面服务器重定向到另一个页面时，应用服务器会把这块内存拷贝另一个页面所对应的内存中。这样getAttribute就能取得你所设下的值，当然这种方法可以传对象。session也一样，只是对象在内存中的生命周期不一样而已。

getParameter只是应用服务器在分析你送上来的 request 页面的文本时，取得你设在表单或 url 重定向时的值。

总结：
getParameter 返回的是String,用于读取提交的表单中的值;（获取之后会根据实际需要转换为自己需要的相应类型，比如整型，日期类型啊等等）

getAttribute 返回的是Object，需进行转换,可用setAttribute 设置成任意对象，使用很灵活，可随时用

#### response 响应对象常用方法

**隐藏对象 response 是 javax.servlet.ServletResponse 类的实例，代表客户端的响应。服务器端的任何输出都通过 response 对象发送到客户端浏览器。每次服务器端都会响应一个 response 实例**

| 方法名 | 描述 |
| --- | --- |
| String getCharacterEncoding() | 返回响应用的是何种字符编码 |
| ServletOutputStream getOutputStream()  | 返回响应的一个二进制输出流 |
| PrintWriter getWriter()  | 返回可以向客户端输出字符的一个对象 |
| void setContentLength(int len) | 设置响应头长度 |
| void setContentType(String type) | 设置响应的 MIME 类型  |
| sendRedirect(java.lang.String location) | 重新定向客户端的请求 |
| void setCharacterEncoding("utf-8") | 设置响应头的字符集 |

#### Session 会话对象常用方法

**隐藏对象 session 是 javax.servlet.http.HttpSession 类的实例。Servlet 中通过 request.getSession()来获取 session 对象，而 JSP 中可以直接使用。如果JSP中配置了 `<%@page session=”false”%>` ,则隐藏对象 session 不可用,每个用户对应一个 session 对象**

| 方法名 | 描述 |
| --- | --- |
| long getCreationTime() | 返回Session创建时间 |
| String getId() | 返回 Session 创建时 JSP 引擎为它设的唯一ID号  |
| long getLastAccessedTime() | 返回此Session里客户端最近一次请求时间 |
| int getMaxInactiveInterval() | 返回两次请求间隔多长时间此Session被取消(ms) |
| String[] getValueNames() | 返回一个包含此Session中所有可用属性的数组 |
| void invalidate() | 取消Session,使Session不可用 |
| boolean isNew() | 返回服务器创建的一个Session,客户端是否已经加入 |
| void removeValue(String name)  | 删除Session中指定的属性 |
| void setAttribute(String key, Object obj)  | 设置Session的属性 |
| Object getAttribute(String name) | 返回session中属性名为name的对象 |

#### out 输出流对象常用方法

**隐藏对象 out 是 javax.servlet.jsp.JspWriter 类的实例服务器向客户输出的字符内容可以通过 out 对象输出。获取方法：`PrintWriter out = response.getWriter()`**

| 方法名 | 描述 |
| --- | --- |
| void clear() | 清除缓冲区的内容 |
| void clearBuffer() | 清除缓冲区的当前内容 |
| void flush() | 将缓冲区内容flush到客户端浏览器 |
| int getBufferSize() | 返回缓冲大小，单位KB |
| int getRemaining() | 返回缓冲剩余大小，单位KB |
| isAutoFlush() | 返回缓冲区满时，是自动清空还是抛出异常 |
| void close() | 关闭输出流 |


#### application 应用程序对象常用方法

**application 封装 JSP 所在 Web 应用程序的信息，例如 web.xml 中配置的全局的初始化信息。Servlet 中 application 对象需要通过ServletConfig.getServletContext() 来获取。整个 Web 应用程序对应一个application 对象**

| 方法名 | 描述 |
| --- | --- |
| Object getAttribute(String name) | 返回application中属性为name的对象 |
| Enumeration getAttributeNames() | 返回application中的所有属性名 |
| void setAttribute(String name,Object value) | 设置application属性 |
| void removeAttribute(String name) | 移除application属性 |
| String getInitParameter(String name) | 返回全局初始化函数 |
| Enumeration getInitParameterNames() | 返回所有的全局初始化参数 |
| String getMimeType(String filename) | 返回文件的文档类型 |
| String getRealPath(String relativePath) | 返回Web应用程序内相对网址对应的绝对路径 |

#### page 页面对象

**隐藏对象 page 是 javax.servlet.jsp.HttpJspPage 类的实例。page 对象代表当前 JSP 页面，是当前 JSP 编译后的 Servlet 类的对象。page 相当于 Java 类中的关键字 this**

#### pageContext 页面上下文对象

**隐藏对象 pageContext 为 javax.servlet.jsp.PageContext 类的实例。pageContext 对象代表当前 JSP 页面编译后的内容。通过 pageContext 能够获取到 JSP 中的资源**

| 方法名 | 描述 |
| --- | --- |
| JspWriter getOut() | 返回out对象 |
| HttpSession getSession() |  返回Session对象(session) |
| Object getPage() | 返回page对象 |
| ServletRequest getRequest() | 返回request对象 |
| ServletResponse getResponse() | 返回response对象 |
| void setAttribute(String name, Object attribute) | 设置属性及属性值 ，在page范围内有效 |
| void setAttribute(String name,Object obj,int scope) | 在指定范围内设置属性及属性值 ，int1=page,2=request,3=session,4=application  |
| Object getAttribute(String name) | 返回Web应用程序内相对网址对应的绝对路径 |
| Object getAttribute(String name,int scope) | 在指定范围内取属性的值 |
| Object findAttribute(String name) | 寻找一属性,返回起属性值或 NULL |
| void removeAttribute(String name) | 删除某属性 |
| void removeAttribute(String name,int scope) | 在指定范围删除某属性 |
| int getAttributeScope(String name) | 返回某属性的作用范围 |
| Enumeration getAttributeNamesInScope(int scope) | 返回指定范围内可用的属性名枚举 |
| void release() | 释放pageContext所占用的资源 |
| void forward(String relativeUrlPath) | 使当前页面转发到另一页面  |
| void include(String relativeUrlPath) | 在当前位置包含另一文件 |

#### exception

**隐藏对象 exception 为 java.lang.Exception 类的对象。exception 封装了 JSP 中抛出的异常信息。要使用 exception 隐藏对象，需要设置 `<%@page isErrorPage="true"%>`。隐藏对象 exception 通常被用来处理错误页面**

#### config

**隐藏对象 config 是 javax.servlet.ServletConfig 类的实例,ServletConfig 封装了配置在 web.xml 中初始化 JSP 的参数。JSP 中通过 config 获取这些参数。每个 JSP 文件中共有一个 config 对象**

| 方法名 | 描述 |
| --- | --- |
| String getInitParameter(String name) | 返回配置在web.xml中初始化参数 |
| Enumeration getInitParameterNames() | 返回所有的初始化参数名称 |
| ServletContext getServletContext() | 返回 ServletContext 对象 |
| String getServletName() | 返回 Servlet 对象 |
