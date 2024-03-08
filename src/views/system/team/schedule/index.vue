<template>
  <div class="app-container">
    <el-calendar v-model="value" id="calendar">
      <div slot="dateCell" slot-scope="{ data }" @click="viewDayWork(data)" v-popover:popover>
        <p>
          {{ data.day.split('-').slice(1).join('-') }}
        </p>
      </div>
    </el-calendar>
  </div>
</template>

<script>
import { compareDate } from "@/api/system/schedule";
export default {
  name: "calendar",
  components: {},
  data() {
    return {
      value: new Date(),
      scheduleDate: "",
      // 可编辑
      canEdit: false,
    };
  },
  mounted() { },
  methods: {
    // 日历-处理点击查看日历日期事件
    async viewDayWork(date) {
      await compareDate(date.day).then(r => {
        if (r.msg == 'true') {
          this.canEdit = true;
        } else {
          this.canEdit = false;
        }
      });
      // 日历事件和ID清零，日期选择为选择的日期
      this.scheduleDate = date.day;
      this.$router.push({ path: '/work/work/schedule1', query: { scheduleDate: this.scheduleDate, canEdit: this.canEdit } })
    },
  },
}
</script>
<style scoped>
.el-calendar-day {
  box-sizing: border-box;
  padding: 5px;
  height: 80px;
}
</style>