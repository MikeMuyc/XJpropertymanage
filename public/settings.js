window.mapConfig = {
    map: {
        id: 'baseMap',
        view: {
            center: {
                coord: [120.153, 30.341]
            },
            zoom: 14,
            maxZoom: 18
        },
        controls: [{
            name: 'zoom',
            zoomInTipLabel: '放大',
            zoomOutTipLabel: '缩小'
        }],
        events: ['singleclick', 'pointermove']
    },
    baseLayer: [{
        "name": "imageMap_base",
        "source": {
            "type": "XYZ",
            "crossOrigin": "true",
            "url": "http://t7.tianditu.com/DataServer?tk=59d3a78163c2741d6aa0cb12f77fa62a&T=img_w&x={x}&y={y}&l={z}"
        },
        "visible": true
    },
        {
            "name": "imageMap_symbol",
            "source": {
                "type": "XYZ",
                "crossOrigin": "true",
                "url": "http://t7.tianditu.com/DataServer?tk=59d3a78163c2741d6aa0cb12f77fa62a&T=cia_w&x={x}&y={y}&l={z}"
            },
            "zIndex": 2,
            "visible": true
        }]
}

//文件上传的后台地址

window.upBaseUrl = `http://124.160.109.243:31400`
//文件下载的后台地址+接口路径

window.imgDownUrl = `http://124.160.109.243:31400/easy/ud/download/`
