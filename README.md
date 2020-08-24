# [番组放送](http://bgmlist.com/) v2

新番放送兼版权引进播放地址聚合站

放送时间数据源：http://www.kansou.me

## Attention

本站点的数据已分离至单独的 Repository 维护，请需要大陆新番放送站点数据的同学们移步至：[bangumi-data](https://github.com/bangumi-data/bangumi-data)

从 2017 年 1 月开始，本目录下的 json 数据将不会再更新，视情况而定也可能会删除，谢谢大家的理解。

## deploy

```sh
npm install
cp src/js/_config.js src/js/config.js
npm run deploy
```

会在目录下生成 `dist` 文件夹和 `index.html` 文件。

## dev

### live development

```sh
npm run start
```

然后在浏览器中打开 http://localhost:8090/test.html 即可

## special thanks to
感谢 [@parameciumzhe](https://twitter.com/parameciumzhe) 提供的设计建议和优化方案
