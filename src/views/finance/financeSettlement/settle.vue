<template>
  <div class="app-container">
    <el-form :model="infoQueryForm" ref="infoQueryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="结算类型" prop="settlementType">
        <el-select v-model="infoQueryForm.settlementType" placeholder="请选择结算类型" clearable @change="clearInfoList">
          <el-option
            v-for="dict in settlementTypeList"
            :key="dict.code"
            :label="dict.desc"
            :value="dict.code"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="物料图号" prop="itemId">
        <el-select v-model="infoQueryForm.itemId" filterable  remote
                   :remote-method="remoteSearchItem"
                   placeholder="请输入物料图号">
          <el-option
            v-for="dict in itemList"
            :key="dict.code"
            :label="dict.desc"
            :value="dict.code"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="单据号" prop="relationCode">
        <el-input
          v-model="infoQueryForm.relationCode"
          placeholder="请输入单据号"
          clearable
        />
      </el-form-item>
      <el-form-item label="时间" prop="createTime" >
        <el-date-picker
          v-model="infoQueryForm.createTime"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期" >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="厂家" prop="customerId">
        <el-select v-model="infoQueryForm.customerId" placeholder="请选择厂家" filterable  remote
                   :remote-method="remoteSearchCustomer">
          <el-option
            v-for="dict in customerList"
            :key="dict.code"
            :label="dict.desc"
            :value="dict.code+''"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">查询</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="unsettledInfoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column type="index" label="行号" align="center" prop="rowNo" />
      <el-table-column label="单据号" align="center" prop="relationCode" />
      <el-table-column label="物料图号" align="center" prop="itemCode" />
      <el-table-column label="数量" align="center" prop="itemQuantity" />
      <el-table-column label="合同价" align="center" prop="effectPrice"/>
      <el-table-column label="总价" align="center" prop="settlementPrice"/>
      <el-table-column label="合同号" align="center" prop="contractCode" />
      <el-table-column label="时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="厂家" align="center" prop="customerName" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="getContract(scope.$index, scope.row)"
          >选择合同</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div align="center" style="margin-top: 5px">
      <el-button type="primary" size="medium" @click="handleSettle" >结  算</el-button>
    </div>


          <!-- 合同对话框 -->
          <el-dialog :title="contractInfoDialog.title" v-loading.fullscreen.lock="contractInfoDialog.loading"
                     :visible.sync="contractInfoDialog.open"  center
                     >

            <el-table :data="contractInfoDialog.contractInfoList" @selection-change="handleContractSelectionChange">
              <el-table-column type="selection" width="55" align="center" />
              <el-table-column label="合同号" align="center" prop="contractCode" />
              <el-table-column label="物料图号" align="center" prop="itemCode" />
              <el-table-column label="价格" align="center" prop="effectPrice" />
              <el-table-column label="生效时间" align="center" prop="effectStartTime" width="180">
                <template slot-scope="scope">
                  <span>{{ parseTime(scope.row.effectStartTime) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="失效时间" align="center" prop="effectEndTime" width="180">
                <template slot-scope="scope">
                  <span>{{ parseTime(scope.row.effectEndTime) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="厂家" align="center" prop="customerName" />
              <el-table-column label="备注" align="center" prop="remark" />
            </el-table>

            <div slot="footer" class="dialog-footer" >
              <el-button type="primary" @click="confirmSelectContractInfo">确 定</el-button>
              <el-button @click="contractInfoDialog.open = false">取 消</el-button>
            </div>
          </el-dialog>



    <!-- 确认对话框 -->
    <el-dialog :title="confirmDialog.title" v-loading.fullscreen.lock="confirmDialog.loading"
               :visible.sync="confirmDialog.open"  center width="20%">

      <el-descriptions title="结算单信息确认页" column="1">
        <el-descriptions-item label="发票号">{{infoQueryForm.invoiceCode}}</el-descriptions-item>
        <el-descriptions-item label="厂家">{{infoQueryForm.customerName}}</el-descriptions-item>
        <el-descriptions-item label="总额">{{infoQueryForm.settlementPrice}}</el-descriptions-item>
        <!--<el-descriptions-item label="备注">
          <el-tag size="small">学校</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="联系地址">江苏省苏州市吴中区吴中大道 1188 号</el-descriptions-item>-->
      </el-descriptions>
      <div slot="footer" class="dialog-footer" >
        <el-button type="primary" @click="handleSettle">确 定</el-button>
        <el-button @click="confirmDialog.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {searchItemList, searchCustomerList, getFinanceContractType} from '@/api/enumsSelect';
import { unsettledInfoListByCond,doSettle } from "@/api/finance/financeSettlementInfo";
  import { listFinanceContractInfoByCond } from "@/api/finance/financeContractInfo";
import { getToken } from "@/utils/auth";

export default {
  name: "FinanceSettlementInfo",
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
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 明细查询参数
      infoQueryForm: {},
      //被选择的
      selectedUnsettledInfoList:[],
      //结算明细数据
      unsettledInfoList: [],


      settlementTypeList:[],
      // 检索合同
      contractInfoDialog:{
        // 遮罩层
        loading: false,
        // 是否显示弹出层（导入）
        open: false,
        // 弹出层标题（导入）
        title: "合同",
        //合同集合
        contractInfoList:[],
        //选中的合同
        contractInfo:{},
        //选中数量
        len:0
      },
      // 结算确认窗口
      confirmDialog:{
        // 遮罩层
        loading: false,
        // 是否显示弹出层（导入）
        open: false,
        // 弹出层标题（导入）
        title: "",
      },
      //物料信息
      itemList: [],
      itemSearchLoading: true,
      //客户信息
      customerList: [],
      customerSearchLoading: true,
    };
  },
  created() {
    this.selectFinanceSettlementType();
  },
  methods: {
    //结算类型
    selectFinanceSettlementType() {
      getFinanceContractType().then(response => {
        this.settlementTypeList = response.data;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.selectedUnsettledInfoList = selection;
    },
    //结算类型更改时清空所有数据
    clearInfoList(val){
        this.reset();
    },
    //初始化所有数据
    reset(){
      this.unsettledInfoList= [];
      this.infoQueryForm.invoiceCode = null;
      this.infoQueryForm.customerId = null;
      this.selectedUnsettledInfoList = [];
      this.contractInfoDialog.contractInfoList=[];
      this.contractInfoDialog.contractInfo={};
      this.contractInfoDialog.len=0;
    },
    /*检索合同*/
    getContract(index, row){
      const temp={};
      temp.itemId = row.itemId;
      temp.customerId = row.customerId;
      temp.contractType = this.infoQueryForm.settlementType;
      temp.contractStatus = "2";
      temp.selectDateType = "1";
      listFinanceContractInfoByCond(temp).then(response => {
        this.contractInfoDialog.contractInfoList = response.data;
        this.contractInfoDialog.open = true;
        this.contractInfoDialog.index  = index;
      });
    },
    // 多选框选中数据
    handleContractSelectionChange(selection) {
      this.contractInfoDialog.len = selection.length;
      this.contractInfoDialog.contractInfo = selection[0];
    },
    //选择合同
    confirmSelectContractInfo(){
      if(this.contractInfoDialog.len != 1){
        this.$modal.msgError("请选择一条");
        return false;
      }
      for(let i = 0; i < this.unsettledInfoList.length; i++){
        if(i == this.contractInfoDialog.index){
          this.unsettledInfoList[i].contractInfoId = this.contractInfoDialog.contractInfo.id;
          this.unsettledInfoList[i].contractCode = this.contractInfoDialog.contractInfo.contractCode;
          this.unsettledInfoList[i].effectPrice = this.contractInfoDialog.contractInfo.effectPrice;
          this.unsettledInfoList[i].settlementPrice = (parseFloat(this.contractInfoDialog.contractInfo.effectPrice) * this.unsettledInfoList[i].itemQuantity).toFixed(2);
        }
      }
      this.contractInfoDialog.open = false;
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

    /**检索未结算数据*/
    handleQuery(){
      this.loading = true;
      this.unsettledInfoList = [];
      this.selectedUnsettledInfoList = [];
      //检索未结算数据
        const temp = {};
        temp.itemId = this.infoQueryForm.itemId;
        temp.settlementType = this.infoQueryForm.settlementType;
        temp.relationCode = this.infoQueryForm.relationCode;
        temp.customerId = this.infoQueryForm.customerId;
        if(this.infoQueryForm.createTime){

          temp.createStartTime = this.infoQueryForm.createTime[0];
          temp.CreateEndTime = this.infoQueryForm.createTime[1];
        }
        unsettledInfoListByCond(temp).then(response=>{
          this.unsettledInfoList = response.data;
        }).catch((e)=>{}).finally(()=>this.loading = false)
    },
    handleEnterOrOutSelectionChange(selection){
      this.selectedUnsettledInfoList = selection;

    },
    /**选择未检索数据*/
    handleSelectInOrOutList(){
      if(this.inOrOutSearchDialog.selectedUnsettledInfoList.length == 0){
        this.$modal.msgError("请选择未结算数据");
        return false;
      }
      debugger;
      for (let i = 0; i< this.selectedUnsettledInfoList.length; i++){
        const item = this.selectedUnsettledInfoList[i];
        if(!item.effectPrice){
          this.$modal.msgError("请选择合同");
          return false;
        }
        if(this.infoQueryForm.customerName && this.infoQueryForm.customerName != item.customerName){
          this.$modal.msgError("选择的未结算明细中包含多厂家数据,不合法");
          return false;
        }
        this.infoQueryForm.customerName = item.customerName;
      }
      for (let i = 0; i< this.inOrOutSearchDialog.selectedUnsettledInfoList.length; i++){
        const item = this.inOrOutSearchDialog.selectedUnsettledInfoList[i];
        let temp = item;
        temp.settlementPrice = (parseFloat(item.effectPrice) * item.itemQuantity).toFixed(2);
        this.unsettledInfoList.push(temp);
      }
      this.inOrOutSearchDialog.open=false;
    },

    /*删除已选择的未结算数据*/
    handleDeleteRow(index,row){
      this.unsettledInfoList.splice(index,1);
    },
    /*打开结算确认窗口*/
    openConfirmSettleDialog(){
      if(!this.infoQueryForm.settlementType){
        this.$modal.msgError("请选择先选择结算类型");
        return false;
      }
      if(this.unsettledInfoList.length == 0){
        this.$modal.msgError("请先录入数据");
        return false;
      }
      this.infoQueryForm.settlementPrice = "0";
      for (let i = 0; i< this.selectedUnsettledInfoList.length; i++){
        const item = this.selectedUnsettledInfoList[i];
        this.infoQueryForm.settlementPrice = parseFloat(this.infoQueryForm.settlementPrice) + parseFloat(item.settlementPrice);
      }
      this.confirmDialog.open = true;
    },
    /*结算*/
    handleSettle(){
      if(!this.infoQueryForm.settlementType){
        this.$modal.msgError("请选择先选择结算类型");
        return false;
      }
      debugger;
      if(this.selectedUnsettledInfoList.length == 0){
        this.$modal.msgError("请先选择");
        return false;
      }
      this.infoQueryForm.selectedUnsettledInfoList = this.selectedUnsettledInfoList;
      for (let i = 0; i< this.selectedUnsettledInfoList.length; i++){
        const item = this.selectedUnsettledInfoList[i];
        if(!item.effectPrice){
          this.$modal.msgError("请选择合同");
          return false;
        }
      }
      this.loading = true;
      doSettle(this.selectedUnsettledInfoList).then(response=>{
        if(response.code != 500){
          //this.confirmDialog.open = false;
          this.$modal.msgSuccess(response.msg);
          //this.reset();
          this.handleQuery();
        }
      }).catch((e)=>{}).finally(()=>this.loading = false);
    }
  }
};
</script>
