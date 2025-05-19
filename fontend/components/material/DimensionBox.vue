<template>
  <view class="dimension-box">
    <view class="dimension-item" v-if="size">
      <text class="dimension-value">{{ size }}</text>
      <text class="dimension-label">{{ sizeLabel }}</text>
    </view>
    <view class="dimension-item" v-if="thickness">
      <text class="dimension-value">{{ thickness }}</text>
      <text class="dimension-label">{{ thicknessLabel }}</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'DimensionBox',
  props: {
    size: {
      type: String,
      default: ''
    },
    thickness: {
      type: String,
      default: ''
    },
    sizeLabel: {
      type: String,
      default: '规格'
    },
    thicknessLabel: {
      type: String,
      default: '厚度'
    }
  }
}
</script>

<style lang="scss">
.dimension-box {
  display: flex;
  flex-wrap: wrap;
  margin: 10rpx 0;
  
  .dimension-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 16rpx 30rpx;
    border-radius: 8rpx;
    background-color: #F8F8F8;
    margin-right: 20rpx;
    margin-bottom: 16rpx;
    
    .dimension-value {
      font-size: 28rpx;
      font-weight: 500;
      color: #333;
      margin-bottom: 4rpx;
    }
    
    .dimension-label {
      font-size: 24rpx;
      color: #999;
    }
  }
}
</style> 