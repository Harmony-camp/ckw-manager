<template>
  <div class="analysis-manage">
    <header>
      <div class="header-card">
        <div class="card-item" v-for="item in headerData">
          <el-icon :color="item.color" :size="item.size">
            <component :is="item.icon"></component>
          </el-icon>
          <div class="desc">
            <span class="context">{{ item.context }}</span>
            <span>{{ item.item }}</span>
          </div>
        </div>
      </div>
    </header>
    <footer>
      <div class="footer-items">
        <div id="echarts-line"></div>
        <div class="echarts-items">
          <div id="pie"> </div>
          <div id="sales"></div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { ref, reactive, onActivated } from "vue";
import * as echarts from "echarts";

export default {
  setup() {
    const headerData = ref([
      {
        color: "#40c9c6",
        size: "70",
        icon: "UserFilled",
        context: "时间",
        item: "2019/02/04",
      },
      {
        color: "#36a3f7",
        size: "70",
        icon: "Message",
        context: "类型",
        item: "火",
      },
      {
        color: "#f5637b",
        size: "70",
        icon: "Tickets",
        context: "积分",
        item: "999",
      },
    ]);
    onActivated(() => {
      var lineDom = echarts.init(document.getElementById("echarts-line"));
      var lineOption;
      lineOption = {
        xAxis: {
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: "line",
            smooth: true,
          },
        ],
      };
      lineOption && lineDom.setOption(lineOption);

      let pieDom = echarts.init(document.getElementById("pie"))
      let pieOption
      
      pieOption =  {
  backgroundColor: '#2c343c',
  title: {
    text: 'Customized Pie',
    left: 'center',
    top: 20,
    textStyle: {
      color: '#ccc'
    }
  },
  tooltip: {
    trigger: 'item'
  },
  visualMap: {
    show: false,
    min: 80,
    max: 600,
    inRange: {
      colorLightness: [0, 1]
    }
  },
  series: [
    {
      name: 'Access From',
      type: 'pie',
      radius: '55%',
      center: ['50%', '50%'],
      data: [
        { value: 335, name: 'Direct' },
        { value: 310, name: 'Email' },
        { value: 274, name: 'Union Ads' },
        { value: 235, name: 'Video Ads' },
        { value: 400, name: 'Search Engine' }
      ].sort(function (a, b) {
        return a.value - b.value;
      }),
      roseType: 'radius',
      label: {
        color: 'rgba(255, 255, 255, 0.3)'
      },
      labelLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.3)'
        },
        smooth: 0.2,
        length: 10,
        length2: 20
      },
      itemStyle: {
        color: '#c23531',
        shadowBlur: 200,
        shadowColor: 'rgba(0, 0, 0, 0.5)'
      },
      animationType: 'scale',
      animationEasing: 'elasticOut',
      animationDelay: function (idx) {
        return Math.random() * 200;
      }
    }
  ]
      };
      pieOption && pieDom.setOption(pieOption)

      let salesDom = echarts.init(document.getElementById("sales"))
      let salesOption
      salesOption =  {
        title: {
          text: 'Basic Radar Chart'
        },
        legend: {
          data: ['Allocated Budget', 'Actual Spending']
        },
        radar: {
          // shape: 'circle',
          indicator: [
            { name: 'Sales', max: 6500 },
            { name: 'Administration', max: 16000 },
            { name: 'Information Technology', max: 30000 },
            { name: 'Customer Support', max: 38000 },
            { name: 'Development', max: 52000 },
            { name: 'Marketing', max: 25000 }
          ]
        },
        series: [
          {
            name: 'Budget vs spending',
            type: 'radar',
            data: [
              {
                value: [4200, 3000, 20000, 35000, 50000, 18000],
                name: 'Allocated Budget'
              },
              {
                value: [5000, 14000, 28000, 26000, 42000, 21000],
                name: 'Actual Spending'
              }
            ]
          }
        ]
      };

      salesOption && salesDom.setOption(salesOption)

    });
    return { headerData };
  },
};
</script>

<style lang="scss" scoped>
.analysis-manage {
  background-color: #eef0f3;
  .header-card {
    padding: 10px 0;
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    align-items: center;
    .card-item {
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      margin-bottom: 5px;
      width: 200px;
      min-width: 100px;
      height: 108px;
      background-color: #fff;
      .desc {
        display: flex;
        flex-direction: column;
        align-items: center;
        .context {
          font-size: 25px;
          padding-bottom: 10px;
        }
      }
      .el-icon:hover {
        transition: all 0.5s ease-out;
        transform: scale(1.2, 1.2);
      }
    }
  }
  .footer-items {
    #echarts-line {
      width: 98%;
      height: 300px;
      background-color: #fff;
      margin: 5px auto;
    }
    .echarts-items {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 98%;
      height: 200px;
      background-color: #fff;
      margin: 10px auto;
      #pie{
        flex: 1;
        height: 100%;
        padding-right: 3px;
      }
      #sales{
        flex: 1;
        height: 100%;
      }
    }
  }
}
</style>
