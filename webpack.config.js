'use strict';

const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	plugins: [
		new MiniCssExtractPlugin({ filename: 'css/[name].css' }),
		new CopyPlugin({
			patterns: [
				{
					from: './assets',
					to: './assets',
				},
			],
		}),
		new HtmlWebpackPlugin({
			title: 'Nutrition',
			filename: 'index.html',
			template: './index.html',
		}),
	],
	mode: 'development',
	target: 'web',
	entry: ['./js/script.js', '@babel/polyfill', './css/style.css'],
	output: {
		filename: 'js/[name].js',
		path: path.resolve(__dirname, 'build'),
		clean: true,
	},
	devtool: 'source-map',
	module: {
		rules: [
			{
				test: /\.m?js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [
							[
								'@babel/preset-env',
								{
									debug: true,
									corejs: 3,
									useBuiltIns: 'usage',
								},
							],
						],
					},
				},
			},
			{
				test: /\.css$/i,
				use: [MiniCssExtractPlugin.loader, 'css-loader'],
				type: 'javascript/auto',
				enforce: 'pre',
				include: path.resolve(__dirname, 'css'),
			},
		],
	},
};
