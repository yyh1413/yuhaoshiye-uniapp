<template>
  <swiper
    class="app-swiper"
    :indicator-dots="showDots"
    :autoplay="autoplay"
    :interval="interval"
    :duration="duration"
    :circular="circular"
    @change="onChange"
  >
    <swiper-item v-for="(item, index) in items" :key="index" @click="onItemClick(item, index)">
      <image :src="item.image" mode="aspectFill" class="swiper-image" />
    </swiper-item>
  </swiper>
</template>

<script>
export default {
  name: 'AppSwiper',
  props: {
    items: {
      type: Array,
      default: () => []
    },
    showDots: {
      type: Boolean,
      default: true
    },
    autoplay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 3000
    },
    duration: {
      type: Number,
      default: 500
    },
    circular: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    onChange(e) {
      this.$emit('change', e.detail.current);
    },
    onItemClick(item, index) {
      this.$emit('click', { item, index });
    }
  }
}
</script>

<style lang="scss">
.app-swiper {
  width: 100%;
  height: 400rpx;
  border-radius: 12rpx;
  overflow: hidden;
  
  .swiper-image {
    width: 100%;
    height: 100%;
  }
}
</style> 