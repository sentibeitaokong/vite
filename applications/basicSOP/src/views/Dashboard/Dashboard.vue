<template>
  <div class="dashboard-container">
    <!-- 1. 顶部数据卡片组 -->
    <div class="panel-group">
      <div class="panel-card" v-for="item in panelData" :key="item.title">
        <div class="card-header">
          <span class="title">{{ item.title }}</span>
          <span class="tag" :class="item.type">{{ item.tag }}</span>
        </div>
        <div class="card-body">
          <span class="number">{{ item.value }}</span>
        </div>
        <div class="card-footer">
          <span>总计: {{ item.total }}</span>
        </div>
      </div>
    </div>

    <!-- 2. 中部核心图表区 -->
    <div class="chart-container">
      <div class="chart-header">
        <span class="title">营收趋势分析</span>
      </div>
      <!-- 图表挂载点 -->
      <div ref="lineChartRef" class="chart-wrapper"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, markRaw } from 'vue'
import * as echarts from 'echarts'

// ---------------- 1. 顶部卡片数据 ----------------
const panelData = ref([
  { title: '访问量', value: '89,520', total: '1,203,000', tag: '日', type: 'blue' },
  { title: '销售额', value: '￥ 120,000', total: '￥ 8,500,000', tag: '月', type: 'green' },
  { title: '订单量', value: '1,240', total: '54,000', tag: '周', type: 'orange' },
  { title: '新增用户', value: '3,100', total: '120,500', tag: '年', type: 'purple' }
])

// ---------------- 2. ECharts 图表逻辑 ----------------
const lineChartRef = ref<HTMLElement | null>(null)
const chartInstance = ref<echarts.ECharts | null>(null)

// 🌟 声明 ResizeObserver 实例引用
let resizeObserver: ResizeObserver | null = null

// 初始化图表
const initChart = () => {
  if (!lineChartRef.value) return

  const myChart = echarts.init(lineChartRef.value)
  chartInstance.value = markRaw(myChart)

  const option: echarts.EChartsOption = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'cross' } },
    grid: { left: '2%', right: '2%', bottom: '5%', top: '10%', containLabel: true },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      axisLine: { lineStyle: { color: '#999' } }
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { type: 'dashed', color: '#eee' } }
    },
    series: [
      {
        name: '预期营收',
        type: 'line',
        smooth: true,
        itemStyle: { color: '#409EFF' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(64,158,255,0.3)' },
            { offset: 1, color: 'rgba(64,158,255,0.05)' }
          ])
        },
        data: [120, 132, 101, 134, 90, 230, 210]
      },
      {
        name: '实际营收',
        type: 'line',
        smooth: true,
        itemStyle: { color: '#67C23A' },
        data: [220, 182, 191, 234, 290, 330, 310]
      }
    ]
  }

  myChart.setOption(option)
}

// ---------------- 3. 生命周期与监听管理 ----------------

onMounted(() => {
  initChart()

  // 🌟 核心重构：使用 ResizeObserver 精准监听 DOM 容器的物理尺寸变化
  if (lineChartRef.value) {
    resizeObserver = new ResizeObserver(() => {
      // 只要容器宽度/高度发生任何变化 (无论是窗口缩放还是侧边栏折叠)，都会触发图表重绘
      if (chartInstance.value) {
        chartInstance.value.resize({
          animation: {
            duration: 300 // 配合侧边栏的折叠动画时长，实现丝滑过渡
          }
        })
      }
    })

    // 开始观察图表 DOM
    resizeObserver.observe(lineChartRef.value)
  }
})

onBeforeUnmount(() => {
  // ⚠️ 组件销毁前：必须断开观察者，清理图表实例，杜绝内存泄漏！
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
  if (chartInstance.value) {
    chartInstance.value.dispose()
    chartInstance.value = null
  }
})
</script>

<style scoped lang="scss">
.dashboard-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.panel-group {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
}

.panel-card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow:
    0 1px 2px -2px rgba(0, 0, 0, 0.08),
    0 3px 6px 0 rgba(0, 0, 0, 0.06);
  transition: all 0.3s;

  &:hover {
    box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.1);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #8c8c8c;
    font-size: 14px;
    .tag {
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 12px;
      &.blue {
        background: #e6f7ff;
        color: #1890ff;
        border: 1px solid #91d5ff;
      }
      &.green {
        background: #f6ffed;
        color: #52c41a;
        border: 1px solid #b7eb8f;
      }
      &.orange {
        background: #fff7e6;
        color: #fa8c16;
        border: 1px solid #ffd591;
      }
      &.purple {
        background: #f9f0ff;
        color: #722ed1;
        border: 1px solid #d3adf7;
      }
    }
  }

  .card-body {
    padding: 16px 0;
    .number {
      font-size: 30px;
      font-weight: 600;
      color: #303133;
    }
  }

  .card-footer {
    border-top: 1px solid #f0f0f0;
    padding-top: 12px;
    font-size: 14px;
    color: #666;
  }
}

.chart-container {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow:
    0 1px 2px -2px rgba(0, 0, 0, 0.08),
    0 3px 6px 0 rgba(0, 0, 0, 0.06);

  .chart-header {
    margin-bottom: 20px;
    .title {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
      position: relative;
      padding-left: 12px;
      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 2px;
        bottom: 2px;
        width: 4px;
        background: #409eff;
        border-radius: 2px;
      }
    }
  }

  .chart-wrapper {
    height: 400px;
    width: 100%;
  }
}
</style>
