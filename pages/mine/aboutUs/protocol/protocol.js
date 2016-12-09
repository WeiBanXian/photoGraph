var UserServer = require("../../../../server/user.js").User;

Page({
  data:{},
  formSubmit: function(e) {
    // console.log('form发生了submit事件，携带数据为：', e.detail.formId);
    var formId = e.detail.formId;
    UserServer.setFormId(formId);
    UserServer.templateRequest();
  },
  formReset: function() {
    console.log('form发生了reset事件')
  }
})