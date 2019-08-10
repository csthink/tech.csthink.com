---
title: CentOS 7 中搭建LNMP
date: 2018-01-30 20:25:06
tags: 
	- lnmp
categories: linux
---

## 安装前准备
* CentOS 7 系统
* su - 切换到root环境下安装以下软件，这里会指定软件的运行身份是 www
<!-- more -->
* 以下软件安装过程中，CentOS 使用的 shell 环境是 zsh，并使用 oh my zsh 插件，所以环境变量都会保存在 ~/.zshrc 文件，应根据系统调整环境变量的保存路径
* 创建一个不能登录的用户

    ```shell
    groupadd www && useradd -M -s /sbin/nologin  -g www www
    ```
* 时间, 日期设置
* selinux 关闭(可选)
```shell
# 永久关闭
vim /etc/selinux/config
```
修改  SELINUX=disabled 需重启
临时关闭:设置SELinux 成为permissive模式，setenforce 1 设置SELinux 成为enforcing模式 `` setenforce 0``
* 安装常用工具
```shell
yum install gcc gcc-c++ make cmake automake autoconf vim git wget nettools telnet tree -y
```
* 创建 www 目录,并授权
```shell
mkdir /var/www \
&& chown -R www:www /var/www
```

## Nginx
1. 依赖软件包安装
	```shell
  yum install pcre pcre-devel perl-ExtUtils-Embed zlib zlib-devel libtool openssl openssl-devel -y
	```

2. 下载源码包并解压
	```shell
	cd /tmp \
	&& wget https://nginx.org/download/nginx-1.14.0.tar.gz \
	&& tar -zxvf nginx-1.14.0.tar.gz
	```

3. 编译安装
 	```shell
	cd nginx-1.14.0 \
   && ./configure --prefix=/usr/local/nginx \
	--user=www \
	--group=www \
	--with-http_stub_status_module \
	--with-http_ssl_module
	```
	```shell
	make -j `grep processor /proc/cpuinfo | wc -l` && make install && make clean
	```

4. 注册环境变量(有以下两种方式，任选其一)
	- 方式一：注册环境变量
	```shell
	echo -e '\nexport PATH=/usr/local/nginx/sbin:$PATH\n'  >> ~/.zshrc && source ~/.zshrc
	```
	- 方式二：创建别名
	```shell
	echo 'nginx="/usr/local/nginx/sbin/nginx"' >>  ~/.zshrc && source ~/.zshrc
	```

5. 创建 nginx 所需目录
	```shell
	# 创建 Nginx 日志保存目录
	mkdir /var/log/nginx/ 
	chown -R www:www /var/log/nginx
	```

