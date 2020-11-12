# data-set

[![](https://img.shields.io/travis/antvis/data-set.svg)](https://travis-ci.org/antvis/data-set)
![](https://img.shields.io/badge/language-typescript-red.svg)
![](https://img.shields.io/badge/license-MIT-000000.svg)

[![npm package](https://img.shields.io/npm/v/@antv/data-set.svg)](https://www.npmjs.com/package/@antv/data-set)
[![NPM downloads](http://img.shields.io/npm/dm/@antv/data-set.svg)](https://npmjs.org/package/@antv/data-set)
[![Percentage of issues still open](http://isitmaintained.com/badge/open/antvis/data-set.svg)](http://isitmaintained.com/project/antvis/data-set 'Percentage of issues still open')

Data set with state management.

## Installing

`npm install @antv/data-set`

```js
import DataSet from '@antv/data-set';

const ds = new DataSet({
  state: {
    // initialize state
    foo: 'bar',
  },
});
```

## Document

 - [快速入门](./docs/overview.md)
 - [DataSet](./docs/dataset.md)
 - [Connector 数据接入](./docs/connector.md)
 - [Transform 数据转换](./docs/transform.md)
