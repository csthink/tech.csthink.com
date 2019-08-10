# Spring 简介以及 Bean 管理

## Spring 框架的优点 
- 方便解耦，简化开发
    - Spring 就是一个大工厂，可以将所有对象的创建和依赖关系维护，交给 Spring 管理
- AOP 编程支持
    - Spring 提供面向切面编程，可以方便的实现对程序进行权限拦截，运行监控等
- 声明式事务支持
    - 只需要通过配置就可以完成对事务的管理
- 方便程序的测试
    - Spring 对 Junit4 支持，可以通过注解方便的测试程序
- 方便集成各种优秀框架
    - 内部提供了对 Struts、Hibernate、MyBatis 的直接支持
- 降低 JavaEE API 的使用难度
    - 封装了常用的一些 API(JDBC、JavaMail、远程调用等)
    
<!-- more -->

## 模块
![Spring 模块](https://images.csthink.com/spring-overview.png)
- 核心容器包括 **`spirng-core`，`spring-beans`，`spring-context`，`spring-context-support`，`spring-expressing`(SPEL,Spring表达式语言)**
- AOP：AOP 的实现和 AspectJ 的支持
- 消息：提供对基于消息应用的支持，提供与 Spring Integration 的集成
- 数据访问与集成：JDBC 访问的简化、事务的支持，ORM（Object Relation Mapping）框架（如JPA、Hibernate和 MyBatis等）与 OXM（Object XML Mapping）框架的集成
- Web：Spring MVC 的实现，能集成众多模板引擎技术（如 Thymeleaf、JSP与Velocity等）
- 测试：提供大量 Mock 对象，支持单元测试；提供 Spring Context 的测试支持，支持集成测试

## DI
**面向对象编程中，对象之间需要相互通信(一个对象需要访问另一个对象的方法或属性)。比如我们在控制器层需要访问业务层来实现特定的业务功能，业务层又需要访问持久层来完成数据的持久化操作，这里业务层类就是控制器层类的一个依赖类，持久化层也是业务层的一个依赖类，传统的做法是在控制器层自己去使用 new 一个对应的业务层实例来使用。**

```java
class LoginService() {
    public void login(String account, String password) {
        // 真正实现登录操作的业务逻辑
    }
}

class LoginController {
    private LoginService loginService;
    
    public LoginController() {
        // 这里就是传统的方式，需要的对象由自己去通过 new 去实例化
        this.loginService = new LoginService();
    }
}
```

**使用依赖注入(DI)技术，则将依赖类由外部实例化之后注入给控制器层去使用，依赖注入也称为控制反转(IOC)。当创建一个对象时，它所依赖的对象由外部传递给它，而非自己去创建所依赖的对象（比如上面的例子中通过new手动去创建一个 loginService 对象）。因此，也可以说在对象如何获取它的依赖对象这件事情上，控制权反转了。这便是控制反转和依赖注入这两个名字的由来。**

## AOP
**面向切面编程（AOP，Aspect Oriented Programming），AOP 用于解耦业务代码和公共服务代码（如日志，安全，事务等），软件开发中经常提一个词，叫做"业务逻辑"或者"业务功能"，我们的代码主要就是实现某种特定的业务逻辑。但是我们往往不能专注于业务逻辑，比如我们写业务逻辑代码的同时，还要关注事务管理、缓存、日志等一系列通用功能，如果每个业务功能都要和这些通用功能混在一起，是一件非常低效和痛苦的事情。所以，为了将业务功能的关注点和通用化功能的关注点分离开来，就需要 AOP 技术了。通用功能的代码实现，对应的就是我们说的切面（Aspect）, 简而言之，AOP 就是一种在开发时将业务相关代码和业务无关的通用功能代码有机分离，而运行时又能够整合到一起形成完整功能的一整套技术**

## Bean
**任何一个 Java 类都可以是一个 Bean**

## JavaBeans
**JavaBeans 是一种组件技术，遵循了一些特定的编码约定**

- 这个类必须具有一个公共的(public)无参构造函数
- 所有属性私有化(private)
- 私有化的属性必须通过 public 类型的方法（getter和setter）暴露给其他程序，并且方法的命名也必须遵循一定的命名规范
- 这个类应是可序列化的(比如可以实现 Serializable 接口，用于实现 bean 的持久性)

JavaBean 在 Java EE 开发中，通常用于封装数据，对于遵循以上写法的 JavaBean 组件，其它程序可以通过反射技术实例化 JavaBean 对象，并且通过反射那些遵循命名规范的方法，从而获知 JavaBean 的属性，进而调用其属性保存数据

## POJO
**POJO(Plain Old Java Object)指一个简单的普通 Java 对象，不担当任何的特殊的角色，也不实现任何 Java 框架指定的接口，说白了就是一个普通的 Java 类没有继承任何类、也没有实现任何接口，更没有被其它框架侵入的 java 对象，只拥有 private 属性以及对属性访问的 getter 和 setter 方法)，之所以提出 POJO 就是避免与基于重量级开发框架的代码区分开，比如 EJB,使用 EJB 这类框架的 java 代码都被要求按照特定的编码规范，实现特定的接口，继承特定的基类，而 POJO 就是一个普通的 Java 类，没有业务逻辑或持久化逻辑等**

