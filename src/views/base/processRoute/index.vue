<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="120px">
      <el-form-item label="工艺路线编号" prop="processRouteCode">
        <el-input
          v-model="queryParams.processRouteCode"
          placeholder="请输入工艺路线编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="物料编码" prop="itemId">
        <el-input
          v-model="queryParams.itemId"
          placeholder="请输入物料编码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['base:processRoute:add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['base:processRoute:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      :row-class-name="deactivationStatusClassName"
      :border="true" row-key="id" v-loading="loading" :data="processRouteList"
      @selection-change="handleSelectionChange">
      <el-table-column fixed label="物料编码" width="220" align="center" prop="itemId"/>
      <el-table-column fixed label="编号" width="80" align="center" prop="processRouteCode"/>

      <el-table-column fixed label="停用状态" width="80" align="center" prop="deactivationStatus">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.stop_using_flag" :value="scope.row.deactivationStatus"/>
        </template>
      </el-table-column>


      <el-table-column label="路线" width="900" align="center" prop="processRouteCode">
        <template slot-scope="scope">
          <el-tag style="margin-left: 5px"
                  v-for="item in scope.row.processList"
                  :key="item.processCode"
                  type="primary"
                  effect="dark">
            {{ item.processName }}
          </el-tag>
        </template>
      </el-table-column>


      <el-table-column label="备注" width="80" align="center" prop="remark"/>

      <el-table-column fixed="right" width="200" label="操作" align="center" class-name="small-padding fixed-width">

        <template slot-scope="scope">

          <el-button v-if="scope.row.deactivationStatus == '1'"
                     size="mini"
                     type="text"
                     icon="el-icon-edit"
                     @click="handleDeactivationStatus(scope.row, '0')"
                     v-hasPermi="['base:processRoute:edit']"
          >启用
          </el-button>
          <el-button v-else
                     size="mini"
                     type="text"
                     icon="el-icon-edit"
                     @click="handleDeactivationStatus(scope.row, '1')"
                     v-hasPermi="['base:processRoute:edit']"
          >停用
          </el-button>


          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['base:processRoute:edit']"
          >修改
          </el-button>

          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['base:processRoute:remove']"
          >删除
          </el-button>


        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改工艺路线对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1000px" append-to-body>
      <el-form :inline="true" ref="form" size="small" :model="form" :rules="rules" label-width="100px">

        <!--        <el-form-item label="物料编码" prop="itemId">
                  <el-input v-model="form.itemId" placeholder="请输入物料编码"/>
                </el-form-item>-->


        <el-form-item label="物料图号" prop="itemId">
          <el-select v-model="form.itemInfoId" filterable remote
                     :remote-method="remoteSearchItem"
                     placeholder="请输入物料图号检索">
            <el-option
              v-for="dict in itemList"
              :key="dict.code"
              :label="dict.desc"
              :value="dict.code"
            ></el-option>
          </el-select>

        </el-form-item>


        <el-form-item label="工艺路线编号" prop="processRouteCode">
          <el-input v-model="form.processRouteCode" placeholder="请输入工艺路线编号"/>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注"/>
        </el-form-item>

        <el-table ref="innerTable" row-key="id" :border="true" @selection-change="handleSelectionChangeInner"
                  v-loading="loading" :data="processList">
          <el-table-column type="selection" :reserve-selection="true" width="55" align="center"/>
          <el-table-column label="工序名称" prop="processName" align="center">

          </el-table-column>
          <el-table-column label="工序节拍(s)" align="center">
            <template slot-scope="{row}">
              <el-input-number v-model="row.cycleTime" :min="0" :max="10000" label="工序节拍"></el-input-number>
            </template>
          </el-table-column>
          <el-table-column label="设备编码" align="center">
            <template slot-scope="{row}">
              <!--              <el-input
                              placeholder="设备编码"
                              v-model="row.equipmentCode"
                              clearable></el-input>-->

              <el-select multiple v-model="row.equipmentCode" placeholder="请选择设备" clearable>
                <el-option
                  v-for="equipment in equipmentList"
                  :key="equipment.equipmentCode"
                  :label="equipment.equipmentName"
                  :value="equipment.equipmentCode"
                />
              </el-select>

            </template>
          </el-table-column>
        </el-table>


      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listProcessRoute,
  getProcessRoute,
  delProcessRoute,
  addProcessRoute,
  updateProcessRoute,
  updateDeactivationStatus
} from "@/api/base/processRoute";
import {listProcess} from "@/api/base/process";
import {searchItemList} from '@/api/enumsSelect';
import {listAllEquipment} from "@/api/base/equipment";

