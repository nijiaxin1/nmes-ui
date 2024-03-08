<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryParams" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="时间" >
        <el-date-picker
          v-model="dateRangeTime"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期" >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">查询</el-button>
          <el-button type="primary" size="mini" @click="handleConfirm" >生成工资记录</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="unConfirmInfoList" height="500" @selection-change="handleSelectionChange">
      <!--<el-table-column type="selection" width="55" align="center" />-->
      <el-table-column type="index" label="行号" align="center" prop="rowNo" />
      <el-table-column label="物料图号" align="center" prop="itemCode" />
      <el-table-column label="工序" align="center" prop="processName" />
      <el-table-column label="员工" align="center" prop="operateBy" />
      <el-table-column label="数量" align="center" prop="workNum" />
      <el-table-column label="合格数量" align="center" prop="passNum" />
      <el-table-column label="铸废数量" align="center" prop="castingWasteNum" />
      <el-table-column label="责废数量" align="center" prop="dutyWasteNum" />
      <el-table-column label="配置金额" align="center" prop="configAmount" />
      <el-table-column label="启用时间" align="center" prop="enableTime" width="180"/>
      <el-table-column label="合格工资" align="center" prop="passWages" />
      <el-table-column label="铸废扣减工资" align="center" prop="castingWasteDeductWages" />
      <el-table-column label="责废扣减工资" align="center" prop="dutyWasteDeductWages" />
      <el-table-column label="其它扣减工资" align="center" prop="otherDeductWages" />
      <el-table-column label="应发工资" align="center" prop="shouldWages" />
      <el-table-column label="实发工资" align="center" prop="realityWages" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <!--<template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="getContract(scope.$index, scope.row)"
          >选择合同</el-button>
        </template>-->
      </el-table-column>
    </el-table>


  </div>
</template>

<script>
  import {searchItemList, searchCustomerList, getFinanceContractType, getMonthDateStr} from '@/api/enumsSelect';
  import { unConfirmInfoListByCond,doConfirm } from "@/api/finance/financeWagesDetail";

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
        //查询条件
        queryParams:{
          monthDate: getMonthDateStr(0),
        },
        // 时间参数
        dateRangeTime: [getMonthDateStr(1)+'-25 00:00:00', getMonthDateStr(0)+'-26 00:00:00'],
        //被选择的
        selectedUnConfirmInfoList:[],
        //待确认明细数据
        unConfirmInfoList: [],


        //物料信息
        itemList: [],
        itemSearchLoading: true,
        //客户信息
        customerList: [],
        customerSearchLoading: true,
      };
    },
    created() {
      this.handleQuery();
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

      /**待确认数据*/
      handleQuery(){
        this.loading = true;
        //待确认数据
        this.queryParams.params={};
        if (null != this.dateRangeTime && '' != this.dateRangeTime) {
          this.queryParams.params["beginTime"] = this.dateRangeTime[0];
          this.queryParams.params["endTime"] = this.dateRangeTime[1];
        }else{
          this.$modal.msgError("请选择日期");
          this.loading = false;
          return false;
        }
        unConfirmInfoListByCond(this.queryParams).then(response=>{
          this.unConfirmInfoList = response.data;
        }).catch((e)=>{}).finally(()=>this.loading = false)
      },
      /*结算*/
      handleConfirm(){
        /*if(!this.infoQueryForm.settlementType){
          this.$modal.msgError("请选择先选择结算类型");
          return false;
        }
        debugger;
        if(this.selectedUnsettledInfoList.length == 0){
          this.$modal.msgError("请先选择");
          return false;
        }*/
        //待确认数据
        this.queryParams.params={};
        if (null != this.dateRangeTime && '' != this.dateRangeTime) {
          this.queryParams.params["beginTime"] = this.dateRangeTime[0];
          this.queryParams.params["endTime"] = this.dateRangeTime[1];
        }else{
          this.$modal.msgError("请选择日期");
          this.loading = false;
          return false;
        }
        this.loading = true;
        doConfirm(this.queryParams).then(response=>{
          if(response.code != 500){
            //this.confirmDialog.open = false;
            this.$modal.msgSuccess(response.msg);
            //this.reset();
          }
        }).catch((e)=>{}).finally(()=>this.loading = false);
      }
    }
  };
</script>
