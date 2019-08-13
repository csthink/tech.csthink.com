---
title: Spring AOP 入门篇

---

[[toc]]

# Spring AOP 入门篇

## AOP

::: tip
面向切面编程（AOP，Aspect Oriented Programming），AOP 采取横向抽取机制，取代了传统纵向继承体系重复性代码，用于解耦业务代码和公共服务代码（如日志，安全，事务等）。软件开发中经常提一个词，叫做"业务逻辑"或者"业务功能"，我们的代码主要就是实现某种特定的业务逻辑。但是我们往往不能专注于业务逻辑，比如我们写业务逻辑代码的同时，还要关注事务管理、缓存、日志等一系列通用功能，如果每个业务功能都要和这些通用功能混在一起，是一件非常低效和痛苦的事情。所以，为了将业务功能的关注点和通用化功能的关注点分离开来，就需要 AOP 技术了。通用功能的代码实现，对应的就是我们说的切面（Aspect）, 简而言之，AOP就是一种在开发时将业务相关代码和业务无关的通用功能代码有机分离，而运行时又能够整合到一起形成完整功能的一整套技术
:::

### 动态代理
- 当一个对象（客户端）不能或者不想直接引用另一个对象（目标对象），这时可以应用代理模式在这两者之间构建一个桥梁 -- 代理对象
- 按照代理对象的创建时期不同，可以分为两种：
    - 静态代理: 程序中事先准备代理对象类，在程序发布前就已经存在了
    - 动态代理: 应用程序发布后，通过动态创建代理对象(JDK/Cglib 动态代理)

#### JDK 动态代理
下面是一个使用JDK动态代理的Demo,Demo 中包含了4个文件
- UserService 业务类接口
- UserServiceImpl 业务类的实现类
- UserServiceJdkProxy 业务类的代理类
- TestUserService 测试类

