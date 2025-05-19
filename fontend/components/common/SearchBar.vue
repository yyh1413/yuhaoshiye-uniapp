<template>
  <view class="search-bar" @click="onSearchClick">
    <view class="search-box">
      <text class="iconfont icon-search"></text>
      <input
        v-if="!readOnly"
        class="search-input"
        type="text"
        :placeholder="placeholder"
        :value="value"
        @input="onInput"
        @confirm="onConfirm"
        confirm-type="search"
        :focus="focus"
      />
      <text v-else class="search-text">{{ placeholder }}</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'SearchBar',
  props: {
    placeholder: {
      type: String,
      default: '请输入关键词或产品名称'
    },
    value: {
      type: String,
      default: ''
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    focus: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    onInput(e) {
      this.$emit('input', e.detail.value);
    },
    onConfirm(e) {
      this.$emit('confirm', e.detail.value);
    },
    onSearchClick() {
      if (this.readOnly) {
        this.$emit('click');
      }
    }
  }
}
</script>

<style lang="scss">
.search-bar {
  padding: 20rpx 30rpx;
  
  .search-box {
    display: flex;
    align-items: center;
    background-color: #F6F6F6;
    border-radius: 36rpx;
    padding: 14rpx 20rpx;
    
    .iconfont {
      font-size: 32rpx;
      color: #999;
      margin-right: 10rpx;
    }
    
    .search-input, .search-text {
      flex: 1;
      font-size: 28rpx;
      color: #333;
    }
    
    .search-text {
      color: #999;
    }
  }
}
</style> 