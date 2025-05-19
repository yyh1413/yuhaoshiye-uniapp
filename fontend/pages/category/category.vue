<template>
  <view class="category-page">
    <view class="header">
      <view class="back-button" @click="goBack">
        <text class="iconfont icon-back"></text>
      </view>
      <text class="page-title">{{ categoryTitle }}</text>
      <view class="right-placeholder"></view>
    </view>
    
    <!-- Loading Indicator -->
    <view class="loading-container" v-if="loading">
      <view class="loading-spinner"></view>
      <text class="loading-text">加载中...</text>
    </view>
    
    <!-- Empty State -->
    <view class="empty-state" v-else-if="materials.length === 0">
      <image class="empty-image" src="/static/images/empty-category.png" mode="aspectFit"></image>
      <text class="empty-text">暂无相关产品</text>
      <text class="empty-subtext">敬请期待更多产品上线</text>
    </view>
    
    <!-- Materials List -->
    <scroll-view 
      scroll-y="true" 
      class="materials-list"
      v-else
      @scrolltolower="loadMoreMaterials"
    >
      <!-- Filter Section -->
      <view class="filter-section">
        <view 
          class="filter-item"
          :class="{ active: currentSortOrder === 'default' }"
          @click="setSortOrder('default')"
        >
          <text>默认</text>
        </view>
        <view 
          class="filter-item"
          :class="{ active: currentSortOrder === 'popular' }"
          @click="setSortOrder('popular')"
        >
          <text>热门</text>
        </view>
        <view 
          class="filter-item"
          :class="{ active: currentSortOrder === 'newest' }"
          @click="setSortOrder('newest')"
        >
          <text>最新</text>
        </view>
        <view 
          class="filter-item"
          @click="showFilterActionSheet"
        >
          <text>筛选</text>
          <text class="iconfont icon-filter"></text>
        </view>
      </view>

      <!-- Materials Grid -->
      <view class="materials-grid">
        <view 
          class="material-item"
          v-for="(material, index) in displayedMaterials"
          :key="index"
          @click="goToMaterialDetail(material)"
        >
          <material-card :material="material" />
        </view>
      </view>
      
      <!-- Load More Indicator -->
      <view class="load-more" v-if="hasMoreMaterials">
        <view class="loading-spinner small"></view>
        <text>加载更多...</text>
      </view>
      
      <!-- End of Results -->
      <view class="end-of-results" v-else>
        <text>已显示全部结果</text>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import MaterialCard from '@/components/material/MaterialCard.vue';
import { getMaterialsByCategory } from '@/utils/api';
import { navigateTo } from '@/utils/common';

