import Benchmark from 'benchmark'

import {
  partReport,
  multipartReport
} from '@dstanesc/fake-metrology-data'

import { pack } from 'msgpackr';

import * as lz4 from 'lz4js'
import * as pako from 'pako'
import * as brotli from 'brotli'

import { plot } from './plot.js';

const rate = (origSize, deflatedSize) => {
  return (((origSize - deflatedSize) / origSize) * 100).toFixed(2);
}

const miB = (size) => {
  return (size / (1024 * 1024)).toFixed(2);
}

const metrologyPartReportData = (args) => {
  const reportJson = partReport(args)
  const buf = pack(reportJson);
  const bufSize = buf.byteLength;
  console.log(`Metrology report ${args.reportSize} measurements, original size ${miB(bufSize)} MiB`);
  return { buf, bufSize }
}

const bench = (full, { buf, bufSize }, options) => {
  const serPako = pako.deflate(buf, options.pako);
  const serLz4 = lz4.compress(buf);
  const serBrotli = brotli.compress(buf, options.brotli);

  const serPakoSize = serPako.byteLength;
  const serLz4Size = serLz4.byteLength;
  const serBrotliSize = serBrotli.byteLength;

  const brotliRate = rate(bufSize, serBrotliSize);
  const pakoRate = rate(bufSize, serPakoSize);
  const lz4jsRate = rate(bufSize, serLz4Size);

  const subj = full ? "Compression and decompression combined" : "Compression only";
  console.log(`${subj}, report size ${miB(bufSize)} MiB, brotli ${JSON.stringify(options.brotli)} compressed size ${miB(serBrotliSize)} MiB, compression rate ${brotliRate} %`);
  console.log(`${subj}, report size ${miB(bufSize)} MiB, pako ${JSON.stringify(options.pako)} compressed size ${miB(serPakoSize)} MiB, compression rate ${pakoRate} %`);
  console.log(`${subj}, report size ${miB(bufSize)} MiB, lz4 (default) compressed size ${miB(serLz4Size)} MiB, compression rate ${lz4jsRate} %`);

  const compressSuite = new Benchmark.Suite('MMetrology Compression Suite')

  compressSuite.on('complete', event => {
    const suite = event.currentTarget;
    const fastestOption = suite.filter('fastest').map('name')
    console.log(`The fastest option is ${fastestOption}`)
    console.log()
  })

  let brotliHz;
  let pakoHz;
  let lz4jsHz;

  compressSuite.on('cycle', event => {
    const benchmark = event.target;
    console.log(benchmark.toString());
    switch (benchmark.name) {
      case 'Brotli':
        brotliHz = Math.floor(benchmark.hz);
        break;
      case 'Pako':
        pakoHz = Math.floor(benchmark.hz);
        break;
      case 'Lz4js':
        lz4jsHz = Math.floor(benchmark.hz);
        break;
    }
  });

  compressSuite
    .add('Brotli', async () => {
      const ser = brotli.compress(buf, options.brotli);
      if (full) {
        brotli.decompress(ser);
      }
    })
    .add('Pako', async () => {
      const ser = pako.deflate(buf, options.pako);
      if (full) {
        pako.inflate(ser);
      }
    })
    .add('Lz4js', async () => {
      const ser = lz4.compress(buf);
      if (full) {
        lz4.decompress(ser);
      }
    })
    .run()

  return { initial: miB(bufSize), compressed: { brotli: miB(serBrotliSize), pako: miB(serPakoSize), lz4js: miB(serLz4Size) }, ops: { brotli: brotliHz, pako: pakoHz, lz4js: lz4jsHz }, rate: { brotli: brotliRate, pako: pakoRate, lz4js: lz4jsRate }, options: { brotli: options.brotli.quality, pako: options.pako.level } }
}

const rep100 = metrologyPartReportData({ reportSize: 100 }); // 100 measurements 
const rep300 = metrologyPartReportData({ reportSize: 300 }); // 300 measurements 
const rep900 = metrologyPartReportData({ reportSize: 900 }); // 900 measurements 
const rep2700 = metrologyPartReportData({ reportSize: 2700 }); // 2700 measurements 

console.log()

const qualityBench = (full, metrologyData) => {
  const min = bench(full, metrologyData, { brotli: { quality: 1 }, pako: { level: 1 } });  // min compression
  const med = bench(full, metrologyData, { brotli: { quality: 5 }, pako: { level: 5 } });  // medium compression
  const max = bench(full, metrologyData, { brotli: { quality: 11 }, pako: { level: 9 } }); // max compression
  return { min, med, max }
}

let res100 = qualityBench(false, rep100);

plot('', res100)

let res300 = qualityBench(false, rep300);

plot('', res300)

let res900 = qualityBench(false, rep900);

plot('', res900)

let res2700 = qualityBench(false, rep2700);

plot('', res2700)


res100 = qualityBench(true, rep100);

plot('-Decompression', res100)

res300 = qualityBench(true, rep300);

plot('-Decompression', res300)

res900 = qualityBench(true, rep900);

plot('-Decompression', res900)

res2700 = qualityBench(true, rep2700);

plot('-Decompression', res2700)