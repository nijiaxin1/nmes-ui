<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px" :rule="rules">
      <!--<el-form-item label="器具码" prop="utensilCode">
        <el-input
          v-model="queryParams.utensilCode"
          placeholder="请输入器具码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>-->
      <el-form-item label="生产日期">
        <el-date-picker clearable
                        v-model="dateRangeTime"
                        type="daterange"
                        value-format="yyyy-MM-dd"
                        placeholder="请选择生产日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="工序" prop="processId">
        <el-select v-model="queryParams.processId" placeholder="请选择工序">
          <el-option
            v-for="dict in processList"
            :key="dict.code"
            :label="dict.desc"
            :value="dict.code+''"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <!--<el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['records:recordsUtensilCodeInfoHistory:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['records:recordsUtensilCodeInfoHistory:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['records:recordsUtensilCodeInfoHistory:remove']"
        >删除</el-button>
      </el-col>-->
      <!--<el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['records:recordsUtensilCodeInfoHistory:export']"
        >导出</el-button>
      </el-col>-->
        <!--<el-col :span="1.5">
            <el-button
                    type="info"
                    icon="el-icon-upload2"
                    size="mini"
                    @click="handleImport"
            >导入</el-button>
        </el-col>-->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="planFinishList" @selection-change="handleSelectionChange" max-height="500px" >
      <el-table-column type="index" width="50"  fixed="left"/>
      <el-table-column label="工序" align="center" prop="processName" fixed="left" />
      <el-table-column align="center" :label="item" :prop="item" :key="index" v-for="(item, index) in columnList"/>
      <el-table-column label="累计" align="center" prop="totalNum"  fixed="right"/>
      <el-table-column label="计划" align="center" prop="totalPlanNum"  fixed="right"/>
      <el-table-column label="缺额" align="center" prop="lackNum"  fixed="right"/>
      <el-table-column label="天数" align="center" prop="dayNum" fixed="right"/>
      <el-table-column label="平均每天" align="center" prop="averageNum" fixed="right"/>
    </el-table>

  </div>
</template>

<script>
import { searchItemList, searchUserListByName, getProcessesList, getNowDateStr, getBeforeMonthDateStr } from '@/api/enumsSelect';
import { listProcessProduce } from "@/api/sheet/planFinishRecords";
import { getToken } from "@/utils/auth";

export default {
  name: "listProcessProduce",
  data() {
    return {
      // 遮罩层
      loading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      dateRangeTime:[getBeforeMonthDateStr(1), getNowDateStr()],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        processId: null,
        beginTime: null,
        endTime: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        /*itemId: [
          { required: true, message: "物料图号不能为空", trigger: "blur" }
        ],*/
        planProduceDate: [
          { required: true, message: "请先选择生产日期再查询", trigger: "blur" }
        ]
      },
      columnList:[],
      planFinishList:[],
      //物料信息
      itemList: [],
      itemSearchLoading: true,
      //员工
      memberList:[],
      memberSearchLoading: true,
      //工序列表
      processList: [],
    };
  },
  created() {
    this.getProcessesList();
    this.getList();
  },
  methods: {
    /** 工序列表 */
    getProcessesList() {
      getProcessesList().then(response => {
        this.processList = response.data;
      });
    },
    /** 查询器具码历史信息列表 */
    getList() {
      this.loading = true;
      if (null != this.dateRangeTime && '' != this.dateRangeTime) {
        this.queryParams["beginTime"] = this.dateRangeTime[0];
        this.queryParams["endTime"] = this.dateRangeTime[1];
      }else{
        this.$modal.msgError("请选择日期");
        this.loading = false;
        return false;
      }
      listProcessProduce(this.queryParams).then(response => {
        this.columnList = response.data.tableColumnPropList;
        this.planFinishList = response.data.dataList;
        this.total = response.total;
        this.loading = false;
      }).finally(()=>this.loading = false);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        utensilCode: null,
        downUtensilCode: null,
        itemId: null,
        itemCode: null,
        workNum: null,
        processesId: null,
        processesName: null,
        planOperateId: null,
        planOperateBy: null,
        produceDate: null,
        planWorkshopPersonalId: null,
        remark: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        delFlag: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加器具码历史信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getRecordsUtensilCodeInfoHistory(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改器具码历史信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
        this.loading = true;
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateRecordsUtensilCodeInfoHistory(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(()=>this.loading = false);
          } else {
            addRecordsUtensilCodeInfoHistory(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            }).finally(()=>this.loading = false);
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除器具码历史信息编号为"' + ids + '"的数据项？').then(function() {
        return delRecordsUtensilCodeInfoHistory(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    //远程搜索物料信息
    remoteSearchItem(itemCode) {
      if (itemCode !== '' && this.itemSearchLoading) {
        this.itemSearchLoading = false;
        setTimeout(() => {
          this.itemSearchLoading = true;
          searchItemList(itemCode).then(response => {
            this.itemList = response.data;
          });
        }, 300);
      } else {
        this.itemList = [];
      }
    },

    //远程搜索物料信息
    remoteSearchMember(memberName) {
      if (memberName !== '' && this.memberSearchLoading) {
        this.memberSearchLoading = false;
        setTimeout(() => {
          this.memberSearchLoading = true;
          searchUserListByName(memberName).then(response => {
            this.memberList = response.data;
          });
        }, 300);
      } else {
        this.memberList = [];
      }
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('records/recordsUtensilCodeInfoHistory/export', {
        ...this.queryParams
      }, `recordsUtensilCodeInfoHistory_${new Date().getTime()}.xlsx`)
    },
    /** 导入按钮操作 */
    handleImport() {
        this.upload.title = "器具码历史信息导入";
        this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
        this.download('records/recordsUtensilCodeInfoHistory/importTemplate',{...this.queryParams}, '器具码历史信息导入模板.xlsx');
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
        this.loading = true;
        this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
        this.upload.open = false;
        this.upload.isUploading = false;
        this.loading = false;
        this.$refs.upload.clearFiles();
        this.$alert(response.msg, "导入结果", { dangerouslyUseHTMLString: true, callback: action=>{
                this.getList();
            } });

    },

    // 提交上传文件
    submitFileForm() {
        this.$refs.upload.submit();
    },

    handleSpanMethod({ row, column, rowIndex, columnIndex }){
      if (columnIndex === 1) {
        // 获取当前单元格的值
        const currentValue = row[column.property];

        // 获取上一行相同列的值
        const preRow = this.planFinishList[rowIndex - 1];
        const preValue = preRow ? preRow[column.property] : null;

        // 如果当前值和上一行的值相同，则将当前单元格隐藏
        if (currentValue === preValue) {
          return { rowspan: 0, colspan: 0 };
        } else {
          // 否则计算当前单元格应该跨越多少行
          let rowspan = 1;
          for (let i = rowIndex + 1; i < this.planFinishList.length; i++) {
            const nextRow = this.planFinishList[i];
            const nextValue = nextRow[column.property];
            if (nextValue === currentValue) {
              rowspan++;
            } else {
              break;
            }
          }
          return { rowspan, colspan: 1 };
        }
      }else
      if (columnIndex === 2) {
        // 获取当前单元格的值
        const currentValue = row.planOperateBy + '' + row.planWorkTeam;

        // 获取上一行相同列的值
        const preRow = this.planFinishList[rowIndex - 1];
        const preValue = preRow ? (preRow.planOperateBy + '' + preRow.planWorkTeam) : null;

        // 如果当前值和上一行的值相同，则将当前单元格隐藏
        if (currentValue === preValue) {
          return { rowspan: 0, colspan: 0 };
        } else {
          // 否则计算当前单元格应该跨越多少行
          let rowspan = 1;
          for (let i = rowIndex + 1; i < this.planFinishList.length; i++) {
            const nextRow = this.planFinishList[i];
            const nextValue = (nextRow.planOperateBy + '' + nextRow.planWorkTeam);
            if (nextValue === currentValue) {
              rowspan++;
            } else {
              break;
            }
          }
          return { rowspan, colspan: 1 };
        }
      }else
      if (columnIndex === 3) {
        // 获取当前单元格的值
        const currentValue = row.planOperateBy + '' + row.planWorkTeam + '' + row.planWorkScheduleClass;

        // 获取上一行相同列的值
        const preRow = this.planFinishList[rowIndex - 1];
        const preValue = preRow ? (preRow.planOperateBy + '' + preRow.planWorkTeam + '' + preRow.planWorkScheduleClass) : null;

        // 如果当前值和上一行的值相同，则将当前单元格隐藏
        if (currentValue === preValue) {
          return { rowspan: 0, colspan: 0 };
        } else {
          // 否则计算当前单元格应该跨越多少行
          let rowspan = 1;
          for (let i = rowIndex + 1; i < this.planFinishList.length; i++) {
            const nextRow = this.planFinishList[i];
            const nextValue = (nextRow.planOperateBy + '' + nextRow.planWorkTeam + '' + nextRow.planWorkScheduleClass);
            if (nextValue === currentValue) {
              rowspan++;
            } else {
              break;
            }
          }
          return { rowspan, colspan: 1 };
        }
      }
    },
  }
};
</script>
