import Promisify from '../../utils/promisify'
import { isISBN } from '../../utils/validator'
Page({
//   chatData 是一个数组，用于存储聊天记录，每个记录是一个对象，包含 isme（表示消息是否由当前用户发送），name（用户或机器人的名字），touxiang（头像图片链接），chat（消息内容），和 error（表示消息是否发送失败）。
// mychat 是一个字符串，用于存储用户输入的聊天内容。
// scrollTop 是一个数值，用于控制聊天界面的滚动位置。
data: {
  chatData: [
    {
      isme: false, // 标记为机器发送的消息
      touxiang: "https://q1.itc.cn/q_70/images03/20240207/6d8a48d4c8bd457e97a9db068f55b2b4.jpeg",
      chat: "请 输 入 患 者 症 状 或 检 测 结 果",
    }
  ],
  mychat: "",
  scrollTop: 999999
},
//   sendChat 方法首先获取用户输入的聊天内容 mychat 和用户信息 user（从本地存储中获取）。
// 然后创建一个新的聊天记录对象 charItem，并将其添加到 chatData 数组中。
// 最后，调用 callChatGPT 方法，将聊天内容作为参数传递。
sendChat: function () {
  var chat = this.data.mychat;
  var charItem = {
    isme: true, // 标记为用户发送的消息
    touxiang: "用户头像链接", // 应设置用户的头像链接
    chat: chat
  };
  this.setData({
    chatData: this.data.chatData.concat(charItem),
    mychat: ""
  });
  this.callChatGPT(chat);
},
  //bindInput 方法用于更新 mychat 状态，当用户在输入框中输入时，它会被调用。
  bindInput: function (e) {
    this.setData({
      mychat: e.detail.value
    });
  },
  callChatGPT: function (inputText) {
    let that = this; // 保存当前Page实例的引用，以便在异步回调中使用
    // 发送请求到ChatGPT API
    wx.request({
      url: 'https://open.bigmodel.cn/api/paas/v4/chat/completions', // API的URL
      method: 'POST', // 请求方法为POST
      header: {
        'Content-Type': 'application/json', // 设置请求头，指明发送的数据类型为JSON
        'Authorization': `Bearer d9fab226661deeab56eac534fb98fbf4.ygJNHLQX3mIyyFOV` // 设置授权令牌
      },
      data: {
        model: "glm-4", // 指定要使用的模型
        messages: [
                    {
                      role: 'user',
                      //content: '请为智谱开放平台创作一个吸引人的slogan'
                      content: inputText // 发送消息历史记录
                    }
                  ]
      },
      success: function (res) {
        let response = res.data.choices[0].message.content;
        that.setData({
          chatData: that.data.chatData.concat({
            isme: false, // 标记为机器回复的消息
            touxiang:"https://q1.itc.cn/q_70/images03/20240207/6d8a48d4c8bd457e97a9db068f55b2b4.jpeg",
            chat: response,
          })
        });
        console.log('成功调用API:', response); // 在控制台输出成功信息
      },
      fail: function (err) { // 请求失败的回调函数
        // 更新聊天数据，添加错误信息到聊天记录中
        that.setData({
          chatData: that.data.chatData.concat({
            touxiang:"https://q1.itc.cn/q_70/images03/20240207/6d8a48d4c8bd457e97a9db068f55b2b4.jpeg",
            chat: "请求失败，请稍后再试。",
          })
        });
        console.error('API请求失败:', err); // 在控制台输出错误信息
      }
    });
  },
  onScan: function () {
    var scanfn = Promisify(wx.scanCode)
    scanfn({scanType: ['barCode']}).then(res => {
      if (!isISBN(res.result)) {
        return wx.showModal({
          title: '扫描内容不合法',
          content: '请扫描图书ISBN条形码',
          showCancel: false
        })
      }
    })
  }
});
