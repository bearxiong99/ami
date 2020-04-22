<template>
  <span>
    <i class="icon-suoping"
       @click="handleLock"></i>
    <el-dialog :title="$t('lock.setPassword')"
               :visible.sync="box"
               width="30%"
               append-to-body>
      <el-form :model="form"
               ref="form"
               label-width="auto">
        <el-form-item :label="$t('lock.password')"
                      prop="passwd"
                      :rules="[{ required: true, message: $t('lock.emptyPassword')}]">
          <el-input :maxlength="30" v-model="form.passwd"
                    :placeholder="$t('global.enterPassword')"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                   @click="handleSetLock">{{$t('global.confirm')}}</el-button>
      </span>
    </el-dialog>
  </span>
</template>

<script>
  import {validatenull} from "@/util/validate";
  import {mapGetters} from "vuex";

  export default {
    name: "top-lock",
    data() {
      return {
        box: false,
        form: {
          passwd: ""
        }
      };
    },
    created() {
    },
    mounted() {
    },
    computed: {
      ...mapGetters(["lockPasswd"])
    },
    props: [],
    methods: {
      handleSetLock() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            this.$store.commit("SET_LOCK_PASSWD", this.form.passwd);
            this.handleLock();
          }
        });
      },
      handleLock() {
        if (validatenull(this.lockPasswd)) {
          this.box = true;
          return;
        }
        this.$store.commit("SET_LOCK");
        setTimeout(() => {
          this.$router.push({path: "/lock"});
        }, 100);
      }
    },
    components: {}
  };
</script>

<style lang="scss" scoped>
</style>
