<template>
  <view class="tab-bar">
    <view 
      v-for="(tab, index) in tabs" 
      :key="index"
      class="tab-item"
      :class="{ active: currentTab === index }"
      @click="onTabClick(index)"
    >
      <text class="tab-text">{{ tab.name }}</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'TabBar',
  props: {
    tabs: {
      type: Array,
      default: () => []
    },
    currentTab: {
      type: Number,
      default: 0
    }
  },
  methods: {
    onTabClick(index) {
      if (index !== this.currentTab) {
        this.$emit('change', index);
      }
    }
  }
}
</script>

<style lang="scss">
.tab-bar {
  display: flex;
  background-color: #FFFFFF;
  height: 90rpx;
  border-bottom: 1rpx solid #F0F0F0;
  position: relative;
  
  .tab-item {
    flex: 1;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    
    .tab-text {
      font-size: 28rpx;
      color: #666;
      transition: color 0.3s;
    }
    
    &.active {
      .tab-text {
        color: #333;
        font-weight: 500;
      }
      
      &:after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 40rpx;
        height: 4rpx;
        background-color: #333;
        border-radius: 2rpx;
      }
    }
  }
}
</style> 