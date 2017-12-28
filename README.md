## NodeJS-API-MD
一个通过代码运行NodeJS的API以达到学习文档目的的库
NodeJS Version: v8.9.3

## NodeJS的命令行用法
我认为熟知node的命令行用法对我们在实际工程化编码过程中会得心应手

[命令行选项](http://nodejs.cn/api/cli.html#cli_command_line_options)

我们可以通过运行 `man node` 查看Node在终端中的操作指南

> 查看Node版本号
```bash
node -v
node --version
```

> 查看node命令行选项（此选项的输出不如官方文档详细。这句话是Node官方文档给自己加戏）
```bash
node -h
node --help
```

> 把跟随的参数作为 JavaScript 来执行
```bash
node -e "script"
node --eval "script"
```

> 把跟随的参数作为 JavaScript 来执行，并打印出执行结果
```bash
node -p "script"
node --print "script"
```

> 在不执行的情况下，对脚本进行语法检查
```bash
node -c
node --check
```

> 打开 REPL(交互式解释器)，可以用于调试、测试或尝试其他更有意思的东西
```bash
node -i
node --interctive
```

> 在启动时预加载指定的模块，module 可以是一个文件的路径，或一个 node 模块名称。
```bash
node -r
node --require module
```
> 静默一切进程警告（慎用）
```bash
node --no-warnings
```

> 打印进程警告的堆栈跟踪（包括废弃警告）
```bash
node --trace-warnings
```

> 自动用 0 填充所有新分配的 Buffer 和 SlowBuffer 实例 (未使用过)
```bash
node --zero-fill-buffers
```

> 启动时加载 OpenSSL 配置文件（file为文件路径）
```bash
node --openssl-config=file
```

这些都是目前我能尝试的命令行选项

## NodeJS的File-System
[file-system](http://nodejs.cn/api/fs.html#fs_file_system)

NodeJS 中的fs模块，所有的方法都有异步和同步的形式。

函数形式：异步方法的最后一个参数都是一个回调函数。 传给回调函数的参数取决于具体方法，但回调函数的第一个参数都会保留给异常。 如果操作成功完成，则第一个参数会是 null 或 undefined

Warning: 当使用`同步`方法时，任何异常都会被立即抛出。 可以使用 `try/catch` 来处理异常，或让异常向上冒泡。

官方建议：在繁忙的进程中，建议使用`异步`的方法。 同步的方法会`阻塞`整个进程，直到完成（停止所有连接）

官方注意：在Windows上使用node，fs.readdirSync('c:\\\\') 可能返回与 fs.readdirSync('c:') 不同的结果（由于node在windows上遵循单驱动器工作目录）

### 1. fs.FSWatcher 类

提供给 `fs.watch()` 的 `listener` 回调会接收返回的 FSWatcher 的 `change` 事件

**Notice:** 关于出现'ENOENT'报错的含义：'No such file or directory'

**Warning:** 千万不要用watchFile()监视太多文件，会导致内存暴涨!

`change` 事件（当一个被监视的目录或文件有变化时触发）

其中使用的api:
1. [fs.watch(filename, [options], [listener])](http://nodejs.cn/api/fs.html#fs_fs_watch_filename_options_listener)

`fs.watch` 监视 filename 的变化，filename 可以是一个文件或一个目录。 返回的对象是一个 `fs.FSWatcher`

`fs.watch` 参数说明:

filename: 不要以为 filename 参数总是在回调中提供，如果它是空的，需要有一定的后备逻辑。例如：
```js
fs.watch('somedir', (eventType, filename) => {
  console.log(`事件类型是: ${eventType}`);
  if (filename) {
    console.log(`提供的文件名: ${filename}`);
  } else {
    console.log('未提供文件名');
  }
});
```

options 是一个对象，其形式为:
```js
options: {
    persistent: Boolean, // 指明如果文件正在被监视，进程是否应该继续运行。默认 = true
    recursive: Boolean, // 指明是否全部子目录应该被监视，或只是当前目录。默认 = false
    encoding: String // 指定用于传给监听器的文件名的字符编码。默认 = 'utf8'
}
```

listener 是一个监听器回调函数，其形式:
```js
function (eventType, filename) {
    // eventType 可以是 'rename' 或 'change'
    // filename 是触发事件的文件的名称

    // notice: 在大多数平台，当一个文件出现或消失在一个目录里时，'rename' 会被触发
}
```


可以运行fs文件夹中的fs.js并修改tmp.txt文件查看效果
```bash
fs.watch('./tmp', { encoding: 'buffer' }, (eventType, filename) => {
  if (filename) {
    console.log(filename);
    // 输出: <Buffer ...>
  }
});
```

我在mac环境下，运行fs.watch()监听文件，没有成功，可是运行fs.watchFile()成功了，这使我感到困惑。
建议采用对封装好fs.watch()方法的 [gaze](https://github.com/shama/gaze) 库，gaze提供了监听文件（文件夹）变化的生命周期钩子，在这里，我试用了gaze@1.1.2，可以通过 `fsWatch.js` 中查看详细代码并通过对/tmp/tmp.txt进行内容进行增删变更操作查看 `gaze` 对文件的实际监视效果。经验证，挺详细的。

### Updated in 12.28
