---
title: Spring 事务管理

---

[[toc]]

# Spring 事务管理

## 数据库事务
**事务就是一组原子性的 SQL 查询，或者说一个独立的工作单元。事务内的语句，要么全部执行成功，要么全部执行失败。**

### ACID
- 原子性(Atomicity) : 整个事务中的所有操作要么全部提交成功，要么全部失败回滚。
- 一致性(Consistency) : 数据库总是从一个一致性的状态转换到另一个一致性的状态。 
- 隔离性(Isolation) : 通常来说，一个事务所做的修改在最终提交以前，对其他事务是不可见的。
- 持久性(Durability) : 一旦事务提交，则其所做的修改就会永久保存到数据库中。

### SQL 中的事务隔离级别
**SQL 标准中定义了四种隔离级别，每一种级别都规定了一个事务中所做的修改，哪些在事务内和事务间是可见的，哪些是不可见的。较低的隔离通常可以执行更高的并发，系统的开销也更低。**

| 隔离级别 | 脏读 | 不可重复读 | 幻读 | 加锁读 |
| --- | --- | --- | --- | --- |
| READ UNCOMMITED(未提交读) | Yes | Yes | Yes | No |
| READ COMMITED(提交读) | No | Yes | Yes | No |
| REPEATABLE READ(可重复读) | No | No | Yes | No |
| SERIALIZABLE(可串行化) | No | No | No | Yes |


#### 幻读与不可重复读的区别
**幻读**的重点在于**插入与删除**，即第二次查询会发现比第一次查询数据变少或者变多了，以至于给人一种幻象一样，而**不可重复读**重点在于**修改**，即第二次查询会发现查询结果比第一次查询结果不一致，即第一次结果已经不可重现了。

脏读、不可重复读、幻读的简单例子
1. 一个事务A 根据条件查询得到的结果集为 1000 条数据，同时另外一个事务 B 插入或删除了事务 A 结果集中的数据，比如删除一条数据，导致事务 A 使用同样的查询条件再次查询时，结果集的数目变少了，这时候事务A 就迷惑了，这就是出现了幻读的现象。
2. 一个事务 A 读取数据库中的一条记录，同时另外一个事务 B 修改了事务 A 读取到的那条记录，导致事务 A 再次读取同一条记录时发生了变化，这就是发生了不可重复读的现象。
3. 脏读就是事务 A 读取到了另外一个事务B 未提交事务的数据。

## Spring 事务
**Spring 事务管理就是通过 Java 代码去实现对数据库的事务性操作，以确保其满足 ACID 原则。**

###  事务的类型

1. 数据库层面划分
    - 本地事务 :  独立的一个数据库
    - 分布式事务 : 涉及两个或多个数据库的事务
2. Java 事务的类型
    - JDBC 事务 :  只能处理本地事务(即一个数据库内的事务操作)，通过 `connection` 对象管理控制。
    - JTA 事务 : Java 事务 API(Java Transaction API)，高层的，与实现无关，与协议无关的 API,**支持分布式事务，**可跨域多个数据库或多个 Dao。
    - 容器事务 : J2EE 应用服务器提供的事务管理，大多数是基于 JTA 事务，局限于 EJB 应用使用。

### 事务核心接口
**Spring 并不直接管理事务，而是提供了多种事务管理器，Spring 将事务管理的职责委托给 JDBC 、Hibernate、JPA 或 JTA 等提供了持久化机制的框架来实现。**

- **PlatformTransactionManager**:  事务管理器接口
- **TransactionDefinition** : 事务属性定义接口(事务的传播行为、隔离级别、超时、只读、回滚规则)
- **TransactionStatus** : 事务运行状态接口
    
