---
layout: doc
outline: deep
---

# 问题

## 模拟接口请求

在仓库 server 目录下有基于`nest.js`模拟的接口

1. `upload`接口

```js
 @Post('upload')
  // file和前端上传的名称保持一致
  @UseInterceptors(
    FileInterceptor('file', {
      dest: 'uploads',
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File, @Body() body) {
    const { filename, hash, index } = body;
    const chunkDir = `uploads/${hash}_${filename}`;

    if (!fs.existsSync(chunkDir)) {
      fs.mkdirSync(chunkDir);
    }
    fs.cpSync(file.path, chunkDir + '/' + index);
    fs.rmSync(file.path);

    return { data: true };
  }
```

2. `merge`接口

```js
 @Post('merge')
  merge(@Body() body) {
    const { hash, name: filename } = body;
    const chunkDir = `uploads/${hash}_${filename}`;
    const files = fs.readdirSync(chunkDir);

    let startPos = 0;
    files.map((file) => {
      const filePath = chunkDir + '/' + file;
      const stream = fs.createReadStream(filePath);
      stream.pipe(
        fs.createWriteStream('uploads/' + filename, {
          start: startPos,
        }),
      );

      startPos += fs.statSync(filePath).size;
    });

    return {
      data: `http://localhost:3000/static/${filename}`,
    };
  }
```

3. `checkFile`接口

```js
@Post('checkFile')
  checkFile(@Body() body) {
    const { status } = body;
    if (status === 'success') {
      return {
        status: 'success',
        data: 'https://baidu.com',
      };
    }

    if (status === 'part') {
      return {
        status: 'part',
        // 成功的索引
        data: [0, 2, 4, 6, 8, 10],
      };
    }

    if (status === 'none') {
      return {
        status: 'none',
        data: false,
      };
    }
  }
```

clone 代码到本地，启动 server 在`3000`端口
