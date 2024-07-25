
/**
 * 搜索框
 * @event <focus> <input> <clear> <hide> <search>
 */
Component({
  properties: {
    defaultText: {
      type: String,
      value: '搜索'
    },
    focusText: {
      type: String,
      value: '搜索'
    },
    // 是否显示背景遮罩，默认否
    showMask: {
      type: Boolean,
      value: false
    },
    // 点击背景是否自动关闭，默认是
    tappableMask: {
      type: Boolean,
      value: true
    }
  },
  data: {
    isFocus: false,
    value: ''
  },
  methods: {
    _onFocus: function () {
      this.setData({ isFocus: true })
      this.triggerEvent('focus')
    },

    _onHide: function () {
      this.setData({
        value: '',
        isFocus: false
      })
      this.triggerEvent('hide')
    },

    _onClear: function () {
      this.setData({ value: '' })
      this.triggerEvent('clear')
    },

    _onInput: function (e) {
      this.setData({ value: e.detail.value })
      this.triggerEvent('input', {value: e.detail.value})
    },

    _onTapMask: function () {
      if (this.data.tappableMask) this._onHide()
    },

    // 在输入框不为空时搜索
    _onSearch: function (e) {
      if (this.data.value) {
        this.triggerEvent('search', { value: this.data.value })
      }
    }
  }
})