## Spring Beans
**Spring维护和管理的 POJO，早先 Spring 只能管理符合 JavaBeans 规范的对象，所以称为 Spring Bean,现在只要是 POJO 就能被 Spring 容器管理起来**

## Spring IOC
- IOC(Inverse of Control): 就是将原本在程序中手动创建获取一个类的实例的控制权交由 Spring 框架管理，即对象控制权被反转到了 Spring 框架
- 依赖注入(DI): 在 Spring 框架创建 Bean 对象时，动态的将依赖对象注入到 Bean 组件

### Spring IOC 的设计原理

![Spring IOC 的设计原理](https://images.csthink.com/io.png)


## Spring 工厂类

![Spring 工厂类](https://images.csthink.com/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202019-04-10%2013.58.01.png)


- `org.springframework.beans` 和 `org.springframework.context`是 Spring IOC 容器的基础
-  容器通过读取元数据的配置(Metadata，可以是 XML 的配置文件、注解的配置或 基于 Java 代码中的配置)对 Bean 实现管理(Bean 的实例化、配置以及装配) 

![Spring 容器](https://images.csthink.com/container-magic.png)

- Spring 提供了两种不同类型的容器
    - `org.springframework.context.ApplicationContext`
    - `org.springframework.beans.factory.BeanFactory`
    -  `ApplicationContext` 容器包括了 `BeanFactory` 容器的所有功能，大部分企业级应用开发中推荐使用

| Feature | BeanFactory | ApplicationContext |
| --- | --- | --- |
| Bean instantiation/writing | Yes | Yes |
| Automatic BeanPostProcessor registration | No | Yes |
| Automatic BeanFactoryPostProcessor registration | No | Yes |
| Convenient MessageSource access(for i18n) | No | Yes |
| ApplicationEvent publication | No | Yes |


### `BeanFactory` 接口与 `ApplicationContext` 接口的区别
- `ApplicationContext` 接口继承自 `BeanFactory` 接口，Spring 核心工厂是 `BeanFactory` , `BeanFactory` 采取延迟加载，第一次 getBean 时才会初始化 Bean, 而 `ApplicationContext` 是在加载配置文件时就初始化 Bean
- `ApplicationContext` 是对 `BeanFactory` 的扩展，它可以进行国际化处理、事件传递和 Bean 自动装配以及各种不同应用层的 Context 实现，开发中基本都在使用 `ApplicationContext`, web 项目中使用 `WebApplicationContext`，很少用到 `BeanFactory`

## Spring 的 Bean 管理 - XML 方式
- 需要的依赖有 `spring-context` ,`sprint-core`, `spring-beans`, `spring-expression`
### XML 文件配置元数据
**一般都是在 classpath(即项目的 resources)路径下提供这个配置文件，文件命名无要求，一般是 applicationContext.xml 或 spring.xml**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="https://www.springframework.org/schema/beans"
    xmlns:xsi="https://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="https://www.springframework.org/schema/beans
    https://www.springframework.org/schema/beans/spring-beans.xsd">
    
    <!-- bean 标签的 id 属性是一个字符串，被用来标示 Bean，Bean 在被用于依赖类时 id 属性值也表示了当前 Bean 的引用，class 属性定义了 Bean 的类型使用类的全名称(包名.类名)  -->
    <bean id="..." class="...">
            
    </bean>
    <!-- bean 标签的 id 和 name 属性功能基本相同，除了 name 可以使用特殊字符命名 -->
    <bean name="..." class="...">
    </bean>
</beans>
```

### Spring 配置 Bean 实例化的方式
**设置 Spring 如何来实例化 Bean 类**

- 通过无参构造器实例化，类中提供了无参的构造器

```xml
<bean id="exampleBean" class="examples.ExampleBean"/>
<bean name="anotherExample" class="examples.ExampleBeanTwo"/>
```
    
- 通过静态工厂实例化

```xml
<bean id="clientService" class="examples.ClientService" factory-method="createInstance"/>
```

```java
public class ClientService {
    private static ClientService clientService = new ClientService();
    private ClientService() {}

    public static ClientService createInstance() {
        return clientService;
    }
}
```

- 通过实例工厂实例化

```xml
<!-- 创建工厂实例 serviceLocator -->
<bean id="serviceLocator" class="examples.DefaultServiceLocator">
    <!-- inject any dependencies required by this locator bean -->
</bean>

<!-- 通过工厂实例创建目标 Bean 实例，factory-bean 指工厂实例，factory-method 指的是创建目标 Bean 的方法-->
<bean id="clientService" factory-bean="serviceLocator" factory-method="createClientServiceInstance"/>

<!-- 工厂实例同时拥有创建另一个目标 Bean 实例的能力 -->
<bean id="accountService" factory-bean="serviceLocator" factory-method="createAccountServiceInstance"/>
```

```java
public class DefaultServiceLocator {

    private static ClientService clientService = new ClientServiceImpl();
    private static AccountService accountService = new AccountServiceImpl();
    
    private DefaultServiceLocator() {}

    public ClientService createClientServiceInstance() {
        return clientService;
    }
    
    public AccountService createAccountServiceInstance() {
        return accountService;
    }
}
```

注意: 给内部类实例时，class 属性应该这样定义 `com.xxx.OuterClass$InnerClass`

### Spring 的生命周期
**Spring 初始化 Bean 或销毁 Bean 时，调用 Bean 的两个生命周期方法, init-method 指定 Bean 的初始化方法,destroy-method 指定 Bean 的销毁方法**

```xml
<!-- 方法名不限定必须是 init 或 destroy -->
<!-- destroy-method 只对 scope="singleton" 有效  -->
<!-- 销毁方法，必须关闭 ApplicationContext 对象(手动调用)，才会被调用 -->
<!-- XML 文件头部声明中可以添加全局默认的初始化和销毁方法 default-init-method="init" default-destroy-method="destroy" -->
<bean id="..." class="..." init-method="init" destroy-method="destroy">
```

手动关闭 ApplicationContext的方式
![手动关闭 ApplicationContext的方式](https://images.csthink.com/Carbonize%202019-04-10%20at%2021.36.17.png)


#### Spring Bean 的完整生命周期
> Spring 只帮我们管理单例模式 Bean 的完整生命周期，对于 prototype 的 Bean ，Spring 在创建好交给使用者之后则不会再管理后续的生命周期


1. instantiate bean 对象实例化
2. populate properties 封装属性
3. 如果 Bean 实现 `BeanNameAware` 执行 `setBeanName`
4. 如果 Bean 实现 `BeanFactoryAware` 或者 `ApplicationContextAware` 设置工厂 `setBeanFactory` 或者上下文对象 `setApplicationContext`
5. 如果存在类实现 `BeanPostProcessor`，执行`postProcessBeforeInitialization`，`BeanPostProcessor` 接口提供钩子函数，用来动态扩展修改 Bean
6. 如果 Bean 实现 `InitializingBean` 执行 `afterPropertiesSet`
7. 调用 `<bean init-method="init">` 指定自定义的初始化方法 `init`
8. 如果存在类实现 `BeanPostProcessor` ，执行`postProcessAfterInitialization`
9. Bean 准备就绪，可以执行自定义业务处理
10. 如果 Bean 实现 `DisposableBean` 执行 `destroy`
11. 调用 `<bean destroy-method="customerDestroy">` 自定义的销毁方法 `customerDestroy`

- 第三步和第四步: 主要让生成的 Bean 了解 Spring 容器.
- 第五步和第八步: 允许客户在 Bean 的生成过程中对 Bean 的实例进行增强
- `BeanPostProcessor`: 工厂勾子.允许客户在生成类的过程中对类进行增强

#### Spring Bean 的作用域

```xml
<!-- Bean标签属性 scope 限制作用范围 默认:singleton -->
<bean name="..." class="..."></bean>
<bean name="..." class="..." scope="singleton"></bean>
<bean name="..." class="..." scope="prototype"></bean>
```

| 类别 | 描述 |
| --- | --- |
| singleton | 在 Spring IOC 容器中仅存在一个 Bean 实例，默认就是这个作用范围 |
| prototype | 每次调用 getBean() 时都会返回一个新的实例 |
| request | 每次 HTTP 请求都会创建一个新的 Bean,该作用域仅适用于 WebApplicationContext 环境 |
| session | 同一个 HTTP Session 共享一个 Bean,不同的 Session 使用不同的 Bean,该作用域仅适用于 WebApplicationContext 环境 |
| global session | 在一个全局的HTTP Session 中，一个 Bean 定义对应一个实例，该作用域仅适用于 WebApplicationContext 环境 |
| application | ServletContext 生命周期共享一个 Bean,该作用域仅适用于 WebApplicationContext 环境 |

###  Spring Bean 的属性 id 与 name

- 用于标示 Bean 的名称，唯一性,小驼峰方式命名 
- id 属性或 name 属性都可以用来给 Bean 命名，若 Bean 名称包含有特殊字符，只能使用 name 属性
- 可以使用 alias 元素给 Bean 起别名

```xml
<bean id="myBean" class="...">
</bean>

<alias name="myBean" alias="myAliaBean"/>
```

### Spring Bean 的属性注入
- 构造器注入(通过 `<constructor-arg>` 元素完成注入)
- set 注入(通过<property> 元素完成注入)
    - 普通 setter 的注入
    - 使用 p 名称空间实现 setter 方式简化属性注入(Spring 2.5)
    - 使用 c 名称空间实现 setter 方式的属性注入
    - SpEL 方式实现属性注入(Spring 3.0)
    - 复杂类型的属性注入

#### **Bean 的属性注入: 构造器注入**

```xml
<bean id="person" class="com.xxx.Person">
    <constructor-arg name="name" value="张三" />
    <constructor-arg name="age" value="18" />
</bean>
```

```java
public class Person {

    private String name;

    private int age;

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }
}
```

#### **Bean 的属性注入: 普通 setter 注入,类中必须有对应属性的 setter 方法**

```xml
<bean id="cat" class="com.xxx.Cat">
    <property name="name" value="kitty"/>
</bean>
```

```java
public class Cat {

    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
```

#### **Bean 的属性注入: 使用 p 名称空间实现 setter 方式的属性注入, 可简化 xml 配置，类中必须有对应属性的 setter 方法, `-ref` 表示其他 Bean 类的引用**
    
```xml
<!-- 使用前提: applicationContext.xml 配置文件头声明添加 xmlns:p="https://www.springframework.org/schema/p"-->
<bean id="cat" class="com.xxx.Cat" p:name="小花"/>
<bean id="cat" class="com.xxx.Cat" p:species-ref="波斯猫"/>
```

#### **Bean 的属性注入: 使用 c 名称空间实现 setter 方式的属性注入, 可简化 xm l配置，类中必须有对应属性的 setter 方法, `-ref` 表示其他 Bean 类的引用**
    
```xml
<!-- 使用前提: applicationContext.xml 配置文件头声明添加 xmlns:c="https://www.springframework.org/schema/c"-->
<bean id="cat" class="com.xxx.Cat" c:name="小花"/>
<bean id="cat" class="com.xxx.Cat" c:species-ref="波斯猫"/>
```

#### **Bean 的属性注入: SpEL 方式实现属性注入**

```xml
<bean id="productInfo" class="com.xxx.ProductInfo"/>

<bean id="category" class="com.xxx.Category">
    <property name="name" value="#{'服装'}"/>
</bean>

<bean id="product" class="com.xxx.Product">
    <property name="name" value="#{'上衣'}"/>
    <property name="price" value="#{productInfo.calculatePrice(199.00)}"/>
    <property name="category" value="#{category}"/>
</bean>
```

#### **Bean 的属性注入: 复杂类型的属性注入**

```xml
<bean id="..." class="...">
    <!-- 数组类型的属性注入 -->
    <property name="arr">
        <list>
            <value>...</value>
            <value>...</value>
        </list>
    </property>

    <!-- List 类型的属性注入 -->
    <property name="list">
        <list>
            <value>...</value>
            <value>...</value>
        </list>
    </property>

    <!-- Set 类型的属性注入 -->
    <property name="set">
        <set>
            <value>...</value>
            <value>...</value>
        </set>
    </property>

    <!-- Map 类型的属性注入-->
    <property name="map">
        <map>
            <entry key="key1" value="..."/>
            <entry key="key2" value="..."/>
        </map>
    </property>

    <!-- Properties 类型的属性注入 -->
    <property name="properties">
        <props>
            <prop key="...">...</prop>
            <prop key="...">...</prop>
        </props>
    </property>
</bean>
```

```java
public class xxx {

    private String[] arr;

    private List<String> list;

    private Set<String> set;

    private Map<String, Integer> map;

    private Properties properties;

    public String[] getArr() {
        return arr;
    }

    public void setArr(String[] arr) {
        this.arr = arr;
    }

    public List<String> getList() {
        return list;
    }

    public void setList(List<String> list) {
        this.list = list;
    }

    public Set<String> getSet() {
        return set;
    }

    public void setSet(Set<String> set) {
        this.set = set;
    }

    public Map<String, Integer> getMap() {
        return map;
    }

    public void setMap(Map<String, Integer> map) {
        this.map = map;
    }

    public Properties getProperties() {
        return properties;
    }

    public void setProperties(Properties properties) {
        this.properties = properties;
    }
}
```

### Spring 容器的实例化

这是一个 `services.xml`, service 层包含了一个 `PetStoreServiceImpl` 实现类，和两个 Dao 层对象

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="https://www.springframework.org/schema/beans"
    xmlns:xsi="https://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="https://www.springframework.org/schema/beans
    https://www.springframework.org/schema/beans/spring-beans.xsd">

    <!-- services -->
    <bean id="petStore" class="org.springframework.samples.jpetstore.services.PetStoreServiceImpl">
        <property name="accountDao" ref="accountDao"/>
        <property name="itemDao" ref="itemDao"/>
        <!-- additional collaborators and configuration for this bean go here -->
    </bean>

    <!-- more bean definitions for services go here -->

</beans>
```

这是一个 `daos.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="https://www.springframework.org/schema/beans"
    xmlns:xsi="https://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="https://www.springframework.org/schema/beans
    https://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="accountDao" class="org.springframework.samples.jpetstore.dao.jpa.JpaAccountDao">
        <!-- additional collaborators and configuration for this bean go here -->
    </bean>

    <bean id="itemDao" class="org.springframework.samples.jpetstore.dao.jpa.JpaItemDao">
        <!-- additional collaborators and configuration for this bean go here -->
    </bean>

    <!-- more bean definitions for data access objects go here -->

</beans>
```

Spring 容器实例化方法

![Spring 容器实例化方法](https://images.csthink.com/Carbonize%202019-04-10%20at%2014.45.28.png)

**配置文件中引入其他配置文件 `<import resource="applicationContext2.xml">`**

### 使用 Spring 容器获取 Bean 实例
使用 `T getBean(String name, Class<T> requiredType)` 方法可以获取 Bean 实例

![Spring 容器获取 Bean 实例](https://images.csthink.com/Carbonize%202019-04-10%20at%2014.51.48.png)

## Spring 的 Bean 管理 - Annotation(注解方式)
- 需要 `spring-aop` 的依赖
- 使用注解的方式必须在Spring 的配置文件中，引入 context 的约束,并开启注解扫描

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="https://www.springframework.org/schema/beans"
       xmlns:xsi="https://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="https://www.springframework.org/schema/context"
       xsi:schemaLocation="https://www.springframework.org/schema/beans
       https://www.springframework.org/schema/beans/spring-beans.xsd
       https://www.springframework.org/schema/context
       https://www.springframework.org/schema/context/spring-context.xsd">


    <!-- 开启注解扫描, 假如com.csthink 有多个子包，这样声明后就可以在所有的包中都开启注解扫描  -->
    <context:component-scan base-package="com.csthink"/>
</beans>
```

### 注解定义 Bean
- **`@Component(value="xxxx")` Spring 框架中的普通类注解，以下是一些衍生注解，根据类的角色划分,为了让标注类本身的用途清晰**
    - `@Controller(value="xxx")` 用于对 Controller 类进行标注
    - `@Service(value="xxx")` 用于对 Service 类进行标注
    - `@Repository(value="xxx")` 用于对 DAO 类进行标注

### 注解方式实现属性注入

- **`@Value` 注入普通类型的属性，若属性存在 setter 方法，应放在 setter 方法上面修饰**
    
    ```java
    @Value(value="jack")
    private String name;
    ```
- `@Autowired`
    - 默认按类型完成属性的注入，若存在两个相同的 Bean，类型相同，则按照名称注入，可以针对成员变量或 set 方法
    - required 属性，设置一定要找到匹配的 Bean
    - 使用名称的方式来完成属性的注入 `@Qulifier(value="xxx")`,注解 Bean 必须指定相同的名称
- `@Resource`
    - `@Resource(name="xxx")` 相当于 `@Autowired` 与 `@Qulifier(value="xxx")` 一起使用完成按名称的属性注入
    - Spring 提供对 JSR-250中定义 `@Resource` 标准注解的支持
- `@PostConstruct`
    - 相当于 init-method， 注意 destroy-method 使用的前提是 Bean 是在单例模式，即 scope 为 singleton
- `@PreDestroy`
    - 相当于 destroy-method

### 注解方式修改类的作用范围
- `@Scope`
    - 相当于 scope 属性
    
    ```java
    @Component("xxx")
    @Scope("prototype")
    public class xxx {
    }
    ```

### XML 配置与 注解的对比
- XML 方式，结构清晰，易于阅读
- 注解方式，开发便捷，属性注入方便

## XML和注解的整合开发，XML 用于管理 Bean,注解用于属性的注入

```xml
  <!-- 只开启属性注解 -->
  <context:annotation-config/>
  
  <bean id="..." class="...">
  </bean>
```

```java
// 类的管理使用 XML 中配置 <bean id="userService" class="">
public class Userservice {
    
    // 只使用属性注入
    @Resource(name="userDao")
    private UserDao userdao;
}

// 类的管理使用 XML 中配置 <bean id="userDao" class="">
public class UserDao {

}
```


## Spring 的 Bean 管理 - JavaConfig 方式
使用Java类作为配置文件

```java
@Configuration
public class BeanConfig {

    @Bean(name="person")
    public Person showPerson(){

        Person p = new Person();

        p.setName("jack");

        p.setAge(18);

        return p;
    }


    @Bean(name="student")
    public Student showStudent(){

        Student stud = new Student();

        stud.setName("rose");

        stud.setScore(100);

        return stud;

    }

}
```