![Spring 事务接口架构](https://images.csthink.com/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202019-04-20%2012.40.59.png)

#### 事务管理器接口( PlatformTransactionManager )

![事务管理器接口](https://images.csthink.com/Carbonize%202019-04-20%20at%2014.49.22.png)

Spring 内置的事务管理器都继承了 **AbstractPlatformTransactionManager**,而 **AbstractPlatformTransactionManager** 又实现了**PlatformTransactionManager** 接口。
Spring 框架支持事务管理的核心是事务管理器抽象，对于不同的数据访问框架通过实现策略接口**PlatformTransactionManager**，从而使得 Spring 能支持多种数据访问框架的事务管理。

- **DataSourceTransactionManager**  :  `org.springframework.jdbc.datasource` 包提供，通过调用 `java.sql.Connection` 提供对单个 `javax.sql.DataSource` 数据源的事务管理，只用于 JDBC , MyBatis 框架的事务管理。
    
    **在使用 JDBC 或 MyBatis 时，XML的参考配置:**   

    ```xml
      <bean id="dataSource" class="org.springframework.jdbc.datasource.DriverManagerDataSource">
        <property name="driverClassName" value="com.mysql.jdbc.Driver"/>
        <property name="url" value="jdbc:mysql://localhost:3306/dbName?useUnicode=true&amp;characterEncoding=utf-8"/>
        <property name="username" value="username"/>
        <property name="password" value="password"/>
      </bean>

      <bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
          <property name="dataSource" ref="dataSource"/>
      </bean>
    ```
        
- **HibernateTransactionManager** : `org.springframework.orm.hibernate3` 包提供，通过将事务管理的职责委托给 `org.hibernate.Transaction` 对象来提供对单个 `org.hibernate.SessionFactory` 的事务管理，该事务管理器只支持 Hibernate3+ 版本，且Spring3.0+ 版本只支持 Hibernate 3.2+ 版本。
- **JpaTransactionManager**  :  `org.springframework.orm.jpa` 包提供，通过一个 JPA 实体管理工厂(`javax.persistence.EntityManagerFactory` 接口的任意实现)，与由工厂所产生的 JPA EntityManager 合作来管理事务。
- **JtaTransactionManger** : `org.springframework.transaction.jta` 包提供，通过将事务管理的责任委托给 `javax.transaction.UserTransaction` 和 `javax.transaction.TransactionManager` 对象来进行事务的管理。

#### 事务属性定义接口( TransactionDefinition )
事务管理器接口 **PlatformTransactionManager ** 通过 ``getTransaction(TransactionDefinition definition)`` 方法来获取一个事务，该方法的参数是 ``TransactionDefinition`` 类型 ，这个类中定义了事务的属性。

![事务属性定义接口](https://images.csthink.com/Carbonize%202019-04-20%20at%2014.13.44.png)

##### 传播行为
**当事务方法被另一个事务方法调用时(事务嵌套的使用)，必须指定事务应该如何传播，有7种传播行为**

1. **PROPAGATION_REQUIRED** : 表示当前事务必须运行在事务中，如果当前存在事务，方法将会在该事务中运行，否则会启动一个新的事务。
2. **PROPAGATION_SUPPORTS** : 表示当前方法不需要事务上下文，但是若存在当前事务的话，那么该方法会在这个事务中运行。
3. **PROPAGATION_MANDATORY** : 表示该方法必须在事务中运行，如果当前不存在事务，则会抛出一个异常。
4. **PROPAGATION_REQUIRES_NEW** : 表示当前方法必须运行在它自己的事务中。如果当前存在事务，则会启动一个新的事务，若当前使用 JTATransactionManager 的话，在该方法执行期间，则需要访问 TransactionManager。
5. **PROPAGATION_NOT_SUPPORTED** : 表示该方法不应该运行在事务中，如果当前存在事务，在该方法运行期间，当前事务将被挂起。若当前使用 JTATransactionManager 的话，在该方法执行期间，则需要访问 TransactionManager。
6. **PROPAGATION_NEVER** : 表示当前方法不应该运行在事务上下文中。如果当前正有一个事务在运行，则会抛出异常。
7. **PROPAGATION_NESTED** : 表示如果当前已经存在一个事务，那么该方法将会在嵌套事务中运行，嵌套的食物可以独立于当前事务进行单独的提交会回滚。如果当前不存在事务，那么其行为与 PROPAGATION_REQUIRED 一样，注意各数据库厂商对这种传播行为的支持是有差异的，可以参考各资源管理器的文档来确认是否支持嵌套事务。

##### 事务隔离级别
Spring 有5种隔离级别，默认的是 ISOLATION_DEFAULT(使用数据库的默认隔离级别)，其他四种隔离级别与数据库的隔离级别一致。
- ISOLATION_DEFAULT
- ISOLATION_READ_UNCOMMITTED
- ISOLATION_READ_COMMITTED
- ISOLATION_REPEATABLE_READ
- ISOLATION_SERIALIZABLE

##### 事务超时属性
指一事务所允许执行的最长时间，单位是秒，若在指定时间内没有执行完毕，那么事务就会自动回滚。长时间的事务会不必要的占用数据库资源。

##### 事务是否只读属性
事务的只读属性是指，对事务性资源进行只读操作或者是读写操作。所谓事务性资源就是指那些被事务管理的资源，比如数据源、 JMS 资源，以及自定义的事务性资源等等。如果确定只对事务性资源进行只读操作，那么我们可以将事务标志为只读的，以提高事务处理的性能。

- 事务的是否 "只读" 属性，不同的数据库厂商支持不同
- Oracle 的 "readOnly" 不起作用，不影响其 CRUD
- MySQL 的 "readOnly" 为 true, 只能查，增删改则出异常

##### 回滚规则
默认情况下，事务只有遇到运行期异常才会回滚，而在遇到检查型异常时不会回滚。
- 作用一 : 自定义策略使得事务在遇到检查型异常时会像运行期遇到异常那样处理事务回滚
- 作用二 : 声明事务遇到特定的异常不会回滚，即时是运行期遇到异常

#### 事务运行状态接口( TransactionStatus )
**TransactionStatus** 接口用来记录事务的状态，该接口中定义了一组方法，用来获取或判断事务的状态信息。事务管理器接口 **PlatfromTransactionManager** 调用 ``getTransaction()`` 方法会返回一个 ``TransactionStatus``对象。

![事务运行状态接口](https://images.csthink.com/Carbonize%202019-04-20%20at%2014.46.07.png)

### 事务的实现方式
#### 开发准备
所有的源码都托管在了 github 上 : https://github.com/csthink/SPRING-TX 

##### 数据库准备
编程式事务我选择的是一个员工表，表结构如下
![employee 员工表](https://images.csthink.com/Carbonize%202019-04-20%20at%2022.29.22.png)

声明式事务我使用的也是一个员工表和一个部门表，员工表用于测试 tx 拦截器实现声明式事务，部门表用于测试注解方式实现的声明式事务

![employee2 员工表](https://images.csthink.com/Carbonize%202019-04-21%20at%2008.13.34.png)

![department 部门表](https://images.csthink.com/Carbonize%202019-04-21%20at%2008.14.15.png)


##### java 文件
这里准备了一个 Employee 表的实体文件，一个操作 Employee 表的 Dao 接口以及其实现类，还有一个相应的测试类文件

##### Maven 依赖
![编程式事务依赖](https://images.csthink.com/Carbonize%202019-04-20%20at%2022.23.50.png)

声明式事务依赖，需要在编程式事务依赖的基础上添加两个依赖，一个是 DBCP 数据库连接池的依赖，数据源配置的时候，可以不使用，也可以直接使用 C3P0 或直接使用 jdbc 的数据源配置即可，声明式事务的 tx 拦截器的方式需要配合 AOP 实现，所以需要添加 AspectJ 的依赖

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.csthink</groupId>
    <artifactId>spring-tx</artifactId>
    <version>1.0-SNAPSHOT</version>

    <dependencies>
        <!-- Spring 基础依赖,包含了 spring-core spring-beans spring-aop spring-expression spring-tx -->
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-context</artifactId>
            <version>4.3.1.RELEASE</version>
        </dependency>
        <!-- MySQL 驱动支持 -->
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>5.1.47</version>
        </dependency>
        <!-- C3P0 数据库连接池 -->
        <dependency>
            <groupId>com.mchange</groupId>
            <artifactId>c3p0</artifactId>
            <version>0.9.5.4</version>
        </dependency>
        <!-- DBCP 数据库连接池 -->
        <dependency>
            <groupId>org.apache.commons</groupId>
            <artifactId>commons-dbcp2</artifactId>
            <version>2.6.0</version>
        </dependency>
        <!-- Spring JDBC Template 所需的依赖 -->
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-jdbc</artifactId>
            <version>4.3.1.RELEASE</version>
        </dependency>
        <!-- Junit 单元测试依赖 -->
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.12</version>
        </dependency>
        <!-- Spring 与 Junit 的整合 -->
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-test</artifactId>
            <version>4.3.1.RELEASE</version>
        </dependency>
        <!-- Spring 基于 AspectJ 开发 AOP 的依赖 -->
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-aspects</artifactId>
            <version>4.3.1.RELEASE</version>
        </dependency>
    </dependencies>
</project>
```

##### Spring 配置文件
![编程式事务 xml 配置 Spring.xml](https://images.csthink.com/Carbonize%202019-04-20%20at%2022.26.12.png)

#### 编程式事务

##### 使用事务管理器方式实现编程式事务 ( PlatformTransactionManager)
![事务管理器方式](https://images.csthink.com/Carbonize%202019-04-20%20at%2022.54.54.png)

##### 使用模板事务实现编程式事务( TransactionTemplate ) 推荐
![模板事务方式](https://images.csthink.com/Carbonize%202019-04-20%20at%2022.59.29.png)

![测试类](https://images.csthink.com/Carbonize%202019-04-20%20at%2023.01.31.png)

#### 声明式事务
由于编程式事务每个需要事务的场景中都需要单独的实现，可复用性低，声明式事务属于无侵入式实现，声明式事务的实现方式常用的主要有两种方式: tx 拦截器以及全注解方式实现。
##### 使用 tx 拦截器方式实现声明式事务
这种方式，只需要在 Spring 的配置文件中配置即可，代码中不需要任何特殊处理，下面是一个 xml 配置

```xml
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xmlns:tx="http://www.springframework.org/schema/tx"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
    http://www.springframework.org/schema/beans/spring-beans.xsd
    http://www.springframework.org/schema/context
    http://www.springframework.org/schema/context/spring-context.xsd
    http://www.springframework.org/schema/aop
    http://www.springframework.org/schema/aop/spring-aop.xsd
    http://www.springframework.org/schema/tx
    http://www.springframework.org/schema/tx/spring-tx.xsd">

    <!-- spring IOC 开启全局扫描 -->
    <context:component-scan base-package="com.csthink"/>

    <!-- 数据库连接属性配置文件 -->
    <bean id="propertyConfigurer" class="org.springframework.beans.factory.config.PropertyPlaceholderConfigurer">
        <property name="location" value="classpath:database.properties"/>
    </bean>
    <!-- 数据源配置使用 DBCP 数据库连接池 -->
    <bean id="dataSource" class="org.apache.commons.dbcp2.BasicDataSource" destroy-method="close">
        <property name="driverClassName" value="${driver}"/>
        <property name="url" value="${url}"/>
        <property name="username" value="${username}"/>
        <property name="password" value="${password}"/>
    </bean>
    <!-- jdbcTemplate -->
    <bean id="jdbcTemplate" class="org.springframework.jdbc.core.JdbcTemplate">
        <property name="dataSource" ref="dataSource"/>
    </bean>
    <!-- 声明式事务 -->
    <!-- JDBC 事务管理器 -->
    <bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
        <property name="dataSource" ref="dataSource"/>
    </bean>
    <!-- 配置事务增强，通过事务通知的方式实现事务 -->
    <tx:advice id="txAdvice" transaction-manager="transactionManager">
        <!-- 切入点中哪些方法需要过滤 -->
        <tx:attributes>
            <!-- 可选属性配置
              name:方法名称，将匹配的方法注入事务管理，可用通配符
              propagation:事务传播行为
              isolation:事务隔离级别，默认为“DEFAULT”
              read-only:是否只读，默认为 false，表示不是只读
              timeout:事务超时时间，单位为秒，默认 -1，表示事务超时将依赖于底层事务系统
              rollback-for:需要触发回滚的异常定义，可定义多个，以逗号","分割，默认任何 RuntimeException 都将导致事务回滚，而任何 Checked Exception 将不导致事务回滚
              no-rollback-for:不被触发进行回滚的 Exception(s)；可定义多个，以逗号","分割
             -->
            <!-- 设置进行事务操作的方法匹配规则 -->
            <!-- 以 get/find/search 开头的所有方法设置为只读事务 -->
            <tx:method name="get*" read-only="true"/>
            <tx:method name="find*" read-only="true"/>
            <tx:method name="search*" read-only="true"/>
            <!-- 其它方法使用默认事务设置 -->
            <tx:method name="*"/>
        </tx:attributes>
    </tx:advice>
    <!-- 切面配置 -->
    <aop:config>
        <!-- 切入点配置: com.csthink.service 包下任意类任意个数的参数的方法都会被过滤 -->
        <aop:pointcut id="txPointcut" expression="execution(* com.csthink.service.*.*(..))"/>
        <!-- 通知与切入点关联 -->
        <aop:advisor advice-ref="txAdvice" pointcut-ref="txPointcut"/>
    </aop:config>
</beans>
```

##### 使用注解的方式实现声明式事务
使用注解的方式实现事务，需要在 Spring 的 xml 配置文件中开启注解事务的声明，每个需要使用事务的类或方法上可以使用 ``@Transactional`` 注解即可

下面是使用注解方式实现声明式事务的配置：

```xml
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:tx="http://www.springframework.org/schema/tx"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
    http://www.springframework.org/schema/beans/spring-beans.xsd
    http://www.springframework.org/schema/context
    http://www.springframework.org/schema/context/spring-context.xsd
    http://www.springframework.org/schema/tx
    http://www.springframework.org/schema/tx/spring-tx.xsd">

    <!-- spring IOC 开启全局扫描 -->
    <context:component-scan base-package="com.csthink"/>

    <!-- 数据源配置 -->
    <bean id="dataSource" class="org.springframework.jdbc.datasource.DriverManagerDataSource">
        <property name="driverClassName" value="com.mysql.jdbc.Driver"/>
        <property name="url" value="jdbc:mysql://localhost:3306/jdbc?useUnicode=true&amp;characterEncoding=utf8"/>
        <property name="username" value="root"/>
        <property name="password" value="root"/>
    </bean>
    <!-- jdbcTemplate -->
    <bean id="jdbcTemplate" class="org.springframework.jdbc.core.JdbcTemplate">
        <property name="dataSource" ref="dataSource"/>
    </bean>

    <!-- 声明式事务 -->
    <!-- JDBC 事务管理器 -->
    <bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
        <property name="dataSource" ref="dataSource"/>
    </bean>
    <!-- 开启事务注解，通过事务注解的方式实现事务 -->
    <tx:annotation-driven transaction-manager="transactionManager" />
</beans>
```

![@Transaction 用法](https://images.csthink.com/Carbonize%202019-04-21%20at%2007.52.27.png)

[源码下载](https://github.com/csthink/SPRING-TX)
