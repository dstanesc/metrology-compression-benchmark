# Metrology Data Compression Benchmark

Suite of metrology data compression benchmarks based on the [fake metrology data](https://github.com/dstanesc/fake-metrology-data) library.

Currently tested libraries: `brotli`, `pako` and `lz4js`.

## Dependencies

```sh
$ node --version
v16.13.1

$ npm --version
8.1.2
```

## Execute Benchmark

```sh
npm run clean
npm install
npm start
```


## Typical Partial Report Result

incl. 2700 measurements, yields following results

```
Compression only, report size 11.93 MiB, brotli {"quality":1} compressed size 1.67 MiB, compression rate 85.96 %
Compression only, report size 11.93 MiB, pako {"level":1} compressed size 1.85 MiB, compression rate 84.49 %
Compression only, report size 11.93 MiB, lz4 (default) compressed size 2.40 MiB, compression rate 79.87 %
Brotli x 4.82 ops/sec ±3.40% (17 runs sampled)
Pako x 4.16 ops/sec ±2.20% (15 runs sampled)
Lz4js x 13.28 ops/sec ±1.09% (36 runs sampled)
The fastest option is Lz4js

Compression only, report size 11.93 MiB, brotli {"quality":5} compressed size 1.35 MiB, compression rate 88.70 %
Compression only, report size 11.93 MiB, pako {"level":5} compressed size 1.57 MiB, compression rate 86.83 %
Compression only, report size 11.93 MiB, lz4 (default) compressed size 2.40 MiB, compression rate 79.87 %
Brotli x 1.74 ops/sec ±1.65% (9 runs sampled)
Pako x 2.44 ops/sec ±2.06% (11 runs sampled)
Lz4js x 12.79 ops/sec ±1.73% (35 runs sampled)
The fastest option is Lz4js

Compression only, report size 11.93 MiB, brotli {"quality":11} compressed size 1.07 MiB, compression rate 91.03 %
Compression only, report size 11.93 MiB, pako {"level":9} compressed size 1.50 MiB, compression rate 87.40 %
Compression only, report size 11.93 MiB, lz4 (default) compressed size 2.40 MiB, compression rate 79.87 %
Brotli x 0.02 ops/sec ±2.38% (5 runs sampled)
Pako x 1.66 ops/sec ±3.02% (9 runs sampled)
Lz4js x 12.78 ops/sec ±1.92% (35 runs sampled)
The fastest option is Lz4js
```

```
{
  min: {
    bufSize: 12508044,
    ops: { brotli: 4, pako: 4, lz4js: 13 },
    rate: { brotli: '85.96', pako: '84.49', lz4js: '79.87' },
    options: { brotli: 1, pako: 1 }
  },
  med: {
    bufSize: 12508044,
    ops: { brotli: 1, pako: 2, lz4js: 12 },
    rate: { brotli: '88.70', pako: '86.83', lz4js: '79.87' },
    options: { brotli: 5, pako: 5 }
  },
  max: {
    bufSize: 12508044,
    ops: { brotli: 0, pako: 1, lz4js: 12 },
    rate: { brotli: '91.03', pako: '87.40', lz4js: '79.87' },
    options: { brotli: 11, pako: 9 }
  }
}
```