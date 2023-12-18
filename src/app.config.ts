export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/thirtySix/result',
    'pages/thirtySix/detail',
    'pages/twelve/result',
    'pages/twelve/detail',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  plugins: {
    "wxacommentplugin": {
      "version": "latest",
      "provider": "wx82e6ae1175f264fa" // 必须填该评价组件appid，该示例值即为评价组件appid（复制时请去掉注释）
    }
  }
})
