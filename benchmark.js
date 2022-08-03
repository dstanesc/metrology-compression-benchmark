import Benchmark from 'benchmark'

import {
  partReport,
  multipartReport
} from '@dstanesc/fake-metrology-data'

import { pack } from 'msgpackr';

import * as lz4 from 'lz4js'
import * as pako from 'pako'
import * as brotli from 'brotli'

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

const bench = ({ buf, bufSize }, options) => {
  const serPako = pako.deflate(buf, options.pako);
  const serLz4 = lz4.compress(buf);
  const serBrotli = brotli.compress(buf, options.brotli);

  const serPakoSize = serPako.byteLength;
  const serLz4Size = serLz4.byteLength;
  const serBrotliSize = serBrotli.byteLength;

  const brotliRate = rate(bufSize, serBrotliSize);
  const pakoRate = rate(bufSize, serPakoSize);
  const lz4jsRate = rate(bufSize, serLz4Size);

  console.log(`Metrology report size ${miB(bufSize)} MiB, brotli ${JSON.stringify(options.brotli)} compressed size ${miB(serBrotliSize)} MiB, compression rate ${brotliRate} %`);
  console.log(`Metrology report size ${miB(bufSize)} MiB, pako ${JSON.stringify(options.pako)} compressed size ${miB(serPakoSize)} MiB, compression rate ${pakoRate} %`);
  console.log(`Metrology report size ${miB(bufSize)} MiB, lz4 (default) compressed size ${miB(serLz4Size)} MiB, compression rate ${lz4jsRate} %`);

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
      brotli.compress(buf, options.brotli);
    })
    .add('Pako', async () => {
      pako.deflate(buf, options.pako);
    })
    .add('Lz4js', async () => {
      lz4.compress(buf);
    })
    .run()

  return { bufSize: bufSize, ops: { brotli: brotliHz, pako: pakoHz, lz4js: lz4jsHz }, rate: { brotli: brotliRate, pako: pakoRate, lz4js: lz4jsRate }, options: { brotli: options.brotli.quality, pako: options.pako.level } }
}

const rep100 = metrologyPartReportData({reportSize: 100}); // 100 measurements 
const rep300 = metrologyPartReportData({reportSize: 300}); // 300 measurements 
const rep900 = metrologyPartReportData({reportSize: 900}); // 900 measurements 
const rep2700 = metrologyPartReportData({reportSize: 2700}); // 2700 measurements 

console.log()

const qualityBench = (metrologyData) => {
  const min = bench(metrologyData, { brotli: { quality: 1 }, pako: { level: 1 } });  // min compression
  const med = bench(metrologyData, { brotli: { quality: 5 }, pako: { level: 5 } });  // medium compression
  const max = bench(metrologyData, { brotli: { quality: 11 }, pako: { level: 9 } }); // max compression
  return { min, med, max }
}

const res100 = qualityBench(rep100);

console.log(res100)

const res300 = qualityBench(rep300);

console.log(res300)

const res900 = qualityBench(rep900);

console.log(res900)

const res2700 = qualityBench(rep2700);

console.log(res2700)
