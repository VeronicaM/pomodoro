const path = require("path");
const webpack = require("webpack");
const ExtractTextPlugin = require('extract-text-webpack-plugin');
module.exports ={
	context:path.resolve('public'),
	entry:["./js/app.js"],
	output:{
		path:path.resolve('build/'),
		publicPath:'/public/assets/',
		filename:"bundle.js"
	},
	devServer:{
      contentBase:'public'
	},
	plugins:[new ExtractTextPlugin("styles.css"), 
	new webpack.ProvidePlugin({
		$:"jquery",
		jQuery:"jquery",
		"window.jQuery":"jquery"
	})],
	module:{
		rules:[
        {
            enforce: 'pre',
            test: /\.js$/,
            loader: 'jshint-loader',
            exclude: /node_modules/,
        },
        {
            test: /\.css$/,
             exclude: /node_modules/,
             include:path.resolve('public/vendor'),
	         use: ExtractTextPlugin.extract({
	          fallback: "style-loader",
	          use: "css-loader!autoprefixer-loader"
	        })
        }, 
        {
            test: /\.scss$/,
            exclude: /node_modules/,
            include:path.resolve('public/css'),
	        use: ExtractTextPlugin.extract({
	          fallback: "style-loader",
	          use: "css-loader!autoprefixer-loader!sass-loader"
	        })
        },
        {
	      test:  /\.(jpe?g|png|gif|svg|ttf)$/i,
	      use: [{
	        loader: 'url-loader',
	        options: { limit: 10000 } // Convert images < 10k to base64 strings
	      }]
	    },
		{
			test:/\.js$/,
			exclude:/node_modules/,
			use:[{
				loader:'babel-loader'
			//	options:{presets:['babel-preset-es2015'].map(require.resolve)}
			}]
		}]
	},
	resolve:{
		extensions:['.js','.es6']
	}
}