6. 配置 nginx.conf
    
   ```shell
	cd /usr/local/nginx/conf/
	```
  ```shell
	mv nginx.conf nginx.conf.backup # 备份
	```
	```shell
	grep -v "#" nginx.conf.backup > nginx.conf # 过滤输出
	```
	```shell
	vim /usr/local/nginx/conf/nginx.conf
	```
	参考如下 nginx.conf 配置
	```nginx
	user www;
	#nginx 使用的线程数, cpu核数 * 2 最佳.
	worker_processes  4;
	#并发请求时使用线程的顺序, 用二进制位表示.
	worker_cpu_affinity 01 10 01 10;
	error_log  /var/log/nginx/error.log warn;
	pid        /var/run/nginx.pid;

	events {
	   #最大连接数
	   worker_connections  1024;
	   #允许 Nginx 在已经得到一个新连接的通知时接收尽可能更多的连接
	   multi_accept on;
	}

  http {
    include       mime.types;
    default_type  application/octet-stream;
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
    '$status $body_bytes_sent "$http_referer" '
    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    sendfile        on;
    keepalive_timeout  65;

    # 启用 gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_http_version 1.1;
    gzip_min_length 1k;
    gzip_buffers 4 8k;
    gzip_comp_level 2;
    gzip_types text/plain text/css
               application/x-javascript text/xml
               application/xml application/xml+rss
               text/javascript application/javascript
               image/svg+xml;

    # 包含虚拟主机配置文件
    include /usr/local/nginx/conf/vhost/*.conf;
 }
 ```
  创建虚拟主机配置文件目录
  ```shell
  mkdir /usr/local/nginx/conf/vhost \
  && vim /usr/local/nginx/conf/vhost/default.conf
  ```
  ``default.conf`` 可参考如下配置
  ```nginx
  server {
    listen 80;
    root /usr/local/nginx/html;
	  index  index.php index.html index.htm;

	  server_name  localhost;
	  charset utf-8;
	  error_log  /var/log/nginx/default_error.log warn;

	  location / {
	    # First attempt to serve request as file, then
	    # as directory, then fall back to displaying a 404
	    try_files $uri $uri/ /index.php?$query_string;
	  }

	  error_page   500 502 503 504  /50x.html;
	  location = /50x.html {
		  root   /usr/local/nginx/html;
	  }

	  location ~ \.php$ {
	    try_files $uri /index.php =404;
    	  fastcgi_split_path_info ^(.+\.php)(/.+)$;
		  # fastcgi_pass   127.0.0.1:9000;
		  # 若使用下面这种，需确保目录要和fpm的配置文件中的listen一致
		  fastcgi_pass /var/run/php/php7.2-fpm.sock;
		  fastcgi_index  index.php;
		  fastcgi_param  SCRIPT_FILENAME $document_root$fastcgi_script_name;
		  # 或者像下面这样也是可以的
		  # fastcgi_param SCRIPT_FILENAME $request_filename;
		  include        fastcgi_params;
	  }

	   # 禁止访问 .htxxx 文件
	   location ~ /\.ht {
		  deny all;
	    }

		location ~ \.(gif|jpg|jpeg|png|bmp|swf|pdf|ico|docx|mp4|mp3|txt)$ {
			expires 30d;
		access_log off;
	    }

	    location ~ \.(js|css|html|json)?$ {
		    expires 1h;
		    access_log off;
	    }

	    location ~ \.(zip|rar|wav|mp3|csv|xls|xlsx)$ {
	      expires 30d;
	      access_log off;
	    }
   }
   ```
   ```shell
   nginx -t # 校验配置文件
   ```

7. 创建 systemd 服务
	```shell
	vim /usr/lib/systemd/system/nginx.service
	```
	```shell
	[Unit]
	Description=nginx - high performance web server
	Documentation=https://nginx.org/en/docs/
	After=network.target remote-fs.target nss-lookup.target
	[Service]
	Type=forking
	PIDFile=/var/run/nginx.pid
	ExecStartPre=/usr/local/nginx/sbin/nginx -t -c /usr/local/nginx/conf/nginx.conf
	ExecStart=/usr/local/nginx/sbin/nginx -c /usr/local/nginx/conf/nginx.conf
	ExecReload=/bin/kill -s HUP $MAINPID
	ExecStop=/bin/kill -s QUIT $MAINPID
	PrivateTmp=true
	[Install]
	WantedBy=multi-user.target
	```
	```shell
	chmod +x /usr/lib/systemd/system/nginx.service
	systemctl start nginx.service
	systemctl enable nginx.service
	```

8. 开放端口
	```shell
	firewall-cmd --zone=public --add-port=80/tcp --permanent
	firewall-cmd --reload
	```

## PHP-FPM
1. 依赖软件包安装
	```shell
	yum install libxml2-devel curl-devel libjpeg libjpeg-devel libpng libpng-devel freetype freetype-devel gd gd2 gd-devel gd2-devel libwebp libwebp-devel php-devel libmemcached libmemcached-devel libevent-devel -y
	```

2. 下载源代码
	```shell
	cd /tmp/ \
	&& wget https://cn2.php.net/distributions/php-7.2.10.tar.gz \
	&& tar -zxvf php-7.2.10.tar.gz
	```

