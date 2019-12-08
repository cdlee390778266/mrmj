module.exports = {
    baseUrl: './',
    productionSourceMap: false,
    devServer: {
        proxy: {
            '/api':{
                target:'http://132.232.51.40:9106/',
                changeOrigin:true,
                pathRewrite:{
                    '/api':''
                }
            }
        }
    }
}