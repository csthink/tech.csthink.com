# JDBC 入门

> 处理 Java 应用程序中不同数据库的访问问题：可以通过它建立与数据库的连接；定义特定的客户端使之可以访问给定的数据库；提供一种能够读取、插入、更新和删除数据库中的数据项的机制；以及控制由不同SQL语句组成的事务。

<!-- more -->

## JDBC 用法
- 创建并建立与特定数据库的连接
    - 通过 **Driver Manger** 连接(`java.sql.DriveManager`)
    - 通过 **JDBC 数据源连接池** 连接(`javax.sql.DataSource`)
- 建立连接后使用 `java.sql.Connection` 执行 CRUD(create/read/update/delete)操作
    - 为了执行这些操作，可以使用 `java.sql.Statement` 对象或 `java.sql.PreparedStatement` 对象。预编译对象 `java.sql.PreparedStatement` 对于多次执行相同的语句效率会高一些，且预编译机制可以阻止 SQL 注入
    
## 数据库连接池
**通常情况下，JDBC 使用连接池来管理数据库连接。连接池有很多不同的实现方式，比如 C3P0 或 DBCP。数据库连接池是一组 JDBC 连接，当应用程序请求连接时，它会分配一个空闲连接；当应用中有任务终结时，它会释放相应的连接。**

## 数据类型
**JDBC 在使用 Java 程序中的数据之前，JDBC 会将 Java 数据类型转换成相对应的 JDBC 数据类型，它们之间有一个默认的对应关系，能够保证在不同的数据库实现和驱动之间的一致性。**


| SQL | JDBC/Java | setter | getter |
| --- | --- | --- | --- |
| VARCHAR | java.lang.String | setString | getString |
| CHAR | java.lang.String | setString | getString |
| LONGVARCHAR | java.lang.String | setString | getString |
| BIT | boolean | setBoolean | getBoolean |
| NUMERIC | BigDecimal | setBigDecimal | getBigDecimal |
| TINYINT | byte | setByte | getByte |
| SMALLINT | short | setShort | getShort |
| INTEGER | int | setInt | getInt |
| BIGINT | long | setLong | getLong |
| REAL | float | setFloat | getFloat |
| FLOAT | float | setFloat | getFloat |
| DOUBLE | double | setDouble | getDouble |
| VARBINARY | byte[] | setBytes | getBytes |
| BINARY | byte[] | setBytes | getBytes |
| DATE | java.sql.Date | setDate | getDate |
| DATETIME | java.sql.Timestamp | setTimestamp  | getTimestamp  |
| TIMESTAMP | java.sql.Timestamp | setTimestamp | getTimestamp |
| CLOB | java.sql.Clob | setClob | getClob |
| BLOB | java.sql.Blob | setBlob | getBlob |
| ARRAY | java.sql.Array | setARRAY | getARRAY |
| REF | java.sql.Ref | setRef | getRef |
| STRUCT | java.sql.Struct | setStruct | getStruct |

**SQL 和 Java 对于空值（null）有不同的处理方式。在使用SQL处理一些Java 中的空值时，我们最好能够遵循一些最佳实践，比如避免使用基本数据类型，因为它们默认值不能为空而是会依据具体类型设定默认值，比如int型默认值为0、布尔型（boolean）默认值为false，建议使用包装类**

## SQL 日期类型的处理
1. 字段类型为 `Date`
    使用 `java.sql.Date.valueOf(java.lang.String)` 格式是 YYYY-MM-dd
    
    ```java
    ps.setDate(2, java.sql.Date.valueOf("2019-03-04"));
    // 设置为当前日期
    // 方式一: 
    ps.setDate(2, new java.sql.Date(System.currentTimeMillis()));
    // 方式二: 
    ps.setDate(2, new java.sql.Date(new Date().getTime());
    ```
    
2. 字段类型为 `TIMESTAMP` 或 `DATETIME`
    使用 `java.sql.Timestamp.valueOf(java.lang.String)`
    
    ```java
    ps.setTimestamp(2, java.sql.Timestamp.valueOf("2019-03-04 13:30:00");
    // 设置为当前时间
      // 方式一:
    ps.setTimestamp(2, new java.sql.Timestamp(new Date().getTime()));
    
    // 方式二:
    ps.setTimestamp(2, new java.sql.Timestamp(System.currentTimeMillis()));

    // Java 8 
    ps.setTimestamp(2, java.sql.Timestamp.from(java.time.Instant.now()));
    ps.setTimestamp(2, java.sql.Timestamp.valueOf(java.time.LocalDateTime.now()));
    
    LocalDate localDate = LocalDate.now(ZoneId.of("Asia/Shanghai"));
myPreparedStatement.setObject(1, localDate);
    ```

## 驱动程序
**JDBC 驱动管理器 `java.sql.DriverManager` 的主要功能就是：获取当前可用的驱动列表；处理特定的的驱动程序和数据库之间的连接。**

### 注册驱动程序
- registerDriver() : 需要保证驱动程序在编译时就是可用的
- **Class.forName() 推荐使用 : 不需要驱动程序在编译时是可用的**

![注册驱动程序](https://images.csthink.com/Carbonize%202019-04-13%20at%2011.25.20.png)


### JDBC 封装类

![JDBC 封装类](https://images.csthink.com/Carbonize%202019-04-13%20at%2012.20.40.png)


`jdbc.properties` 文件放在classpath 路径下即可(resources 目录)，内容示例如下

```shell
DRIVER_CLASS=com.mysql.jdbc.Driver
URL=jdbc:mysql://localhost:3306/jdbc?useUnicode=true&amp;characterEncoding=utf8&useSSL=false
USERNAME=root
PASSWORD=root
```


### C3P0数据库连接池封装类

![C3P0数据库连接池封装类](https://images.csthink.com/Carbonize%202019-04-13%20at%2012.23.23.png)


`c3p0-config.xml` 配置文件放置在classpath(resources目录)，内容示例如下

![c3p0-config.xml](https://images.csthink.com/Carbonize%202019-04-13%20at%2012.24.28.png)

测试类代码
![测试类代码](https://images.csthink.com/Carbonize%202019-04-13%20at%2012.28.43.png)


## 源码下载
示例代码托管在了 github: https://github.com/csthink/JDBC