**注意,以下示例需要的 maven 依赖**
![maven 依赖](https://images.csthink.com/Carbonize%202019-04-11%20at%2015.46.44.png)

![接口](https://images.csthink.com/Carbonize%202019-04-11%20at%2010.07.13.png)

![实现类](https://images.csthink.com/Carbonize%202019-04-11%20at%2010.07.34.png)

![JDK 动态代理类](https://images.csthink.com/Carbonize%202019-04-11%20at%2010.14.56.png)

![测试类](https://images.csthink.com/Carbonize%202019-04-11%20at%2010.08.28.png)

test1 执行结果

```
添加操作...
删除操作...
```

test2 执行结果
```
添加操作执行前: 权限校验....
添加操作...
添加操作执行后: 记录日志...
删除操作...
```

##### JDK 实现动态代理小结
 - **代理对象和目标对象实现了相同的接口,目标对象作为代理对象的一个属性，具体接口实现中，可以在调用目标对象相应方法前后加上其他业务处理逻辑**
 - **需要指定具体的目标对象，如果为每个类都添加一个代理类的话，会导致类很多**
 - **JDK 动态代理只能针对实现了接口的类生成代理**
 
#### CGLib 动态代理

 下面是一个使用CGLIB动态代理的Demo,Demo 中包含了3个文件
    - StudentDao 持久层
    - StudentDaoCGLibProxy 持久层的代理类
    - TestStudentDao 测试类

**注意,以下示例需要的 maven 依赖**

![maven 依赖](https://images.csthink.com/Carbonize%202019-04-11%20at%2014.19.46.png)

![Dao 类](https://images.csthink.com/Carbonize%202019-04-11%20at%2010.43.51.png)

![CGLIB 动态代理类](https://images.csthink.com/Carbonize%202019-04-11%20at%2011.04.50.png)

![测试类](https://images.csthink.com/Carbonize%202019-04-11%20at%2011.05.18.png)

test1 执行结果

```
插入学生记录
删除学生记录
```

test2 执行结果

```
插入学生记录
删除操作执行前: 权限校验....
删除学生记录
删除操作执行后: 记录日志....
```

##### CGLib 实现动态代理小结
- CGLIB底层：使用字节码处理框架ASM，来转换字节码并生成新的类 
- CGLIB（CODE GENERLIZE LIBRARY）代理是针对类实现代理，主要是对指定的类生成一个子类，覆盖其中的所有方法，所以该类或方法不能声明称 final

## AOP 相关术语说明
- **Joinpoint(连接点): 那些被拦截到的点，在 Spring 中,这些点指的是方法,因为 Spring 只支持方法类型的连接点**
- **Pointcut(切入点): 我们要对哪些 Joinpoint 进行拦截的定义**
- **Advice(通知/增强): 拦截到 Joinpoint 之后所要做的事情就是通知，通知分为前置通知,后置通知,异常通知,最终通知,环绕通知(切面要完成的功能)**
- Introduction(引介): 一种特殊的通知，在不修改类代码的前提下, Introduction可以在运行期为类动态地添加一些方法或 Field
- **Target(目标对象): 代理的目标对象**
- **Weaving(织入): 把增强(通知)应用到目标对象来创建新的代理对象的过程**
     - Spring 采用动态代理织入，而 AspectJ 采用编译期织入和装载类时织入
- **Proxy（代理）: 一个类被 AOP 织入增强后，就产生一个结果代理类** 
- **Aspect(切面): 是切入点和通知（引介）的结合**

![AOP 相关术语](https://images.csthink.com/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202019-04-19%2016.37.41.png)

## Spring AOP
- **Spring AOP 使用纯 Java 实现，不需要专门的编译过程和类加载器，在运行期生成动态代理对象，通过代理的方式向目标类织入增强代码**
- **Spring AOP 底层就是通过JDK动态代理或CGLib动态代理技术为目标 Bean 执行横向织入**
    - 若目标对象实现了若干接口，Spring 默认使用 JDK 的 `java.lang.reflect.Proxy` 类代理
    - 若目标对象没有实现任何接口，Spring 使用 CGLib 库生成目标对象的子类
    - 若目标对象实现了若干接口，也可以通过配置强制使用 CGLIB 实现代理
        - Spring 的配置文件中添加 `<aop:aspectj-autoproxy proxy-target-class="true"/>`
- 程序中应优先对接口创建代理，便于程序解耦
- 标记为 `final` 的方法，不能被代理，因为无法进行覆盖
    - JDK 动态代理，是针对接口生成子类，接口中的方法不能使用 final  修饰
    - CGLib 是针对目标类生成子类，因此类或方法不能使用 final 修饰
- Spring 只支持方法连接点，不提供属性连接
- Spring 的传统 AOP 是基于 `ProxyFactoryBean`方式的代理

### Spring AOP 增强类型
- AOP 联盟为通知 `Advice` 定义了 `org.aopalliance.aop.Interface.Advice`
- Spring 按照通知`Advice`在目标类方法的连接点位置，分为5类增强类型
    - 前置通知 `org.springframework.aop.MethodBeforeAdvice`(在目标方法执行前进行增强)
    - 后置通知 `org.springframework.aop.AfterReturningAdvice`(在目标方法执行后进行增强)
    - **环绕通知 `org.aopalliance.interceptor.MethodInterceptor`(在目标方法执行前后进行增强)**
    - 异常抛出通知 `org.springframework.aop.ThrowsAdvice`（在方法抛出异常后进行增强）
    - 引介通知 `org.springframework.aop.IntroductionInterceptor`(在目标类中添加一些新的方法和属性)


### Spring AOP 切面类型
- **Advisor: 不带有切入点的切面,默认增强类中所有方法**，一般切面，Advice 本身就是一个切面，**对目标类所有方法进行拦截**
- **PointcutAdvisor: 带有切入点的切面，可以指定拦截目标类的哪些方法**
- IntroductionAdvisor: 代表引介切面，针对引介通知而使用的切面

### Spring 传统 AOP 开发 - 基于 `ProxyFactoryBean`    
#### `ProxyFactoryBean` 常用属性

- target : 代理的目标对象
- proxyInterfaces : 代理要实现的接口, 如果多个接口可以使用以下格式赋值
    
    ```xml
    <list>
         <value></value>
         ...
    </list>
    ```
            
- proxyTargetClass : 是否对类代理而不是接口，设置为 true 时，使用 CGLib 代理
- interceptorNames : 需要织入目标的Advice
- singleton : 返回代理是否为单实例，默认为单例
- optimize : 当设置为true时，强制使用 CGLib

**AOP 开发所需的 Maven 依赖**   
 
![Maven 依赖](https://images.csthink.com/Carbonize%202019-04-11%20at%2014.05.30.png)

#### 不带有切入点的切面开发
下面是一个不带有切入点的切面开发的Demo，目标类的所有方法都会被增强,不够灵活，实际开发中会采用带有切入点的切面

- Spring 配置文件(SpringDemo1.xml)

![Spring 配置文件](https://images.csthink.com/Carbonize%202019-04-11%20at%2014.10.58.png)
- 目标类(Service 及其实现类)

![目标类接口](https://images.csthink.com/Carbonize%202019-04-11%20at%2014.12.36.png)

![实现类](https://images.csthink.com/Carbonize%202019-04-11%20at%2014.12.55.png)


- 后置增强类
![后置增强类](https://images.csthink.com/Carbonize%202019-04-11%20at%2014.15.08.png)

- 测试类
![测试类](https://images.csthink.com/Carbonize%202019-04-11%20at%2014.15.56.png)

测试结果

```
添加用户...
后置通知 ---> 记录日志...
删除用户...
后置通知 ---> 记录日志...
```

#### 带有切入点的切面开发
下面是一个带有切入点切面开发的Demo，目标类只有指定方法会被增强,
这里的目标里没有实现任何接口，Spring 使用 CGLib 的方式创建动态代理

- Spring 配置文件(SpringDemo2.xml)

![Spring 配置文件](https://images.csthink.com/Carbonize%202019-04-11%20at%2014.38.20.png)


- 目标类(UserDao)

![目标类](https://images.csthink.com/Carbonize%202019-04-11%20at%2014.39.02.png)

- 环绕增强类

![环绕增强类](https://images.csthink.com/Carbonize%202019-04-11%20at%2014.39.44.png)

- 测试类

![测试类](https://images.csthink.com/Carbonize%202019-04-11%20at%2014.40.15.png)


测试结果

```
环绕前增强 --> 权限校验...
新增操作...
环绕后增强 --> 记录日志...
修改操作...
环绕前增强 --> 权限校验...
删除操作...
环绕后增强 --> 记录日志...
```

#### Spring 传统 AOP 开发 - 基于 `ProxyFactoryBean` 小结
- Spring 会根据目标类是否实现接口采用不同的代理方式
    - 实现接口: JDK 动态代理
    - 没有实现接口: CGLIB 生成代理
- 基于 `ProxyFactoryBean` 的方式生成代理配置繁琐，需要为每个需要增强的目标类都配置一个 `ProxyFactoryBean`，开发维护量巨大，解决方案是下面要谈到的自动创建代理
- 使用不带切入点的切面开发进行增强，不够灵活，实际开发中采用带有切入点的切面开发

### Spring 传统 AOP 开发 - 基于自动代理

#### 基于 Bean 名称的自动代理 -- `BeanNameAutoProxyCreator`

这个示例中的目标类以及增强通知与前面的例子中都差不多，基于 Bean 名称实现自动代理的这个例子中目标类是两个不实现接口的 Dao，这里仅列出 Spring 的配置文件以及测试类

![Spring 的配置文件](https://images.csthink.com/Carbonize%202019-04-11%20at%2015.06.33.png)
![测试类](https://images.csthink.com/Carbonize%202019-04-11%20at%2015.07.07.png)

测试结果

```
环绕前增强 --> 权限校验...
插入学生记录
环绕后增强 --> 记录日志...
环绕前增强 --> 权限校验...
删除学生记录
环绕后增强 --> 记录日志...
环绕前增强 --> 权限校验...
插入员工记录
环绕后增强 --> 记录日志...
环绕前增强 --> 权限校验...
删除员工记录
环绕后增强 --> 记录日志...
```

#### 基于切面信息的自动代理 -- `DefaultAdvisorAutoProxyCreator`

这个示例中的目标类以及增强通知与前面的例子中也差不多，目标类是两个实现接口的Dao,增强通知是两个，一是环绕增强，另一个是前置增强，以下是 Spring 的配置文件以及测试类

![Spring 的配置文件](https://images.csthink.com/Carbonize%202019-04-11%20at%2015.33.16.png)

![测试类](https://images.csthink.com/Carbonize%202019-04-11%20at%2015.35.12.png)


测试结果

```
添加商品...
环绕前增强....
删除商品...
环绕后增强....
前置增强....
添加分类...
删除分类...
```
