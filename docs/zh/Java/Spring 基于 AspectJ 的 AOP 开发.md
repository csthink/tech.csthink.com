# Spring 基于 AspectJ 的 AOP 开发

## AspectJ 
- AspectJ 是一个面向切面的框架，Spring2.0以后新增了对 AspectJ 切点表达式的支持
- @AspectJ 是 AspectJ 1.5 新增的功能，通过 JDK5 注解技术，允许直接在 Bean 类中定义切面
- Spring 建议使用 AspectJ 方式来开发 AOP
- 使用 AspectJ 需要 Spring AOP 和 AspectJ 相关的 jar 包

<!-- more -->
下面这个 maven 依赖配置是我接下来 Demo 中用到的依赖

![Maven 依赖](https://images.csthink.com/Carbonize%202019-04-11%20at%2018.00.45.png)

## 注解方式

### Spring 配置启用 @AspectJ 切面注解

![Spring 配置文件](https://images.csthink.com/Carbonize%202019-04-11%20at%2018.23.15.png)


### @AspectJ 支持的通知(增强)类型
- `@Before` 前置通知 ---> `BeforeAdvice`
- `@AfterReturning` 后置通知 ---> `AfterReturningAdvice`
- `@Around` 环绕通知 ---> `MethodInterceptor`
- `@AfterThrowing` 异常抛出通知 ---> `ThrowAdvice`
- `@After` 最终 final 通知，不管是否异常，该通知都会执行
- `@DeclareParents` 引介通知 ---> `IntroductionInterceptor`

### 定义切面类

![定义切面类](https://images.csthink.com/Carbonize%202019-04-11%20at%2018.21.25.png)


###  在通知中通过 value 属性定义切入点
 **通过 execution 函数，可以定义切入点的方法切入**
 
> 语法: execution(<访问修饰符>?<返回类型><方法名>(<参数>)<异常>)

- 匹配所有类的 public 方法 ``execution(pubic **(..))``
- 匹配指定包下所有的类所有的方法 ``execution(* com.csthink.dao.*(..))`` **不包含子包**
- ``execution(* com.csthink.dao..*(..))`` `..*` 表示包、子孙包下所有类
- 匹配指定类所有的方法 ``execution(* com.csthink.service.UserService.*(..))``
- 匹配实现特定接口  `CommonDao` 的所有类中所有的方法 ``execution(* com.csthink.dao.CommonDAO+.*(..))`` `+` 表示子类
- 匹配所有 save 开头的方法 ``execution(* save*(..))``

### 示例
该示例演示的是使用 AspectJ 注解方式开发 AOP，注解方式管理 Bean,涉及到几个文件分别是: 
- Spring 的配置文件
- 业务层接口
- 业务层实现类
- 代理类(切面类)
- 测试类

![Spring 配置文件](https://images.csthink.com/Carbonize%202019-04-11%20at%2019.09.36.png)

![目标类-接口](https://images.csthink.com/Carbonize%202019-04-11%20at%2019.10.05.png)

![实现类](https://images.csthink.com/Carbonize%202019-04-11%20at%2019.10.26.png)

![切面类](https://images.csthink.com/Carbonize%202019-04-11%20at%2021.31.54.png)

![测试类](https://images.csthink.com/Carbonize%202019-04-11%20at%2021.39.09.png)

测试结果

```
前置通知---->模拟权限校验...execution(void com.csthink.demo.demo1.UserService.save())
保存用户操作...
最终通知 ----> 模拟记录日志...
环绕前通知...
删除用户操作...
目标对象方法的返回值是: 用户删除成功
环绕后通知...
前置通知---->模拟权限校验...execution(Integer com.csthink.demo.demo1.UserService.update())
修改用户操作...
后置通知: 10
查询用户操作....
异常抛出通知: / by zero
```

### AspectJ 注解方式实现 AOP 开发小结
- 切面类中使用 `@Pointcut`为切入点命名,可以减轻维护成本,通知多个切入点可以使用 `||` 进行连接，切入点方法是 private void 无参数方法


## XML 方式

示例中的目标类接口以及接口实现类的代码结构都类似上面的例子，下面提供的是 Spring 的配置文件，切面类以及测试类

![Spring 配置文件](https://images.csthink.com/Carbonize%202019-04-11%20at%2022.02.57.png)

![切面类](https://images.csthink.com/Carbonize%202019-04-11%20at%2022.02.12.png)

![测试类](https://images.csthink.com/Carbonize%202019-04-11%20at%2022.03.35.png)

测试结果与上面使用 AspectJ 注解方式实现 AOP 的结果类似

```
前置通知---->模拟权限校验...execution(void com.csthink.demo.demo2.EmployeeService.save())
保存用户操作...
最终通知 ----> 模拟记录日志...
环绕前通知
删除用户操作...
目标对象方法的返回值是: 用户删除成功
环绕后通知
前置通知---->模拟权限校验...execution(Integer com.csthink.demo.demo2.EmployeeService.update())
修改用户操作...
后置通知10
查询用户操作....
异常抛出通知/ by zero
```