export default {
  name: "ProcessRoute",
  dicts: ['stop_using_flag'],
  data() {
    return {
      // 遮罩层
      loading: true,
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
      // 工艺路线表格数据
      processRouteList: [],
      processList: [],
      itemList: [],
      equipmentList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        processRouteCode: null,
        itemInfoId: null,
        itemId: null,
        deactivationStatus: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      itemSearchLoading: true,
    };
  },
  created() {
    this.getList();
    this.getEquipments()
    this.getProcess();
  },
  methods: {
    deactivationStatusClassName({row, rowIndex}) {
      if (row.deactivationStatus == '1') {
        return 'warning-row';
        // }else if(row.deactivationStatus == '0'){
        //   return 'success-row'
      } else {
        return '';
      }
    }
    ,
    getEquipments() {
      listAllEquipment().then(response => {
        this.equipmentList = response.rows;
      });
    },
    /** 查询工艺路线列表 */
    getList() {
      this.loading = true;
      listProcessRoute(this.queryParams).then(response => {
        this.processRouteList = response.rows;
        this.total = response.total;
        this.loading = false;

      });
    }
    ,
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
    }
    ,
    getProcess() {
      listProcess().then(res => {
        this.processList = res.rows;
        this.processList.forEach(process => {


          this.$nextTick(() => {
            if (this.$refs.innerTable != undefined) {
              this.$refs.innerTable.toggleRowSelection(process, false)
            }
          })
        });
      })
    }
    ,
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    }
    ,
    // 表单重置
    reset() {
      this.form = {
        id: null,
        processRouteCode: null,
        itemInfoId: null,
        itemId: null,
        deactivationStatus: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null,
        delFlag: null,
        processIdList: []
      };
      this.resetForm("form");
    }
    ,
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    }
    ,
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    }
    ,
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    handleSelectionChangeInner(selection) {
      this.innerIds = selection.map(item => item.id)
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加工艺路线";
      this.getProcess();
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      let th = this
      listProcess().then(res => {
        this.processList = res.rows;
        getProcessRoute(id).then(response => {
          console.log(this.form)
          this.form = response.data;
          //复制数据
          let pl = this.form.processList;

          //遍历赋值
          this.processList.forEach(process => {
            let processId = process.id;
            for (let p of pl) {
              let pid = p.id;
              //id相同
              if (pid == processId) {
                this.$nextTick(() => {
                  this.$refs.innerTable.toggleRowSelection(process, true)
                })

                process.cycleTime = p.cycleTime
                let eqs = p.equipmentCode
                let eqCodes = []
                // console.log(1)
                if (eqs != undefined && eqs != null && eqs != '') {
                  eqCodes = eqs.split(",")
                }
                process.equipmentCode = eqCodes
              }
            }
          })
          //数据回显
          // console.log(process)

          this.open = true;
          this.title = "修改工艺路线";
        });
      })


    }
    ,
    handleDeactivationStatus(row, state) {
      const id = row.id || this.ids;
      const itemInfoId = row.itemInfoId;
      let confirmText = '';

      if (state == '0') {
        confirmText = '确认启用该工艺路线?';
      } else {
        confirmText = '确认停用该工艺路线?';
      }


      this.$modal.confirm(confirmText).then(function () {
        let data = {
          id: id,
          itemInfoId: itemInfoId,
          deactivationStatus: state
        }//修改状态

        return updateDeactivationStatus(data);


      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("操作成功");
      }).catch(() => {
      });


    }
    ,
    /** 提交按钮 */
    submitForm() {
      let $this = this
      this.$refs["form"].validate(valid => {
        if (valid) {

          if ($this.form.id != null) {
            $this.form.processList = this.processList
            $this.form.processIdList = this.innerIds

            //转化数据
            this.form.processList.forEach((item, index) => {
              let eqs = item.equipmentCode
              let eqCodes = ''
              if (!(eqs == undefined || eqs == null || eqs.length == 0)) {
                eqs.forEach((eq, index1) => {
                  console.log(index1)
                  if (index1 != 0) {
                    eqCodes += ','
                  }
                  eqCodes += eq
                })
              }
              item.equipmentCode = eqCodes
            })

            updateProcessRoute($this.form).then(response => {
              $this.$modal.msgSuccess("修改成功");
              $this.open = false;
              $this.getList();
            });
          } else {
            $this.form.processList = this.processList
            $this.form.processIdList = this.innerIds
            //转化数据
            this.form.processList.forEach((item, index) => {
              let eqs = item.equipmentCode
              let eqCodes = ''
              if (!(eqs == undefined || eqs == null || eqs.length == 0)) {
                eqs.forEach((eq, index1) => {
                  console.log(index1)
                  if (index1 != 0) {
                    eqCodes += ','
                  }
                  eqCodes += eq
                })
              }
              item.equipmentCode = eqCodes
            })
            //反向找到item_info_id 和
            addProcessRoute($this.form).then(response => {
              $this.$modal.msgSuccess("新增成功");
              $this.open = false;
              $this.getList();
            });

          }
        }
      });
    }
    ,
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除工艺路线编号为"' + ids + '"的数据项？').then(function () {
        return delProcessRoute(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    }
    ,
    /** 导出按钮操作 */
    handleExport() {
      this.download('base/processRoute/export', {
        ...this.queryParams
      }, `processRoute_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>

<style>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>
