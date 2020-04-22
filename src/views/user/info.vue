<template>
  <div>
    <basic-container>
      <avue-tabs :option="option"
                 v-model="form"
                 @change="handleChange"
                 @submit="handleSubmit">
                 </avue-tabs>
    </basic-container>
  </div>
</template>

<script>
  // import option from "@/const/user/info";
  import {getUserInfo, update, updatePassword} from "@/api/system/user";


  export default {
    data() {
      const validatePass = (rule, value, callback) => {
        let reg = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{6,40}$/
        let msg = 'Password length is between 6 ~ 40 digits and contain symbols, numbers and letters'
        if (value === '') {
          callback(new Error('Please enter password'));
        } else if (!reg.test(value)) {
          callback(new Error(msg));
        } else {
          callback();
        }
      };
      const validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('Please enter password again'));
        } else if (value !== this.form.newPassword) {
          callback(new Error('The two passwords do not match'));
        } else {
          callback();
        }
      };
      return {
        type: "info",
        option: {
          submitText: 'Submit',
          emptyText:'Clear',
          column: [
            {
              label: 'User Info',
              prop: 'info',
              emptySize:'small',
              option: {
                // menuBtn:false,
                
                labelWidth: 130,
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
                  prop: 'name',
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
                  prop: 'oldPassword',
                  rules: [{
                    required: true,
                    trigger: 'blur',
                    validator: validatePass,
                  }]
                }, {
                  label: 'New Password',
                  span: 12,
                  row: true,
                  type: 'password',
                  prop: 'newPassword',
                  rules: [{
                    required: true,
                    validator: validatePass,
                    trigger: 'blur',
                  }]
                }, {
                  label: 'Confirm Password',
                  span: 12,
                  row: true,
                  type: 'password',
                  prop: 'newPassword1',
                  rules: [{
                    required: true,
                    validator: validatePass2,
                    trigger: 'blur',
                  }]
                }]
              }
            }
          ]
        },
        form: {}
      };
    },
    created() {
      this.handleWitch();
    },
    methods: {
      handleSubmit() {
        if (this.type === "info") {
          update(this.form).then(res => {
            if (res.data.success) {
              this.$message({
                type: "success",
                message: this.$t('info.editInfoSuccess')
              });
            } else {
              this.$message({
                type: "error",
                message: res.data.msg
              });
            }
          })
        } else {
          updatePassword(this.form.oldPassword, this.form.newPassword, this.form.newPassword1).then(res => {
            if (res.data.success) {
              this.$message({
                type: "success",
                message: this.$t('info.editPwdSuccess')
              });
            } else {
              this.$message({
                type: "error",
                message: res.data.msg
              });
            }
          })
        }
      },
      handleWitch() {
        if (this.type === "info") {
          getUserInfo().then(res => {
            const user = res.data.data;
            this.form = {
              id: user.id,
              avatar: user.avatar,
              name: user.name,
              realName: user.realName,
              phone: user.phone,
              email: user.email,
            }
          });
        }
      },
      handleChange(item) {
        this.type = item.prop;
        this.handleWitch();
      }
    }
  };
</script>

<style>
</style>
