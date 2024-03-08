<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :rules="rules"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="88px"
    >
      <el-form-item label="报表时间" prop="reportDate">
        <el-date-picker
          v-model="dateRange"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >查看</el-button
        >
      </el-form-item>
    </el-form>
    <el-tabs v-model="activeName">
      <el-tab-pane label="工序质量报表" name="first">
        <el-table
          v-loading="loading"
          :data="processVos"
          row-key="processId"
          :expand-row-keys="processVoExpands"
          @expand-change="expandRowHandleOfProcess"
        >
          <el-table-column type="expand">
            <template slot="header" slot-scope="scope">
              <el-button
                type="text"
                size="mini"
                @click="toggleRowExpansionOfProcess"
                >{{ isAllExtendOfProcess ? "关闭" : "展开" }}</el-button
              >
            </template>
            <template slot-scope="scope">
              <el-table
                v-loading="processLoading"
                border
                :data="scope.row.details"
                style="margin: 15px"
              >
                <el-table-column
                  label="物料图号"
                  align="center"
                  prop="itemCode"
                />
                <el-table-column
                  label="总数量"
                  align="center"
                  prop="sumQuality"
                />
                <el-table-column
                  label="合格数量"
                  align="center"
                  prop="productionQuality"
                />
                <el-table-column
                  label="废品数量"
                  align="center"
                  prop="defectQuality"
                />
                <el-table-column label="废品率" align="center">
                  <template slot-scope="scope">
                    <span
                      >{{
                        getPercent(
                          scope.row.defectQuality,
                          scope.row.sumQuality
                        )
                      }}%</span
                    >
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column label="工序" align="center" prop="processName" />
          <el-table-column label="总数量" align="center" prop="sumQuality" />
          <el-table-column
            label="合格数量"
            align="center"
            prop="productionQuality"
          />
          <el-table-column
            label="废品数量"
            align="center"
            prop="defectQuality"
          />
          <el-table-column label="废品率" align="center">
            <template slot-scope="scope">
              <span
                >{{
                  getPercent(scope.row.defectQuality, scope.row.sumQuality)
                }}%</span
              >
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="员工质量报表" name="second">
        <el-table
          v-loading="loading"
          :data="userVos"
          row-key="userId"
          :expand-row-keys="userVoExpands"
          @expand-change="expandRowHandleOfUser"
        >
          <el-table-column type="expand">
            <template slot="header" slot-scope="scope">
              <el-button
                type="text"
                size="mini"
                @click="toggleRowExpansionOfUser"
                >{{ isAllExtendOfUser ? "关闭" : "展开" }}</el-button
              >
            </template>
            <template slot-scope="scope">
              <el-table
                v-loading="userLoading"
                border
                :data="scope.row.details"
                style="margin: 15px"
              >
                <el-table-column
                  label="物料图号"
                  align="center"
                  prop="itemCode"
                />
                <el-table-column
                  label="总数量"
                  align="center"
                  prop="sumQuality"
                />
                <el-table-column
                  label="合格数量"
                  align="center"
                  prop="productionQuality"
                />
                <el-table-column
                  label="废品数量"
                  align="center"
                  prop="defectQuality"
                />
                <el-table-column label="废品率" align="center">
                  <template slot-scope="scope">
                    <span
                      >{{
                        getPercent(
                          scope.row.defectQuality,
                          scope.row.sumQuality
                        )
                      }}%</span
                    >
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column label="员工" align="center" prop="nickName" />
          <el-table-column label="总数量" align="center" prop="sumQuality" />
          <el-table-column
            label="合格数量"
            align="center"
            prop="productionQuality"
          />
          <el-table-column
            label="废品数量"
            align="center"
            prop="defectQuality"
          />
          <el-table-column label="废品率" align="center">
            <template slot-scope="scope">
              <span
                >{{
                  getPercent(scope.row.defectQuality, scope.row.sumQuality)
                }}%</span
              >
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="供货质量报表" name="third">
        <el-table
          v-loading="loading"
          :data="supplyVos"
          row-key="supplyId"
          :expand-row-keys="supplyVoExpands"
          @expand-change="expandRowHandleOfSupply"
        >
          <el-table-column type="expand">
            <template slot="header" slot-scope="scope">
              <el-button
                type="text"
                size="mini"
                @click="toggleRowExpansionOfSupply"
                >{{ isAllExtendOfSupply ? "关闭" : "展开" }}</el-button
              >
            </template>
            <template slot-scope="scope">
              <el-table
                v-loading="supplyLoading"
                border
                :data="scope.row.details"
                style="margin: 15px"
              >
                <el-table-column
                  label="物料图号"
                  align="center"
                  prop="itemCode"
                />
                <el-table-column
                  label="总数量"
                  align="center"
                  prop="sumQuality"
                />
                <el-table-column
                  label="合格数量"
                  align="center"
                  prop="productionQuality"
                />
                <el-table-column
                  label="废品数量"
                  align="center"
                  prop="defectQuality"
                />
                <el-table-column label="废品率" align="center">
                  <template slot-scope="scope">
                    <span
                      >{{
                        getPercent(
                          scope.row.defectQuality,
                          scope.row.sumQuality
                        )
                      }}%</span
                    >
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column label="供应商" align="center" prop="supplyName" />
          <el-table-column label="总数量" align="center" prop="sumQuality" />
          <el-table-column
            label="合格数量"
            align="center"
            prop="productionQuality"
          />
          <el-table-column
            label="废品数量"
            align="center"
            prop="defectQuality"
          />
          <el-table-column label="废品率" align="center">
            <template slot-scope="scope">
              <span
                >{{
                  getPercent(scope.row.defectQuality, scope.row.sumQuality)
                }}%</span
              >
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { getReportInfo } from "@/api/quality/daily";
export default {
  name: "Daily",
  dicts: ["defect_type"],
  data() {
    return {
      // 遮罩层
      loading: false,
      // 默认标签页
      activeName: "first",
      // 显示搜索条件
      showSearch: true,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        startDate: null,
        endDate: null,
        reportDate: null,
      },
      // 表单校验
      rules: {
        reportDate: [
          { required: true, message: "报告时间不能为空", trigger: "blur" },
        ],
      },
      // 工序质量报表
      processLoading: false,
      processVos: [],
      // 要展开的行
      processVoExpands: [],
      isAllExtendOfProcess: false,
      // 员工质量报表
      userLoading: false,
      userVos: [],
      // 要展开的行
      userVoExpands: [],
      isAllExtendOfUser: false,
      // 供应商质量报表
      supplyLoading: false,
      supplyVos: [],
      // 要展开的行
      supplyVoExpands: [],
      isAllExtendOfSupply: false,
      // 查询时间范围
      dateRange: [],
    };
  },
  created() {},
  watch: {
    dateRange(n) {
      if (n && n.length == 2) {
        this.queryParams.startDate = n[0];
        this.queryParams.endDate = n[1];
        this.queryParams.reportDate = n[0];
      } else {
        this.queryParams.startDate = null;
        this.queryParams.endDate = null;
        this.queryParams.reportDate = null;
      }
    },
  },
  methods: {
    /** 搜索按钮操作 */
    handleQuery() {
      this.processVos = [];
      this.processVoExpands = [];
      this.isAllExtendOfProcess = false;
      this.userVos = [];
      this.userVoExpands = [];
      this.isAllExtendOfUser = false;
      this.supplyVos = [];
      this.supplyVoExpands = [];
      this.isAllExtendOfSupply = false;
      this.getReportInfo();
    },
    /** 查询质量报表 */
    getReportInfo() {
      this.$refs["queryForm"].validate((valid) => {
        if (valid) {
          getReportInfo(this.queryParams).then((r) => {
            this.processVos = r.data.processVos;
            this.userVos = r.data.userVos;
            this.supplyVos = r.data.supplyVos;
          });
        }
      });
    },
    /** 求百分比 */
    getPercent(num, total) {
      num = parseFloat(num);
      total = parseFloat(total);
      if (isNaN(num) || isNaN(total)) {
        return "-";
      }
      return total <= 0 ? "0" : Math.round((num / total) * 10000) / 100.0;
    },
    /** 工序质量报表展开 */
    expandRowHandleOfProcess(row, expandedRows) {
      if (this.processVos.length == expandedRows.length) {
        this.isAllExtendOfProcess = true;
      } else {
        this.isAllExtendOfProcess = false;
      }

      if (this.processVoExpands.includes(row.processId)) {
        this.processVoExpands = this.processVoExpands.filter(
          (val) => val !== row.processId
        );
      } else {
        this.processVoExpands.push(row.processId);
      }
    },
    /** 工序质量报表全部展开(关闭)*/
    toggleRowExpansionOfProcess() {
      if (this.isAllExtendOfProcess) {
        this.processVoExpands = [];
        this.isAllExtendOfProcess = false;
      } else {
        this.processVoExpands = [];
        this.processVoExpands = this.processVos.map((r) => r.processId);
        this.isAllExtendOfProcess = true;
      }
    },
    /** 员工质量报表展开 */
    expandRowHandleOfUser(row, expandedRows) {
      if (this.userVos.length == expandedRows.length) {
        this.isAllExtendOfUser = true;
      } else {
        this.isAllExtendOfUser = false;
      }

      if (this.userVoExpands.includes(row.userId)) {
        this.processVoExpands = this.processVoExpands.filter(
          (val) => val !== row.userId
        );
      } else {
        this.userVoExpands.push(row.userId);
      }
    },
    /** 员工质量报表全部展开(关闭)*/
    toggleRowExpansionOfUser() {
      if (this.isAllExtendOfUser) {
        this.userVoExpands = [];
        this.isAllExtendOfUser = false;
      } else {
        this.userVoExpands = [];
        this.userVoExpands = this.userVos.map((r) => r.userId);
        this.isAllExtendOfUser = true;
      }
    },
    /** 供货质量报表展开 */
    expandRowHandleOfSupply(row, expandedRows) {
      if (this.supplyVos.length == expandedRows.length) {
        this.isAllExtendOfSupply = true;
      } else {
        this.isAllExtendOfSupply = false;
      }

      if (this.supplyVoExpands.includes(row.supplyId)) {
        this.supplyVoExpands = this.supplyVoExpands.filter(
          (val) => val !== row.supplyId
        );
      } else {
        this.supplyVoExpands.push(row.supplyId);
      }
    },
    /** 供货质量报表全部展开(关闭)*/
    toggleRowExpansionOfSupply() {
      if (this.isAllExtendOfSupply) {
        this.supplyVoExpands = [];
        this.isAllExtendOfSupply = false;
      } else {
        this.supplyVoExpands = [];
        this.supplyVoExpands = this.supplyVos.map((r) => r.supplyId);
        this.isAllExtendOfSupply = true;
      }
    },
  },
};
</script>
