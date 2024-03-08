<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="设备编号" prop="equipmentCode">
        <el-input
          v-model="queryParams.equipmentCode"
          placeholder="请输入设备编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="设备名称" prop="equipmentName">
        <el-input
          v-model="queryParams.equipmentName"
          placeholder="请输入设备名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!--<el-form-item label="产线id" prop="lineId">
        <el-input
          v-model="queryParams.lineId"
          placeholder="请输入产线id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="物料图号" prop="itemId">
        <el-input
          v-model="queryParams.itemId"
          placeholder="请输入物料图号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="工序id" prop="processId">
        <el-input
          v-model="queryParams.processId"
          placeholder="请输入工序id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>-->
      <el-form-item label="条码号" prop="equipmentBarcode">
        <el-input
          v-model="queryParams.equipmentBarcode"
          placeholder="请输入条码号"
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
          v-hasPermi="['base:equipment:add']"
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
          v-hasPermi="['base:equipment:edit']"
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
          v-hasPermi="['base:equipment:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['base:equipment:export']"
        >导出</el-button>
      </el-col>
        <el-col :span="1.5">
            <el-button
                    type="info"
                    icon="el-icon-upload2"
                    size="mini"
                    @click="handleImport"
            >导入</el-button>
        </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="equipmentList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />\
      <el-table-column label="设备编号" align="center" prop="equipmentCode" />
      <el-table-column label="设备名称" align="center" prop="equipmentName" />
      <el-table-column label="设备类型" align="center" prop="equipmentTypeName" />
      <el-table-column label="状态" align="center" prop="equipmentStatusName" />
      <el-table-column label="责任人" align="center" prop="responsibleUser" />
      <!--<el-table-column label="部门id" align="center" prop="deptId" />
      <el-table-column label="产线id" align="center" prop="lineId" />-->
      <el-table-column label="物料图号" align="center" prop="itemCode" />
      <el-table-column label="工序" align="center" prop="processName" />
      <el-table-column label="长" align="center" prop="lenght" />
      <el-table-column label="宽" align="center" prop="widht" />
      <el-table-column label="高" align="center" prop="height" />
      <el-table-column label="重量" align="center" prop="weight" />
      <el-table-column label="设备条码号" align="center" prop="equipmentBarcode" />
      <el-table-column label="型号" align="center" prop="modelNum" />
      <el-table-column label="规格" align="center" prop="specification" />
      <el-table-column label="制造商" align="center" prop="manufacturer" />
      <el-table-column label="资产编号" align="center" prop="assetId" />
      <el-table-column label="设备计数器值" align="center" prop="productNum" />
      <el-table-column label="速率" align="center" prop="speed" />
      <el-table-column label="进给" align="center" prop="spindleFeed" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['base:equipment:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['base:equipment:remove']"
          >删除</el-button>
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

    <!-- 添加或修改设备信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="设备编号" prop="equipmentCode">
          <el-input v-model="form.equipmentCode" placeholder="请输入设备编号" />
        </el-form-item>
        <el-form-item label="设备名称" prop="equipmentName">
          <el-input v-model="form.equipmentName" placeholder="请输入设备名称" />
        </el-form-item>
        <el-form-item label="设备类型" prop="equipmentType">
          <el-select v-model="form.equipmentType" placeholder="请选择设备类型">
            <el-option
              v-for="dict in equipmentTypeList"
              :key="dict.code"
              :label="dict.desc"
              :value="dict.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="equipmentStatus">
          <el-radio-group v-model="form.equipmentStatus">
            <el-radio
              v-for="dict in equipmentStatusList"
              :key="dict.code"
              :label="dict.code"
            >{{dict.desc}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="责任人" prop="responsibleUser">
          <el-input v-model="form.responsibleUser" placeholder="请输入责任人" />
        </el-form-item>
        <!--<el-form-item label="部门id" prop="deptId">
          <el-input v-model="form.deptId" placeholder="请输入部门id" />
        </el-form-item>
        <el-form-item label="产线id" prop="lineId">
          <el-input v-model="form.lineId" placeholder="请输入产线id" />
        </el-form-item>-->
        <el-form-item label="物料图号" prop="itemId">
          <el-select v-model="form.itemId" filterable  remote
                     :remote-method="remoteSearchItem"
                     placeholder="请输入物料图号检索">
            <el-option
              v-for="dict in itemList"
              :key="dict.code"
              :label="dict.desc"
              :value="dict.code"
            ></el-option>
          </el-select>
          <!--<el-input v-model="form.itemId" placeholder="请输入物料图号" />-->
        </el-form-item>
        <el-form-item label="工序" prop="processId">
          <el-select v-model="form.processId" placeholder="请选择工序">
            <el-option
              v-for="dict in processesList"
              :key="dict.code"
              :label="dict.desc"
              :value="dict.code+''"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="长" prop="lenght">
          <el-input v-model="form.lenght" placeholder="请输入长" />
        </el-form-item>
        <el-form-item label="宽" prop="widht">
          <el-input v-model="form.widht" placeholder="请输入宽" />
        </el-form-item>
        <el-form-item label="高" prop="height">
          <el-input v-model="form.height" placeholder="请输入高" />
        </el-form-item>
        <el-form-item label="重量" prop="weight">
          <el-input v-model="form.weight" placeholder="请输入重量" />
        </el-form-item>
        <el-form-item label="设备条码号" prop="equipmentBarcode">
          <el-input v-model="form.equipmentBarcode" placeholder="请输入设备条码号" />
          <el-button type="primary" plain @click="getBarcodeBySystem">系统生成</el-button>
        </el-form-item>
        <el-form-item label="型号" prop="modelNum">
          <el-input v-model="form.modelNum" placeholder="请输入型号" />
        </el-form-item>
        <el-form-item label="规格" prop="specification">
          <el-input v-model="form.specification" placeholder="请输入规格" />
        </el-form-item>
        <el-form-item label="制造商" prop="manufacturer">
          <el-input v-model="form.manufacturer" placeholder="请输入制造商" />
        </el-form-item>
        <el-form-item label="资产编号" prop="assetId">
          <el-input v-model="form.assetId" placeholder="请输入资产编号" />
        </el-form-item>
        <el-form-item label="设备计数器值" prop="productNum">
          <el-input v-model="form.productNum" placeholder="请输入设备计数器值" />
        </el-form-item>
        <el-form-item label="速率" prop="speed">
          <el-input v-model="form.speed" placeholder="请输入速率" />
        </el-form-item>
        <el-form-item label="进给" prop="spindleFeed">
          <el-input v-model="form.spindleFeed" placeholder="请输入进给" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

      <!-- 导入对话框 -->
      <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px">
          <el-upload
                  ref="upload"
                  :limit="1"
                  accept=".xlsx, .xls"
                  :headers="upload.headers"
                  :action="upload.url + '?updateSupport=' + upload.updateSupport"
                  :disabled="upload.isUploading"
                  :on-progress="handleFileUploadProgress"
                  :on-success="handleFileSuccess"
                  :auto-upload="false"
                  drag
          >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                  将文件拖到此处，或
                  <em>点击上传</em>
              </div>
              <div class="el-upload__tip" slot="tip">
                  <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的数据
                  <el-link type="info" style="font-size:12px" @click="importTemplate">下载模板</el-link>
              </div>
              <div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许导入“xls”或“xlsx”格式文件！</div>
          </el-upload>
          <div slot="footer" class="dialog-footer">
              <el-button type="primary" @click="submitFileForm">确 定</el-button>
              <el-button @click="upload.open = false">取 消</el-button>
          </div>
      </el-dialog>
  </div>
</template>

<script>
  import { getYesOrNo,getEquipmentStatus,getEquipmentType,searchItemList, getProcessesList } from '@/api/enumsSelect';
import { listEquipment, getEquipment, delEquipment,
  addEquipment, updateEquipment, getBarcodeBySystem } from "@/api/base/equipment";
  import { getToken } from "@/utils/auth";

export default {
  name: "Equipment",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      innerIds: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 设备信息表格数据
      equipmentList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        equipmentCode: null,
        equipmentName: null,
        equipmentType: null,
        equipmentStatus: null,
        lineId: null,
        itemId: null,
        processId: null,
        equipmentBarcode: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        equipmentCode: [
          { required: true, message: "设备编号不能为空", trigger: "blur" }
        ],
        equipmentName: [
          { required: true, message: "设备名称不能为空", trigger: "blur" }
        ],
        equipmentType: [
          { required: true, message: "设备类型不能为空", trigger: "change" }
        ],
        equipmentBarcode: [
          { required: true, message: "设备条码号不能为空", trigger: "blur" }
        ],
      },
      // 导入参数
      upload: {
          // 是否显示弹出层（导入）
          open: false,
                  // 弹出层标题（导入）
                  title: "",
                  // 是否禁用上传
                  isUploading: false,
                  // 是否更新已经存在的数据
                  updateSupport: 0,
                  // 设置上传的请求头部
                  headers: { Authorization: "Bearer " + getToken() },
          // 上传的地址
          url: process.env.VUE_APP_BASE_API + "/base/equipment/importData"
      },
      //是否选择器
      yesOrNoList: [],
      //设备状态
      equipmentStatusList: [],
      //设备类型
      equipmentTypeList: [],
      //工序列表
      processesList: [],
      //物料信息
      itemList: [],
      itemSearchLoading: true
    };
  },
  created() {
    this.getYesOrNo();
    this.getEquipmentStatus();
    this.getEquipmentTypeList();
    this.getProcessesList();
    this.getList();
  },
  methods: {
    /** 是否列表 */
    getYesOrNo() {
      getYesOrNo().then(response => {
        this.yesOrNoList = response.data;
      });
    },
    /** 设备状态列表 */
    getEquipmentStatus() {
      getEquipmentStatus().then(response => {
        this.equipmentStatusList = response.data;
      });
    },
    /** 设备类型列表 */
    getEquipmentTypeList() {
      getEquipmentType().then(response => {
        this.equipmentTypeList = response.data;
      });
    },
    /** 工序列表 */
    getProcessesList() {
      getProcessesList().then(response => {
        this.processesList = response.data;
      });
    },


    /** 查询设备信息列表 */
    getList() {
      this.loading = true;
      listEquipment(this.queryParams).then(response => {
        this.equipmentList = response.rows;
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
        equipmentCode: null,
        equipmentName: null,
        equipmentType: null,
        equipmentStatus: null,
        deptId: null,
        responsibleUser: null,
        lineId: null,
        itemId: null,
        itemCode: null,
        processId: null,
        processName: null,
        lenght: null,
        widht: null,
        height: null,
        weight: null,
        equipmentBarcode: null,
        modelNum: null,
        specification: null,
        manufacturer: null,
        assetId: null,
        productNum: null,
        speed: null,
        spindleFeed: null,
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
      this.title = "添加设备信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getEquipment(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改设备信息";
        //回显
        this.remoteSearchItem(this.form.itemCode);
      });
    },
    /** 提交按钮 */
    submitForm() {
        this.loading = true;
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateEquipment(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(()=>this.loading = false);
          } else {
            addEquipment(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除设备信息编号为"' + ids + '"的数据项？').then(function() {
        return delEquipment(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('base/equipment/export', {
        ...this.queryParams
      }, `equipment_${new Date().getTime()}.xlsx`)
    },
    /** 导入按钮操作 */
    handleImport() {
        this.upload.title = "设备信息导入";
        this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
        this.download('base/equipment/importTemplate',{...this.queryParams}, '设备信息导入模板.xlsx');
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
    //系统生成条码
    getBarcodeBySystem(){
      if(this.form.equipmentType == ''){
        window.alert("请先选择设备类型");
        return false;
      }
      getBarcodeBySystem(this.form.equipmentType).then(response => {
        this.form.equipmentBarcode = response.data;
      }).catch( e =>{
        window.alert(e);
      })
    }
  }
};
</script>
