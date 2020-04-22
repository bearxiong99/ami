export default {
  column: [{
    label: 'User Info',
    prop: 'info',
    option: {
      menuBtn:true,
      submitText: 'Submit',
      emptyText:'Clear',
      labelWidth: 120,
      column: [{
        label: 'Avatar',
        type: 'upload',
        listType: 'picture-img',
        propsHttp: {
          res: 'data',
          url: 'link',
        },
        canvasOption: {
          text: 'blade',
          ratio: 0.1
        },
        action: '/api/blade-resource/oss/endpoint/put-file',
        tip: 'Only upload jpg / png user avatars, and no more than 500kb',
        span: 12,
        row: true,
        prop: 'avatar'
      }, {
        label: 'Name',
        span: 12,
        row: true,
        prop: 'name'
      }, {
        label: 'User Name',
        span: 12,
        row: true,
        prop: 'realName'
      }, {
        label: 'Phone Number',
        span: 12,
        row: true,
        prop: 'phone'
      }, {
        label: 'Email',
        prop: 'email',
        span: 12,
        row: true,
      }]
    }
  }, {
    label: 'Edit Password',
    prop: 'password',
    option: {
      submitText: 'Submit',
      emptyText:'Clear',
      labelWidth: 140,
      column: [{
        label: 'Old Password',
        span: 12,
        row: true,
        type: 'password',
        prop: 'oldPassword'
      }, {
        label: 'New Password',
        span: 12,
        row: true,
        type: 'password',
        prop: 'newPassword'
      }, {
        label: 'Confirm Password',
        span: 12,
        row: true,
        type: 'password',
        prop: 'newPassword1'
      }]
    }
  }]
}
