import { showTip } from '../../utils/tip'
import { getUID } from '../../utils/permission'
import { isISBN } from '../../utils/validator'

var app = getApp()
var searchBar // 保存home-search-bar组件的引用

Page({
  data: {
    searchResults: null // 初始化搜索结果为 null


  },

  searchAPI: function (type, value) {
    let that = this; // 保存当前Page实例的引用，以便在异步回调中使用
    // 发送请求到ChatGPT API
    return wx.request({
      url: 'https://open.bigmodel.cn/api/paas/v4/chat/completions', // API的URL
      method: 'POST', // 请求方法为POST
      header: {
        'Content-Type': 'application/json', // 设置请求头，指明发送的数据类型为JSON
        'Authorization': `Bearer d9fab226661deeab56eac534fb98fbf4.ygJNHLQX3mIyyFOV` // 设置授权令牌
      },
      data: {
        model: "glm-4", // 指定要使用的模型
        messages: [
          {
            role: 'system',
            content: '你是一个医疗文献搜索系统'
          },
          {
            role: 'user',
            content: `文献的${type}为${value}，请为我搜索相关的文献`
          },
          {
            role: 'user',
            content: `请按文献名、作者和摘要的格式给出回答，无论是否能够直接搜索，回答只包括文献名、作者和摘要，不需要其他文本`
          }
        ]
      },
      success: function (res) {
        console.log('搜索结果:', res.data.choices[0].message.content);
        // 在这里处理成功的搜索结果，例如更新页面数据
        that.setData({
          searchResults: res.data.choices[0].message.content // 更新页面数据中的搜索结果
        });
      },
      fail: function (err) {
        console.error('搜索错误:', err);
        // 在这里处理搜索错误
        that.setData({
          searchResults: null // 可以选择清空结果或者设置一个错误提示
        });
      }

    });
  },
  onSearch: function(e) {
    console.log('搜索内容:', e.detail.value);
    console.log('搜索类型:', e.detail.type);
    if (e.detail.value) { 
      // 调用API函数，并处理结果
       this.searchAPI(e.detail.value, e.detail.type);
    }
},

})