export default {
  components: {
    MaterialCard
  },
  data() {
    return {
      categoryId: null,
      categoryTitle: '',
      materials: [],
      displayedMaterials: [],
      loading: true,
      currentPage: 1,
      pageSize: 10,
      hasMoreMaterials: false,
      currentSortOrder: 'default',
      filterOptions: {
        finish: [], // 'matte', 'glossy'
        type: []    // 'class1', 'class2'
      }
    };
  },
  onLoad(options) {
    if (options.id) {
      this.categoryId = parseInt(options.id);
      this.categoryTitle = options.title || '岩板选材';
      this.loadMaterialsData();
    } else {
      uni.showToast({
        title: '分类信息错误',
        icon: 'none'
      });
      setTimeout(() => {
        uni.navigateBack();
      }, 1500);
    }
  },
  methods: {
    async loadMaterialsData() {
      this.loading = true;
      
      try {
        const materials = await getMaterialsByCategory(this.categoryId);
        this.materials = this.applySortAndFilter(materials);
        this.updateDisplayedMaterials();
      } catch (error) {
        console.error('Load materials error:', error);
        uni.showToast({
          title: '加载失败，请重试',
          icon: 'none'
        });
      } finally {
        this.loading = false;
      }
    },
    
    applySortAndFilter(materials) {
      // First apply filters
      let result = materials;
      
      if (this.filterOptions.finish.length > 0) {
        result = result.filter(item => 
          this.filterOptions.finish.some(finish => 
            item.finish && item.finish.includes(finish)
          )
        );
      }
      
      if (this.filterOptions.type.length > 0) {
        result = result.filter(item => 
          this.filterOptions.type.some(type => 
            item.categories && item.categories.includes(type)
          )
        );
      }
      
      // Then apply sorting
      switch (this.currentSortOrder) {
        case 'popular':
          // For demo, we'll just sort alphabetically by name
          return result.sort((a, b) => a.name.localeCompare(b.name));
        case 'newest':
          // For demo, reverse order of materials
          return [...result].reverse();
        case 'default':
        default:
          return result;
      }
    },
    
    updateDisplayedMaterials() {
      const start = 0;
      const end = this.currentPage * this.pageSize;
      
      this.displayedMaterials = this.materials.slice(start, end);
      this.hasMoreMaterials = this.materials.length > end;
    },
    
    loadMoreMaterials() {
      if (!this.hasMoreMaterials) return;
      
      this.currentPage++;
      this.updateDisplayedMaterials();
    },
    
    setSortOrder(order) {
      if (this.currentSortOrder === order) return;
      
      this.currentSortOrder = order;
      this.currentPage = 1;
      this.materials = this.applySortAndFilter(this.materials);
      this.updateDisplayedMaterials();
    },
    
    showFilterActionSheet() {
      const finishOptions = ['亮面', '哑光'];
      const typeOptions = ['一类色', '二类色'];
      
      uni.showActionSheet({
        itemList: [...finishOptions, ...typeOptions],
        success: (res) => {
          const selectedIndex = res.tapIndex;
          
          if (selectedIndex < finishOptions.length) {
            // Selected a finish option
            const finish = finishOptions[selectedIndex];
            const index = this.filterOptions.finish.indexOf(finish);
            
            if (index === -1) {
              this.filterOptions.finish.push(finish);
            } else {
              this.filterOptions.finish.splice(index, 1);
            }
          } else {
            // Selected a type option
            const type = typeOptions[selectedIndex - finishOptions.length];
            const index = this.filterOptions.type.indexOf(type);
            
            if (index === -1) {
              this.filterOptions.type.push(type);
            } else {
              this.filterOptions.type.splice(index, 1);
            }
          }
          
          // Apply filters
          this.currentPage = 1;
          this.loadMaterialsData();
        }
      });
    },
    
    goToMaterialDetail(material) {
      navigateTo('/pages/material/detail', { id: material.id });
    },
    
    goBack() {
      uni.navigateBack();
    }
  }
};
</script>

<style lang="scss">
@import '@/static/fonts/iconfont.css';

.category-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #F6F6F6;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 30rpx;
  background-color: #FFFFFF;
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05);
  
  .back-button, .right-placeholder {
    width: 60rpx;
    height: 60rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .back-button {
    .iconfont {
      font-size: 36rpx;
      color: #333;
    }
  }
  
  .page-title {
    font-size: 32rpx;
    font-weight: 500;
    color: #333;
    flex: 1;
    text-align: center;
  }
}

.loading-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 400rpx;
  
  .loading-spinner {
    width: 80rpx;
    height: 80rpx;
    border: 6rpx solid #F0F0F0;
    border-top: 6rpx solid #333;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 20rpx;
    
    &.small {
      width: 40rpx;
      height: 40rpx;
      border-width: 4rpx;
    }
  }
  
  .loading-text {
    font-size: 28rpx;
    color: #999;
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;
  
  .empty-image {
    width: 300rpx;
    height: 300rpx;
    margin-bottom: 40rpx;
  }
  
  .empty-text {
    font-size: 32rpx;
    color: #333;
    margin-bottom: 16rpx;
  }
  
  .empty-subtext {
    font-size: 28rpx;
    color: #999;
  }
}

.materials-list {
  flex: 1;
  
  .filter-section {
    display: flex;
    padding: 20rpx 30rpx;
    background-color: #FFFFFF;
    border-bottom: 1rpx solid #F0F0F0;
    
    .filter-item {
      display: flex;
      align-items: center;
      margin-right: 40rpx;
      font-size: 28rpx;
      color: #666;
      position: relative;
      
      .iconfont {
        font-size: 24rpx;
        margin-left: 6rpx;
      }
      
      &.active {
        color: #333;
        font-weight: 500;
        
        &:after {
          content: '';
          position: absolute;
          bottom: -8rpx;
          left: 50%;
          transform: translateX(-50%);
          width: 30rpx;
          height: 4rpx;
          background-color: #333;
          border-radius: 2rpx;
        }
      }
      
      &:last-child {
        margin-right: 0;
        margin-left: auto;
      }
    }
  }
  
  .materials-grid {
    padding: 20rpx 30rpx;
    
    .material-item {
      margin-bottom: 30rpx;
    }
  }
  
  .load-more, .end-of-results {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40rpx 0;
    font-size: 28rpx;
    color: #999;
    
    .loading-spinner {
      margin-right: 16rpx;
    }
  }
}
</style> 