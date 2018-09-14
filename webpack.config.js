const path = require('path');

module.exports = {
    entry: {
        'main_bundle': './src/index.ts',
        'fsmDisplay_bundle': './src/views/StateMachineDisplay.ts'
    },
    devtool: 'inline-source-map',
    mode: "development",
    module: {
        rules: [{
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/
        }]
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ]
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'built')
    },
    externals: {
        'SDB': 'sdb-ts',
        'dagre': 'dagre'
    }
};