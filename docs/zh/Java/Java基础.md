
# Java 基础

## 数据类型
![数据类型](https://images.csthink.com/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202019-04-09%2009.01.36.png)

<!-- more -->

### 基本数据类型的默认值
    
| 基本数据类型 | 默认值 |
| :-: | :-: |
| byte | 0 |
| short | 0 |
| int | 0 |
| long | 0L |
| float | 0.0f |
| dobule | 0.0d |
| char | ‘\u0000' |
| boolean | false |


## 包装类 
**解决基本数据类型不具备对象化能力的问题**

- 拥有属性、方法
- 可以对象化交互
- 默认值为 null

### 基本数据对应的包装类

| 基本类型 | 包装类 |
| :-: | :-: |
| byte | Byte |
| short | Short |
| int | Integer |
| long | Long |
| float | Float |
| dobule | Double |
| boolean | Boolean |
| char | Character |


### 基本数据类型与包装类之间的转换

- 装箱: 基本数据类型转换为包装类
- 拆箱: 包装类转换为对应的基本数据类型

## 装箱与拆箱的使用
![装箱与拆箱](https://images.csthink.com/Carbonize%202019-04-08%20at%2006.34.18.png)

## 基本数据类型与字符串之间的转换

![基本数据类型与字符串之间的转换](https://images.csthink.com/Carbonize%202019-04-08%20at%2006.34.52.png)

## String 

```java
String s1 = "hello"; // 定义字符串方式一
String s2 = new String("hello"); // 定义字符串方式二
byte[] arrs = s2.getBytes(); // 字符串转换为字节数组
String s3 = new String(arrs); // 字节数组转换为字符串

// 转换时可以设置编码类型
// byte[] arrs = s2.getBytes("GBK"); 
// String s3 = new String(arrs, "GBK");
```

### 字符串常用方法

| 方法 | 说明 |
| :-- | :-- |
| int length() | 返回当前字符串的长度 |
| int indexOf(int ch) | 查找ch字符在该字符串中第一次出现的位置 |
| int indexOf(String str) | 查找str子字符串在该字符串中第一次出现的位置  |
| int lastIndexOf(int ch) | 查找ch字符在该字符串中最后一次出现的位置 |
| int lastIndexOf(String str) | 查找str子字符串在该字符串中最后一次出现的位置 |
| String subString(int beginIndex) | 获取从beginIndex位置开始到结束的子字符串 |
| String subString(int beginIndex, int endIndex) | 获取从beginIndex位置开始到endIndex位置的子字符串 |
| String trim() | 返回去除了前后空格的字符串 |
| boolean equals(Object obj) | 将该字符串与指定对象比较，返回true或false |
| String toLowerCase() | 将字符串转换为小写 |
| String toUpperCase() | 将字符串转换为大写 |
| char charAt(int index) | 获取字符串中指定位置的字符 |
| String[] split() | 将字符串分割为子字符串，返回字符串数组 |
| Byte[] getBytes | 将该字符串转换为byte数组 |

### `==` 与 `equals` 的区别

- `==`指引用是否相同,是对内存地址的进行的比较，判断的是两个变量或实例是不是指向同一个内存地址空间
- `equals()`指的是值是否相同，是对字符串的内容进行比较,判断的是两个变量或实例所指向的内存空间的值是不是相同

### String 的不可变性
**String 对象一旦被创建，则不能修改，是不可变的，所谓的修改其实是创建了新的对象，所指向的内存空间不变**

### 缓存池(字符串常量池, String Pool)
在Java8中，Integer 缓存池的大小默认为 -128~127,编译器会在自动装箱过程调用valueOf() 方法，因此多个值相同且值在缓存池范围内的 Integer 实例使用自动装箱来创建，那么就会引用相同的对象

new Integer(123) 与 Integer.valueOf(123)的区别在与
- new Integer(123) 每次都会新建一个对象；
- Integer.valueOf(123) 会使用缓存池中的对象，多次调用会取得同一个对象的引用。

![缓存池](https://images.csthink.com/Carbonize%202019-04-09%20at%2006.49.51.png)


### String不可变的底层实现
在 Java 8 中，String 内部使用 char数组来存储字符

![String不可变的底层实现-Java8](https://images.csthink.com/Carbonize%202019-04-09%20at%2006.58.08.png)

在 Java 9 之后，String 类的实现改用 byte 数组存储字符串，同时使用 coder 来标识使用了哪种编码。

![String不可变的底层实现-Java9](https://images.csthink.com/Carbonize%202019-04-09%20at%2006.58.57.png)

### String 不可变带来的好处
- 可以缓存hash值
    - 因为 String 的 hash 值经常被使用，例如 String 用做 HashMap 的 key。不可变的特性可以使得 hash 值也不可变，因此只需要进行一次计算。 
-  String Pool
    - 如果一个 String 对象已经被创建过了，那么就会从 String Pool 中取得引用。只有 String 是不可变的，才可能使用 String Pool
- 安全性
    - String 经常作为参数，String 不可变性可以保证参数不可变。例如在作为网络连接参数的情况下如果 String 是可变的，那么在网络连接过程中，String 被改变，改变 String 对象的那一方以为现在连接的是其它主机，而实际情况却不一定是
- 线程安全
    - String 不可变性天生具备线程安全，可以在多个线程中安全地使用

### String 不可变例子
![String 不可变例子](https://images.csthink.com/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202019-04-09%2009.12.59.png)
    
- str1 与 str2 的内容与地址都相同，指向的都是内存常量池里同一份字符串
- str1 或 str2 与 str3或str4的内容是相同的，但是地址是不同的
- str3 与 str4 内容相同，地址不同

### String，StringBuilder ，StringBuffer
**频繁使用大量字符串时，推荐使用 StringBuilder**

- String 具有不可变性，而StringBuilder 和 StringBuffer 不具备
- String 的不可变性会在缓存池产生很多废弃的字符串，所以当频繁操作字符串时，应使用StringBuilder(循环中拼接字符串)或 StringBuffer
- String 不可变，因此是线程安全的，StringBuilder 不是线程安全，StringBuffer 是线程安全，其内部使用的 synchronized 进行同步


![String，StringBuilder ，StringBuffer](https://images.csthink.com/Carbonize%202019-04-09%20at%2008.16.05.png)

## float 与 dobule

```java
float f = 1.1f;
//float f = 1.1; // 1.1 字面量属于double类型，不能直接赋值给float
double f = 1.1;
```

## 隐式类型转换

```java
short s = 1;
// 不能隐式地将 int 类型下转型为 short 类型
//s = s + 1; 

s = (short) (s + 1);
// 使用 += 或 ++ 这类运算符可以执行隐式类型转换
s += 1; 
s++;
```

参考: https://stackoverflow.com/questions/8710619/why-dont-javas-compound-assignment-operators-require-casting
