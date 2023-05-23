<template>
  <div class="analysis-manage">
    <header>
      <div class="header-card">
        <div class="card-item">

        </div>
        <div class="card-item">

        </div>
        <div class="card-item">

        </div>
      </div>
    </header>
    <footer>
      <div class="footer-items">
        <div class="echarts-line">

        </div>
        <div class="echarts-items">
          <div id="pie"></div>
          <div id="sales"></div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>

export default {
  setup () {
    

    return {}
  }
}
</script>

<style lang="scss" scoped>
.analysis-manage{
  background-color: #eef0f3;
  .header-card{
    padding: 10px 0;
    display: flex;
    justify-content: space-around;
    flex-wrap:wrap;
    align-items: center;
    .card-item{
      margin-bottom: 5px;
      width: 200px;
      min-width: 100px;
      height: 108px;
      background-color:#fff;
      
    }
  }
  .footer-items{
    
    .echarts-line{
      width: 98%;
      height: 300px;
      background-color: #fff;
      margin: 5px auto;
      
    }
    .echarts-items{
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 98%;
      height: 200px;
      background-color: #fff;
      margin: 10px auto;
      
    }
  }
}
</style>