3. 编译安装
	```shell
	cd php-7.2.10/
	```
	```shell
	# php 7.2 不支持
	--enable-gd-native-ttf \
   --with-mcrypt \
   # 在phh7.1时，官方就开始建议用 ``penssl_*`` 系列函数代替 ``Mcrypt_*`` 系列的函数
   ```

	```shell
	./configure \
    --prefix=/opt/php7.2.10 \
    --exec-prefix=/opt/php7.2.10 \
    --bindir=/opt/php7.2.10/bin \
    --sbindir=/opt/php7.2.10/sbin \
    --includedir=/opt/php7.2.10/include \
    --libdir=/opt/php7.2.10/lib/php \
    --mandir=/opt/php7.2.10/php/man \
    --with-config-file-path=/opt/php7.2.10/etc \
    --with-mhash \
    --with-openssl \
    --with-gd \
    --with-iconv \
    --with-zlib \
    --enable-zip \
    --enable-inline-optimization \
    --disable-debug \
    --disable-rpath \
    --enable-shared \
    --enable-xml \
    --enable-bcmath \
    --enable-shmop \
    --enable-sysvsem \
    --enable-mbregex \
    --enable-mbstring \
    --enable-exif \
    --enable-ftp \
    --enable-pcntl \
    --enable-sockets \
    --with-xmlrpc \
    --enable-soap \
    --without-pear \
    --with-gettext \
    --enable-session \
    --with-curl \
    --with-jpeg-dir \
    --with-webp-dir \
    --with-xpm-dir \
    --with-freetype-dir=/usr/include/freetype2/freetype \
    --enable-opcache \
    --enable-mysqlnd \
    --with-mysqli=mysqlnd \
    --with-pdo-mysql=mysqlnd \
    --enable-fpm \
    --with-fpm-user=www \
    --with-fpm-group=www
    ```
	```shell
	make -j `grep processor /proc/cpuinfo | wc -l` && make install && make clean
	```

4. 创建软链接
	```shell
	ln -s /opt/php7.2.10 /usr/local/php
	```

5. 注册环境变量
	```shell
	echo -e '\nexport PATH=/usr/local/php/bin:/usr/local/php/sbin:$PATH\n'  >> ~/.zshrc && source ~/.zshrc
	```

6. 配置php
	```shell
	cd /tmp/php-7.2.10/ \
	&& cp php.ini-development /usr/local/php/etc/php.ini \
	&& cp /usr/local/php/etc/php-fpm.conf.default /usr/local/php/etc/php-fpm.conf \
	&& cp /usr/local/php/etc/php-fpm.d/www.conf.default /usr/local/php/etc/php-fpm.d/www.conf
	```

7. 创建 systemd 服务
	```shell
	vim /usr/lib/systemd/system/php.service
	```
	```shell
	[Unit]
		Description=php
		After=network.target

  [Service]
 		Type=forking
    	ExecStart=/usr/local/php/sbin/php-fpm
    	ExecReload=/bin/pkill php-fpm && /usr/local/php/sbin/php-fpm
    	ExecStop=/bin/pkill php-fpm
    	PrivateTmp=true

  [Install]
    	WantedBy=multi-user.target
	```
	```shell
	chmod +x /usr/lib/systemd/system/php.service
	systemctl start php.service 
	systemctl enable php.service
	```
	其它命令
	* 启动 ``php-fpm``
	* 重启 ``kill -USR2 [php-fpm master 进程id]``
	* 停止 ``kill [php-fpm master 进程id]``
	* 查看 php-fpm master 进程 id ``ps -aux | grep php-fpm | grep master``
	
	Composer 安装
	```shell
	cd /tmp
  php -r "copy('https://install.phpcomposer.com/installer', 'composer-setup.php');"
  php composer-setup.php
  php -r "unlink('composer-setup.php');"
  mv composer.phar /usr/local/bin/composer
  composer config -g repo.packagist composer https://packagist.phpcomposer.com
  ```

  PHP 扩展安装(有两种方式安装，一种是使用 pecl ，另一种是下载源码编译安装)
  方式一：使用 pecl 安装
    ```shell
	# 安装 pecl
    wget https://pear.php.net/go-pear.phar # 下载
    php go-pear.phar
    pecl version # 查看 pecl 版本
    pecl channel-update pecl.php.net # 更新下仓库
    ```
    使用 pecl 安装扩展(受网速影响可能会出现查询不到包，重试几次即可)
    ```shell
    pecl install redis
    pecl info redis
    pecl unisntall redis
    ```
    也可以使用安装包
    ```shell
    wget https://pecl.php.net/get/redis-4.1.1.tgz
    wget https://pecl.php.net/get/swoole-4.2.1.tgz
    wget https://pecl.php.net/get/memcached-3.0.4.tgz
    wget https://pecl.php.net/get/xdebug-2.6.1.tgz
    ```
    ```shell
    pecl install redis-4.1.1.tgz
    pecl install swoole-4.2.1.tgz
    pecl install memcached-3.0.4.tgz
    pecl install xdebug-2.6.1.tgz
    ```
    修改PHP.ini
    ```shell
    vim /usr/local/php/etc/php.ini
    ```
    添加扩展到 ``php.ini``,大概在908行 
	**extension=redis** 
	**extension=swoole** 
	**extension=memcached**
	**zend_extension=xdebug** 
	**xdebug.remote_enable=on** 
	重启 PHP
	```shell
	systemctl restart php.service
	```
	方式二：下载源码编译安装
	```shell
	cd /tmp/ \
	&& git clone https://github.com/phpredis/phpredis.git \
	&& cd phpredis \
	&& /usr/local/php/bin/phpize \
	&& ./configure --with-php-config=/usr/local/php/bin/php-config \
	&& make && make install && make clean
	```
	```shell
	vim /usr/local/php/etc/php.ini
	```
	添加扩展 **extension=redis** 到 ``php.ini``,重启php-fpm
	```shell
	systemctl restart php.service
	```

