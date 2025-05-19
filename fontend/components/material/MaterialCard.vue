<template>
  <view class="material-card" @click="onClick">
    <image :src="material.image" mode="aspectFill" class="material-image" />
    <view class="material-info">
      <text class="material-name">{{ material.name }}</text>
      <view class="material-details">
        <text class="detail-item">规格: {{ material.size }}</text>
        <text class="detail-item">厚度: {{ material.thickness }}</text>
        <text class="detail-item" v-if="material.finish">工艺: {{ material.finish }}</text>
      </view>
      <view class="material-code">
        <text>{{ material.code }}</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'MaterialCard',
  props: {
    material: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    onClick() {
      this.$emit('click', this.material);
    }
  }
}
</script>

<style lang="scss">
.material-card {
  display: flex;
  flex-direction: column;
  background-color: #FFFFFF;
  border-radius: 12rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
  margin-bottom: 30rpx;
  
  .material-image {
    width: 100%;
    height: 360rpx;
  }
  
  .material-info {
    padding: 20rpx;
    
    .material-name {
      font-size: 32rpx;
      font-weight: 600;
      color: #333;
      margin-bottom: 12rpx;
    }
    
    .material-details {
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 12rpx;
      
      .detail-item {
        font-size: 24rpx;
        color: #666;
        margin-right: 20rpx;
        margin-bottom: 8rpx;
      }
    }
    
    .material-code {
      font-size: 24rpx;
      color: #999;
    }
  }
}
</style> 