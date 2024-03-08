<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="物料父图号" prop="parentItemCode">
        <el-input
          v-model="queryParams.parentItemCode"
          placeholder="请输入物料父图号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="物料图号" prop="itemCode">
        <el-input
          v-model="queryParams.itemCode"
          placeholder="请输入物料图号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="条码号" prop="barcode">
        <el-input
          v-model="queryParams.barcode"
          placeholder="请输入条码号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="总成编号" prop="assemblyItemCode">
        <el-input
          v-model="queryParams.assemblyItemCode"
          placeholder="请输入总成编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="供应商ID" prop="supplyId">
        <el-input
          v-model="queryParams.supplyId"
          placeholder="请输入供应商ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="停用标记" prop="stopFlag">
        <el-radio-group v-model="queryParams.stopFlag"clearable
                        @keyup.enter.native="handleQuery">
          <el-radio
            v-for="dict in yesOrNoList"
            :key="dict.code"
            :label="dict.code"
          >{{dict.desc}}</el-radio>
        </el-radio-group>
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
          v-hasPermi="['base:itemInfo:add']"
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
          v-hasPermi="['base:itemInfo:edit']"
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
          v-hasPermi="['base:itemInfo:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['base:itemInfo:export']"
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

    <el-table v-loading="loading" :data="itemInfoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="物料图号" align="center" prop="itemCode" />
      <el-table-column label="物料名称" align="center" prop="itemName" />
      <el-table-column label="物料父图号" align="center" prop="parentItemCode" />
      <el-table-column label="单位" align="center" prop="unit" />
      <el-table-column label="材质" align="center" prop="materialType" />
      <el-table-column label="物料类型" align="center" prop="itemTypeName" />
      <el-table-column label="是否托管" align="center" prop="entrustFlagName" />
      <el-table-column label="是否免检" align="center" prop="exemptionFlagName" />
      <el-table-column label="拣货方式" align="center" prop="pickTypeName" />
      <el-table-column label="包装数量" align="center" prop="packageAmount" />
      <el-table-column label="物料尺寸-长 (单位:mm)" align="center" prop="itemLength" />
      <el-table-column label="物料尺寸-宽 (单位:mm)" align="center" prop="itemWidth" />
      <el-table-column label="物料尺寸-高 (单位:mm)" align="center" prop="itemHeight" />
      <el-table-column label="包装尺寸-长 (单位:mm)" align="center" prop="packageLength" />
      <el-table-column label="包装尺寸-宽 (单位:mm)" align="center" prop="packageWidth" />
      <el-table-column label="包装尺寸-高 (单位:mm)" align="center" prop="packageHeight" />
      <el-table-column label="物料重量(kg)" align="center" prop="weight" />
      <el-table-column label="特性" align="center" prop="property" />
      <el-table-column label="特性说明" align="center" prop="propertyExplain" />
      <el-table-column label="规格" align="center" prop="spec" />
      <el-table-column label="型号" align="center" prop="model" />
      <el-table-column label="条码号" align="center" prop="barcode" />
      <el-table-column label="总成编号" align="center" prop="assemblyItemCode" />
      <el-table-column label="物料大类" align="center" prop="classId" />
      <el-table-column label="单件标记" align="center" prop="singleFlagName" />
      <el-table-column label="厂家" align="center" prop="supplyName" />
      <el-table-column label="预警上线" align="center" prop="upLine" />
      <el-table-column label="预警下线" align="center" prop="downLine" />
      <el-table-column label="物料价格" align="center" prop="itemPrice" />
      <el-table-column label="停用标记" align="center" prop="stopFlagName" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['base:itemInfo:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['base:itemInfo:remove']"
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

    <!-- 添加或修改物料信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="物料图号" prop="itemCode">
          <el-input v-model="form.itemCode" placeholder="请输入物料图号" />
        </el-form-item>
        <el-form-item label="物料名称" prop="itemName">
          <el-input v-model="form.itemName" placeholder="请输入物料名称" />
        </el-form-item>
        <el-form-item label="物料父图号" prop="parentItemCode">
          <el-input v-model="form.parentItemCode" placeholder="请输入物料父图号" />
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-input v-model="form.unit" placeholder="请输入单位" />
        </el-form-item>
        <el-form-item label="材质" prop="materialType">
          <el-input v-model="form.materialType" placeholder="请输入材质" />
          <!--<el-select v-model="form.materialType" placeholder="请选择材质">
            <el-option
              v-for="dict in dict.type."
              :key="dict.code"
              :label="dict.desc"
              :value="dict.code"
            ></el-option>
          </el-select>-->
        </el-form-item>
        <el-form-item label="物料类型" prop="itemType">
          <el-select v-model="form.itemType" placeholder="请选择物料类型">
            <el-option
              v-for="dict in itemTypeList"
              :key="dict.code"
              :label="dict.desc"
              :value="dict.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="供应商" prop="supplyId">
          <el-select v-model="form.supplyId" placeholder="请选择供应商" filterable  remote
                     :remote-method="remoteSearchCustomer" clearable>
            <el-option
              v-for="dict in customerList"
              :key="dict.code"
              :label="dict.desc"
              :value="dict.code+''"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="条码号" prop="barcode">
          <el-input v-model="form.barcode" placeholder="请输入条码号" />
        </el-form-item>
        <el-form-item label="总成编号" prop="assemblyItemCode">
          <el-input v-model="form.assemblyItemCode" placeholder="请输入总成编号" />
        </el-form-item>
        <!--<el-form-item label="是否托管" prop="entrustFlag">
          <el-radio-group v-model="form.entrustFlag">
            <el-radio
              v-for="dict in yesOrNoList"
              :key="dict.code"
              :label="dict.code"
            >{{dict.desc}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否免检" prop="exemptionFlag">
          <el-radio-group v-model="form.exemptionFlag">
            <el-radio
              v-for="dict in yesOrNoList"
              :key="dict.code"
              :label="dict.code"
            >{{dict.desc}}</el-radio>
          </el-radio-group>
        </el-form-item>-->
        <el-form-item label="拣货方式" prop="pickType">
          <el-select v-model="form.pickType" placeholder="请选择拣货方式">
            <el-option
              v-for="dict in itemPickTypeList"
              :key="dict.code"
              :label="dict.desc"
              :value="dict.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="包装数量" prop="packageAmount">
          <el-input v-model="form.packageAmount" placeholder="请输入包装数量" />
        </el-form-item>
        <el-form-item label="物料尺寸-长 " prop="itemLength">
          <el-input v-model="form.itemLength" placeholder="请输入物料尺寸-长 " />
        </el-form-item>
        <el-form-item label="物料尺寸-宽 (单位:mm)" prop="itemWidth">
          <el-input v-model="form.itemWidth" placeholder="请输入物料尺寸-宽 (单位:mm)" />
        </el-form-item>
        <el-form-item label="物料尺寸-高 " prop="itemHeight">
          <el-input v-model="form.itemHeight" placeholder="请输入物料尺寸-高 " />
        </el-form-item>
        <el-form-item label="包装尺寸-长 " prop="packageLength">
          <el-input v-model="form.packageLength" placeholder="请输入包装尺寸-长 " />
        </el-form-item>
        <el-form-item label="包装尺寸-宽 (单位:mm)" prop="packageWidth">
          <el-input v-model="form.packageWidth" placeholder="请输入包装尺寸-宽 (单位:mm)" />
        </el-form-item>
        <el-form-item label="包装尺寸-高 " prop="packageHeight">
          <el-input v-model="form.packageHeight" placeholder="请输入包装尺寸-高 " />
        </el-form-item>
        <el-form-item label="物料重量(kg)" prop="weight">
          <el-input v-model="form.weight" placeholder="请输入物料重量(kg)" />
        </el-form-item>
        <el-form-item label="特性" prop="property">
          <el-input v-model="form.property" placeholder="请输入特性" />
        </el-form-item>
        <el-form-item label="特性说明" prop="propertyExplain">
          <el-input v-model="form.propertyExplain" placeholder="请输入特性说明" />
        </el-form-item>
        <el-form-item label="规格" prop="spec">
          <el-input v-model="form.spec" placeholder="请输入规格" />
        </el-form-item>
        <el-form-item label="型号" prop="model">
          <el-input v-model="form.model" placeholder="请输入型号" />
        </el-form-item>
        <el-form-item label="物料大类" prop="classId">
          <el-input v-model="form.classId" placeholder="请输入物料大类" />
        </el-form-item>
        <el-form-item label="单件标记" prop="singleFlag">
          <el-radio-group v-model="form.singleFlag">
            <el-radio
              v-for="dict in yesOrNoList"
              :key="dict.code"
              :label="dict.code"
            >{{dict.desc}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="预警上线" prop="upLine">
          <el-input v-model="form.upLine" placeholder="请输入预警上线" />
        </el-form-item>
        <el-form-item label="预警下线" prop="downLine">
          <el-input v-model="form.downLine" placeholder="请输入预警下线" />
        </el-form-item>
        <el-form-item label="物料价格" prop="itemPrice">
          <el-input v-model="form.itemPrice" placeholder="请输入物料价格" />
        </el-form-item>
        <el-form-item label="停用标记" prop="stopFlag">
          <el-radio-group v-model="form.stopFlag">
            <el-radio
              v-for="dict in yesOrNoList"
              :key="dict.code"
              :label="dict.code"
            >{{dict.desc}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
        <el-form-item label="删除标识" prop="delFlag">
          <el-input v-model="form.delFlag" placeholder="请输入删除标识" />
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
  import { getYesOrNo,getItemType,getItemPickType, searchCustomerList } from '@/api/enumsSelect';
import { listItemInfo, getItemInfo, delItemInfo,
  addItemInfo, updateItemInfo } from "@/api/base/itemInfo";
  import { getToken } from "@/utils/auth";

export default {
  name: "ItemInfo",
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
      // 物料信息表格数据
      itemInfoList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        parentItemCode: null,
        itemCode: null,
        itemType: null,
        barcode: null,
        assemblyItemCode: null,
        supplyId: null,
        stopFlag: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        itemCode: [
          { required: true, message: "物料图号不能为空", trigger: "blur" }
        ],
        itemName: [
          { required: true, message: "物料名称不能为空", trigger: "blur" }
        ],
        itemType: [
          { required: true, message: "物料类型不能为空", trigger: "change" }
        ],
        /*supplyId: [
          { required: true, message: "供应商不能为空", trigger: "change" }
        ],*/
        /*pickType: [
          { required: true, message: "拣货方式不能为空", trigger: "change" }
        ],*/
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
          url: process.env.VUE_APP_BASE_API + "/base/itemInfo/importData"
      },
      //是否选择器
      yesOrNoList: [],
      //物料类型
      itemTypeList: [],
      //拣货方式
      itemPickTypeList: [],
      //客户信息
      customerList: [],
      customerSearchLoading: true,
    };
  },
  created() {
    this.getYesOrNo();
    this.getItemType();
    this.getItemPickType();
    this.getList();
  },
  methods: {
    /** 是否列表 */
    getYesOrNo() {
      getYesOrNo().then(response => {
        this.yesOrNoList = response.data;
      });
    },
    /** 物料类型列表 */
    getItemType() {
      getItemType().then(response => {
        this.itemTypeList = response.data;
      });
    },
    /** 物料拣货方式列表 */
    getItemPickType() {
      getItemPickType().then(response => {
        this.itemPickTypeList = response.data;
      });
    },
    /** 查询物料信息列表 */
    getList() {
      this.loading = true;
      listItemInfo(this.queryParams).then(response => {
        this.itemInfoList = response.rows;
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
        parentItemCode: null,
        itemCode: null,
        itemName: null,
        unit: null,
        materialType: null,
        itemType: null,
        entrustFlag: null,
        exemptionFlag: null,
        pickType: null,
        packageAmount: null,
        itemLength: null,
        itemWidth: null,
        itemHeight: null,
        packageLength: null,
        packageWidth: null,
        packageHeight: null,
        weight: null,
        property: null,
        propertyExplain: null,
        spec: null,
        model: null,
        barcode: null,
        assemblyItemCode: null,
        classId: null,
        singleFlag: null,
        supplyId: null,
        upLine: null,
        downLine: null,
        itemPrice: null,
        stopFlag: null,
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
      this.title = "添加物料信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getItemInfo(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改物料信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
        this.loading = true;
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateItemInfo(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(()=>this.loading = false);
          } else {
            addItemInfo(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除物料信息编号为"' + ids + '"的数据项？').then(function() {
        return delItemInfo(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    //远程搜索客户信息
    remoteSearchCustomer(customerName) {
      if (customerName !== '' && this.customerSearchLoading) {
        this.customerSearchLoading = false;
        setTimeout(() => {
          this.customerSearchLoading = true;
          searchCustomerList(customerName).then(response => {
            this.customerList = response.data;
          });
        }, 300);
      } else {
        this.customerList = [];
      }
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('base/itemInfo/export', {
        ...this.queryParams
      }, `itemInfo_${new Date().getTime()}.xlsx`)
    },
    /** 导入按钮操作 */
    handleImport() {
        this.upload.title = "物料信息导入";
        this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
        this.download('base/itemInfo/importTemplate',{...this.queryParams}, '物料信息导入模板.xlsx');
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
    }
  }
};
</script>