## MySQL

1. 安装前准备
  ```shell
	cd /tmp
	```
  ```shell
	wget https://dev.mysql.com/get/mysql80-community-release-el7-1.noarch.rpm
  ```
	```shell
	rpm -ivh mysql80-community-release-el7-1.noarch.rpm
	```

2. 更新软件源
	```shell
	yum clean all && yum makecache
	```
	```shell
	yum repolist all | grep mysql
	```

3. yum 方式安装(默认会安装最新版的mysql)
	```shell
	yum -y install mysql-community-server
	```

4. 服务管理
  ```shell
  systemctl start mysqld.service
  systemctl enable mysqld.service
  systemctl status mysqld.service
  systemctl restart mysqld.service
  systemctl stop mysqld.service
  ```

5. 修改 root 密码
	先获取安装时的预设密码
  ```shell
	cat /var/log/mysqld.log | grep password
	```
	使用上一步获取到的密码进行 mysql 登录
	```shell
	mysql -u root -p
	```

	修改密码
	```shell
	ALTER USER 'root'@'localhost' IDENTIFIED BY '新密码';
	```
	创建一个 dev 用户可以本地登录，并授权
	```shell
	CREATE USER 'dev'@'localhost' IDENTIFIED BY '新密码';
	```
	```shell
	GRANT ALL PRIVILEGES ON *.* TO 'dev'@'localhost' WITH GRANT OPTION;
	```
	创建一个 dev 用户可以远程登录，并授权
	```shell
	CREATE USER 'dev'@'%' IDENTIFIED BY '新密码';
	```
	```shell
	GRANT ALL PRIVILEGES ON *.* TO 'dev'@'%' WITH GRANT OPTION;
	```
	```shell
	FLUSH PRIVILEGES;
	```
	修改 my.cnf
	```shell
	vim /etc/my.cnf
	```

	添加以下内容到文件中
	```shell
	[client]
		port=3306
	[mysqld]
		port=3306
	```
	重启mysqld 服务
	```shell
	systemctl restart mysqld.service
	```
	检查服务
	```shell
	netstat -lntup | grep mysql
	```

## Redis
1. 下载源码
  ```shell
	cd /tmp/ \
	&& wget https://download.redis.io/releases/redis-4.0.11.tar.gz \
	&& tar -xzvf redis-4.0.11.tar.gz
	```

2. 编译安装
	```shell
	cd redis-4.0.11/
	```

	```shell
	make -j `grep processor /proc/cpuinfo | wc -l` && make PREFIX=/usr/local/redis install
    ```

