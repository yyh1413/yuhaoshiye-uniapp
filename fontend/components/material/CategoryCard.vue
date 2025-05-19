<template>
  <view class="category-card" @click="onClick">
    <image :src="item.image" mode="aspectFill" class="category-image" />
    <view class="category-info">
      <text class="category-title">{{ item.title }}</text>
      <view class="category-specs">
        <text class="spec-item" v-if="item.size">{{ item.size }}</text>
        <text class="spec-item" v-if="item.thickness">{{ item.thickness }}</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'CategoryCard',
  props: {
    item: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    onClick() {
      this.$emit('click', this.item);
    }
  }
}
</script>

<style lang="scss">
.category-card {
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: hidden;
  background-color: #FFFFFF;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
  margin-bottom: 20rpx;
  
  .category-image {
    width: 100%;
    height: 200rpx;
    border-radius: 12rpx 12rpx 0 0;
  }
  
  .category-info {
    padding: 16rpx;
    
    .category-title {
      font-size: 28rpx;
      font-weight: 500;
      color: #333;
      margin-bottom: 8rpx;
    }
    
    .category-specs {
      display: flex;
      flex-wrap: wrap;
      
      .spec-item {
        font-size: 24rpx;
        color: #666;
        margin-right: 16rpx;
      }
    }
  }
}
</style> 