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


## Example Result

```
Metrology report size 11.92 MiB, brotli {"quality":1} compressed size 1.69 MiB, compression rate 85.80 %
Metrology report size 11.92 MiB, pako {"level":1} compressed size 1.85 MiB, compression rate 84.48 %
Metrology report size 11.92 MiB, lz4 (default) compressed size 2.40 MiB, compression rate 79.87 %
Brotli x 4.59 ops/sec ±0.40% (16 runs sampled)
Pako x 4.04 ops/sec ±0.83% (15 runs sampled)
Lz4js x 12.80 ops/sec ±0.95% (35 runs sampled)
The fastest option is Lz4js

Metrology report size 11.92 MiB, brotli {"quality":5} compressed size 1.35 MiB, compression rate 88.68 %
Metrology report size 11.92 MiB, pako {"level":5} compressed size 1.57 MiB, compression rate 86.81 %
Metrology report size 11.92 MiB, lz4 (default) compressed size 2.40 MiB, compression rate 79.87 %
Brotli x 1.67 ops/sec ±0.36% (9 runs sampled)
Pako x 2.41 ops/sec ±1.35% (11 runs sampled)
Lz4js x 12.61 ops/sec ±1.28% (35 runs sampled)
The fastest option is Lz4js

Metrology report size 11.92 MiB, brotli {"quality":11} compressed size 1.07 MiB, compression rate 91.04 %
Metrology report size 11.92 MiB, pako {"level":9} compressed size 1.50 MiB, compression rate 87.38 %
Metrology report size 11.92 MiB, lz4 (default) compressed size 2.40 MiB, compression rate 79.87 %
Brotli x 0.02 ops/sec ±0.23% (5 runs sampled)
Pako x 1.66 ops/sec ±1.12% (9 runs sampled)
Lz4js x 12.85 ops/sec ±1.08% (35 runs sampled)
The fastest option is Lz4js
```