3. 配置 Redis
	```shell
	mkdir /usr/local/redis/etc/
	```

	```shell
	cp redis.conf /usr/local/redis/etc/
	```
	```shell
	cd /usr/local/redis/bin/
	```
	```shell
	cp redis-benchmark redis-cli redis-server /usr/bin/
	```

	```shell
	echo "vm.overcommit_memory=1">>/etc/sysctl.conf && sysctl -p
	```

   修改配置
   ```shell
	vim /usr/local/redis/etc/redis.conf
	```

    - daemonize yes
    redis以守护进程的方式运行
    no表示不以守护进程的方式运行(会占用一个终端)

    - timeout 300
    客户端闲置多长时间后断开连接，默认为0关闭此功能

    - loglevel verbose
    设置redis日志级别，默认级别：notice

    - requirepass redis密码
    设置 redis 密码

    - port 6379
    设置 redis 端口

    - logfile stdout
    设置日志文件的输出方式,如果以守护进程的方式运行redis 默认:"" 
    并且日志输出设置为stdout,那么日志信息就输出到/dev/null里面去了 

    - bind 127.0.0.1
    - 注释掉该项，若需要远程访问

4. 添加环境变量
   ```shell
	echo -e '\nexport PATH=/usr/local/redis/bin:$PATH\n'  >> ~/.zshrc && source ~/.zshrc
    ```

5. 创建 systemd 服务
   ```shell
	vim /usr/lib/systemd/system/redis.service
	```

  ```shell
	[Unit]
        Description=Redis
        After=network.target

    [Service]
        Type=forking
        ExecStart=/usr/local/redis/bin/redis-server /usr/local/redis/etc/redis.conf 
        ExecReload=/bin/pkill redis-server && /usr/local/redis/bin/redis-server/usr/local/redis/etc/redis.conf 
        ExecStop=/bin/pkill redis-server
        PrivateTmp=true

    [Install]
        WantedBy=multi-user.target
   ```
   ```shell
	chmod +x /usr/lib/systemd/system/redis.service
    ```
	```shell
	systemctl start redis.service
	```
	```shell
	systemctl enable redis.service
	```

6. 测试redis登录
    方式一：
    ```shell
    redis-cli -h 127.0.0.1 -p 6379 -a redis密码
    ```

    方式二：
    ```shell
    redis-cli -h 127.0.0.1 -p 6379
    ```
    ```shell
    auth redis密码
    ```

## NodeJs

1. 下载源码
   ```shell
	cd /tmp/ \
	&& wget https://nodejs.org/dist/v8.12.0/node-v8.12.0.tar.gz \
	&& tar -xzvf node-v8.12.0.tar.gz
	```

2. 编译安装
  ```shell
	cd node-v8.12.0 \
	&& ./configure --prefix=/opt/node8.12.0 \
	&& make -j `grep processor /proc/cpuinfo | wc -l` && make install && make clean
  ```

3. 创建软链接
  ```shell
  ln -s /opt/node8.12.0 /usr/local/node
  ```

4. 注册环境变量
  ```shell
  echo -e '\nexport PATH=/usr/local/node/bin:$PATH\n'  >> ~/.zshrc && source ~/.zshrc
  ```
  
  ### cnpm 
  
  ```
  npm config set registry https://registry.npm.taobao.org
  npm install -g cnpm --registry=https://registry.npm.taobao.org
  ```
  
  ### yarn
  
  ```
    curl --silent --location https://dl.yarnpkg.com/rpm/yarn.repo | sudo tee /etc/yum.repos.d/yarn.repo
    yum install -y yarn
   ```

## memcached
```shell
yum -y install memcached
cat /etc/sysconfig/memcached
systemctl start memcached
systemctl enable memcached
```
```shell
firewall-cmd --add-port=11211/tcp --permanent
firewall-cmd --reload
```
    
启动方式一：
```shell
memcached -d -l 127.0.0.1 -p 11211 -m 150 -u root
```
启动方式二：
```shell
memcached -u memcached -p 11211 -m 64 -c 1024
```
    
启动选项：
    -d 是启动一个守护进程；
    -m 是分配给Memcache使用的内存数量，单位是MB；
    -u 是运行Memcache的用户；
    -l 是监听的服务器IP地址，可以有多个地址；
    -p 是设置Memcache监听的端口，，最好是1024以上的端口；
    -c 是最大运行的并发连接数，默认是1024；
    -P 是设置保存Memcache的pid文件。
    
```shell
ps -ef | grep memcached # 可以检查 memcached 是否在运行
```