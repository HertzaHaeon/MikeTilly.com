'use strict';

import gulp from 'gulp';
import del from 'del';
import DefinePlugin from './node_modules/webpack/lib/DefinePlugin';
import UglifyJsPlugin from 'webpack-uglify-js-plugin';
import rename from 'gulp-rename';
import webpack from 'webpack-stream';
import postcss from 'gulp-postcss';
import less from 'postcss-less-engine';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';

gulp.task('default', ['dev.js', 'dev.css'], function() {});
gulp.task('prod', ['prod.clean', 'prod.js', 'prod.css'], function() {});

gulp.task('watch', function() {
  gulp.watch(['src/js/**/*.js', 'src/js/**/*.jsx'], ['dev.js']);
  gulp.watch('src/less/*.less', ['dev.css']);
});

gulp.task('dev.js', function() {
  return gulp.src('src/js/main.js')
    .pipe(webpack({
      module: {
        loaders: [{
          test: /.jsx?$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
          query: {
            presets: ['es2015', 'react']
          }
        }, {
          test: /.json$/,
          loader: 'json-loader'
        }]
      },
      output: {
        filename: 'app.js'
      },
      plugins: [],
      devtool: 'source-map',
      node: {
        console: true,
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
      }
    }))
    .pipe(gulp.dest('build/js/'));
});
gulp.task('dev.css', function() {
  return gulp.src('./src/less/main.less')
    .pipe(postcss([
      less()
    ], { parser: less.parser }))
    .pipe(postcss([
      autoprefixer({browsers: ['last 1 version']}),
    ]))
    .pipe(rename({extname: ".css"}))
    .pipe(gulp.dest('./build/css/'));
});

gulp.task('prod.js', function() {
  return gulp.src('src/js/main.js')
    .pipe(webpack({
      module: {
        loaders: [{
          test: /.jsx?$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
          query: {
            presets: ['es2015', 'react']
          }
        }, {
          test: /.json$/,
          loader: 'json-loader'
        }]
      },
      output: {
        filename: 'app.js'
      },
      plugins: [
        new DefinePlugin({
          'process.env':{
            'NODE_ENV': JSON.stringify('production')
          }
        }),
        new UglifyJsPlugin({
          cacheFolder: './temp/',
          debug: true,
          minimize: true,
          sourceMap: true,
          output: {
            comments: false
          },
          compressor: {
            warnings: false
          }
        })
      ],
      node: {
        console: true,
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
      }
    }))
    .pipe(gulp.dest('build/js/'));
});
gulp.task('prod.css', function() {
  return gulp.src('./src/less/main.less')
    .pipe(postcss([
      less()
    ], { parser: less.parser }))
    .pipe(postcss([
      autoprefixer({browsers: ['last 1 version']}),
      cssnano(),
    ]))
    .pipe(rename({extname: ".css"}))
    .pipe(gulp.dest('./build/css/'));
});
gulp.task('prod.clean', function() {
  del.sync(['./build/js/*', './build/css/*']);
});