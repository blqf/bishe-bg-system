<template>
  <div class="dashboard-container">
    <div class="mark">
      店铺当前评分：<span class="mark-content">{{ this.mark }}星</span>
    </div>
    <div class="echarts-wrapper">
      <div class="echarts-sex-wrapper">
        <div class="echarts-sex" ref="echartsSex"></div>
      </div>
      <div class="echarts-age-wrapper">
        <el-select
          v-model="ageChartsType"
          placeholder="请选择"
          @change="handleAgeTypeChange"
        >
          <el-option
            v-for="(item, index) in ageChartsTypes"
            :key="index"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <div class="echarts-age" ref="echartsAge"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { findCommentList } from "@/api/comment";
import { findCustomerList } from "@/api/finishOrder";
export default {
  name: "Dashboard",
  data() {
    return {
      ageSalesNums: [0, 0, 0, 0, 0],
      sexSalesNums: [0, 0],
      mark: 0,
      ageChartsTypes: [
        {
          label: "折线图",
          value: "line",
        },
        {
          label: "柱状图",
          value: "bar",
        },
      ],
      ageChartsType: "line",
      sexChartsTypes: [
        {
          label: "饼图",
          value: "pie",
        },
        {
          label: "柱状图",
          value: "bar",
        },
      ],
      sexChartsType: "pie",
    };
  },
  methods: {
    async fetchGoodsData() {
      const resp = await findCustomerList();
      const list = resp.rows;
      // 按年龄分类的销量
      const len = list.length;
      for (let i = 0; i < len; i++) {
        const age = this.dayjs().diff(
          this.dayjs(list[i].user_birthday),
          "year"
        );
        const buyCount = list[i].buy_count ?? 0;
        if (age >= 0 && age <= 15) {
          this.ageSalesNums[0] += buyCount;
        } else if (age >= 16 && age <= 25) {
          this.ageSalesNums[1] += buyCount;
        } else if (age >= 26 && age <= 35) {
          this.ageSalesNums[2] += buyCount;
        } else if (age >= 36 && age <= 50) {
          this.ageSalesNums[3] += buyCount;
        } else {
          this.ageSalesNums[4] += buyCount;
        }
        // 按性别分类的销量
        this.sexSalesNums[+list[i].user_sex] += buyCount;
      }
    },
    async fetchCommentData() {
      const resp = await findCommentList();
      const list = resp.rows;
      const len = resp.rows.length;
      for (let i = 0; i < len; i++) {
        this.mark += list[i].comment_level;
      }
      this.mark = Math.round((this.mark / len) * 10) / 10;
    },
    drawSexChart() {
      const sexLineChart = this.$echarts.init(this.$refs.echartsSex);
      const sexLineChartOption = {
        title: {
          text: "不同性别的销量",
          left: "center",
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "vertical",
          left: "left",
        },
        series: [
          {
            name: "性别",
            type: this.sexChartsType,
            radius: "50%",
            data: [
              { value: this.sexSalesNums[0], name: "女" },
              { value: this.sexSalesNums[1], name: "男" },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };
      sexLineChart.setOption(sexLineChartOption);
    },
    drawAgeChart() {
      const ageLineChart = this.$echarts.init(this.$refs.echartsAge);
      const ageLineChartOption = {
        title: {
          text: "不同年龄段销量",
          left: "center",
        },
        tooltip: {},
        xAxis: {
          name: "年龄/岁",
          type: "category",
          data: ["0 - 15", "15 - 25", "26 - 35", "36 - 50", "> 50"],
        },
        yAxis: {
          name: "销量/个",
          type: "value",
        },
        series: [
          {
            data: this.ageSalesNums,
            type: this.ageChartsType,
          },
        ],
      };
      ageLineChart.setOption(ageLineChartOption);
    },
    handleSexTypeChange() {
      this.drawSexChart();
    },
    handleAgeTypeChange() {
      this.drawAgeChart();
    },
  },
  created() {
    this.fetchCommentData();
  },
  async mounted() {
    await this.fetchGoodsData();
    this.drawSexChart();
    this.drawAgeChart();
  },
};
</script>

<style lang="scss" scoped>
.dashboard-container {
  margin: 30px;
  .mark {
    font-weight: bold;
    margin-bottom: 30px;
    .mark-content {
      color: #0af;
    }
  }
  .echarts-wrapper {
    display: flex;
    justify-content: space-around;
    .echarts-sex {
      width: 300px;
      height: 300px;
      box-shadow: 0 0 5px #666;
      border-radius: 4px;
      margin-top: 57px;
    }
    .echarts-age-wrapper {
      .echarts-age {
        width: 600px;
        height: 300px;
        box-shadow: 0 0 5px #666;
        border-radius: 4px;
        margin-top: 18px;
      }
    }
  }
}
</style>
