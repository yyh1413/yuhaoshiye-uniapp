<template>
  <view class="search-page">
    <view class="search-header">
      <view class="back-button" @click="goBack">
        <text class="iconfont icon-back"></text>
      </view>
      <search-bar 
        :value="keyword"
        :focus="true"
        :readOnly="false"
        @input="onSearchInput"
        @confirm="onSearchConfirm"
      />
    </view>
    
    <!-- Filter Tags -->
    <view class="filter-section" v-if="showFilters">
      <scroll-view scroll-x="true" class="filter-scroll">
        <view class="filter-tags">
          <view 
            v-for="(tag, index) in filterTags" 
            :key="index"
            class="filter-tag"
            :class="{ active: tag.active }"
            @click="toggleFilter(tag)"
          >
            <text>{{ tag.name }}</text>
          </view>
        </view>
      </scroll-view>
    </view>
    
    <!-- Loading Indicator -->
    <view class="loading-container" v-if="loading">
      <view class="loading-spinner"></view>
      <text class="loading-text">正在搜索...</text>
    </view>
    
    <!-- Empty State -->
    <view class="empty-state" v-else-if="searchResults.length === 0 && hasSearched">
      <image class="empty-image" src="/static/images/empty-search.png" mode="aspectFit"></image>
      <text class="empty-text">未找到相关结果</text>
      <text class="empty-subtext">尝试使用其他关键词或筛选条件</text>
    </view>
    
    <!-- Search Results -->
    <scroll-view 
      scroll-y="true" 
      class="search-results"
      v-else-if="searchResults.length > 0"
      @scrolltolower="loadMoreResults"
    >
      <view class="result-header">
        <text class="result-count">找到 {{ totalResults }} 条结果</text>
      </view>
      
      <view class="result-list">
        <material-card 
          v-for="(material, index) in searchResults" 
          :key="index"
          :material="material"
          @click="goToMaterialDetail(material)"
        />
      </view>
      
      <!-- Load More Indicator -->
      <view class="load-more" v-if="hasMoreResults">
        <view class="loading-spinner small"></view>
        <text>加载更多...</text>
      </view>
      
      <!-- End of Results -->
      <view class="end-of-results" v-else-if="searchResults.length > 0">
        <text>已显示全部结果</text>
      </view>
    </scroll-view>
    
    <!-- Search Tips -->
    <view class="search-tips" v-else>
      <view class="section-title">
        <text class="title-text">热门搜索</text>
      </view>
      
      <view class="hot-tags">
        <view 
          class="hot-tag"
          v-for="(tag, index) in hotSearchTags"
          :key="index"
          @click="onHotTagClick(tag)"
        >
          <text>{{ tag.name }}</text>
        </view>
      </view>
      
      <view class="section-title" v-if="recentSearches.length > 0">
        <text class="title-text">最近搜索</text>
        <text class="clear-text" @click="clearRecentSearches">清除</text>
      </view>
      
      <view class="recent-searches" v-if="recentSearches.length > 0">
        <view 
          class="recent-item"
          v-for="(item, index) in recentSearches"
          :key="index"
          @click="onRecentSearchClick(item)"
        >
          <text class="iconfont icon-history"></text>
          <text class="recent-text">{{ item }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import SearchBar from '@/components/common/SearchBar.vue';
import MaterialCard from '@/components/material/MaterialCard.vue';
import { searchMaterials } from '@/utils/api';
import { navigateTo } from '@/utils/common';

export default {
  components: {
    SearchBar,
    MaterialCard
  },
  data() {
    return {
      keyword: '',
      searchResults: [],
      totalResults: 0,
      hasMoreResults: false,
      loading: false,
      hasSearched: false,
      currentPage: 1,
      pageSize: 10,
      showFilters: false,
      filterTags: [
        { id: 1, name: '全部', active: true },
        { id: 2, name: '亮面', active: false },
        { id: 3, name: '哑光', active: false },
        { id: 4, name: '一类色', active: false },
        { id: 5, name: '二类色', active: false },
        { id: 6, name: '900×1800', active: false },
        { id: 7, name: '800×2600', active: false }
      ],
      hotSearchTags: [
        { id: 1, name: '大理石' },
        { id: 2, name: '爵士白' },
        { id: 3, name: '卡拉拉白' },
        { id: 4, name: '灰色系' },
        { id: 5, name: '客厅用' },
        { id: 6, name: '9mm厚度' }
      ],
      recentSearches: []
    };
  },
  onLoad(options) {
    // Get recent searches from storage
    try {
      const recentSearches = uni.getStorageSync('recentSearches');
      if (recentSearches) {
        this.recentSearches = JSON.parse(recentSearches);
      }
    } catch (e) {
      console.error('Get recent searches error:', e);
    }
    
    // Check if there's a keyword passed from other pages
    if (options.keyword) {
      this.keyword = decodeURIComponent(options.keyword);
      this.onSearchConfirm();
    }
  },
  methods: {
    async onSearchInput(value) {
      this.keyword = value;
      // Show filters when user inputs something
      this.showFilters = !!value;
    },
    
    async onSearchConfirm() {
      if (!this.keyword.trim()) return;
      
      // Save to recent searches
      this.saveToRecentSearches(this.keyword);
      
      this.loading = true;
      this.hasSearched = true;
      this.currentPage = 1;
      
      try {
        // Get active filter tags
        const activeFilters = this.filterTags
          .filter(tag => tag.active && tag.id !== 1) // Exclude "All" filter
          .map(tag => tag.name);
        
        // Call search API with filters
        const result = await searchMaterials(this.keyword, activeFilters);
        
        this.searchResults = result.slice(0, this.pageSize);
        this.totalResults = result.length;
        this.hasMoreResults = result.length > this.pageSize;
      } catch (error) {
        console.error('Search error:', error);
        uni.showToast({
          title: '搜索失败，请重试',
          icon: 'none'
        });
      } finally {
        this.loading = false;
      }
    },
    
    toggleFilter(tag) {
      // If clicking on "All", deactivate all other filters
      if (tag.id === 1) {
        this.filterTags.forEach(t => {
          t.active = t.id === 1;
        });
      } else {
        // If clicking on other filters, deactivate "All" filter
        const allFilter = this.filterTags.find(t => t.id === 1);
        if (allFilter) {
          allFilter.active = false;
        }
        
        // Toggle the clicked filter
        tag.active = !tag.active;
        
        // If no filters are active, activate "All" filter
        const hasActiveFilters = this.filterTags.some(t => t.id !== 1 && t.active);
        if (!hasActiveFilters && allFilter) {
          allFilter.active = true;
        }
      }
      
      // Perform search with new filters if already searched
      if (this.hasSearched) {
        this.onSearchConfirm();
      }
    },
    
    loadMoreResults() {
      if (!this.hasMoreResults || this.loading) return;
      
      this.currentPage++;
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      
      // Simulate loading more results
      this.loading = true;
      setTimeout(() => {
        const activeFilters = this.filterTags
          .filter(tag => tag.active && tag.id !== 1)
          .map(tag => tag.name);
        
        searchMaterials(this.keyword, activeFilters).then(result => {
          const newResults = result.slice(start, end);
          this.searchResults = [...this.searchResults, ...newResults];
          this.hasMoreResults = result.length > end;
          this.loading = false;
        });
      }, 500);
    },
    
    saveToRecentSearches(keyword) {
      // Remove if already exists
      const index = this.recentSearches.indexOf(keyword);
      if (index !== -1) {
        this.recentSearches.splice(index, 1);
      }
      
      // Add to the beginning
      this.recentSearches.unshift(keyword);
      
      // Keep only last 10 searches
      if (this.recentSearches.length > 10) {
        this.recentSearches.pop();
      }
      
      // Save to storage
      try {
        uni.setStorageSync('recentSearches', JSON.stringify(this.recentSearches));
      } catch (e) {
        console.error('Save recent searches error:', e);
      }
    },
    
    clearRecentSearches() {
      this.recentSearches = [];
      try {
        uni.removeStorageSync('recentSearches');
      } catch (e) {
        console.error('Clear recent searches error:', e);
      }
    },
    
    onHotTagClick(tag) {
      this.keyword = tag.name;
      this.onSearchConfirm();
    },
    
    onRecentSearchClick(keyword) {
      this.keyword = keyword;
      this.onSearchConfirm();
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

.search-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #FFFFFF;
}

.search-header {
  display: flex;
  align-items: center;
  padding: 16rpx 20rpx;
  background-color: #FFFFFF;
  border-bottom: 1rpx solid #F0F0F0;
  
  .back-button {
    padding: 10rpx 20rpx;
    
    .iconfont {
      font-size: 36rpx;
      color: #333;
    }
  }
}

.filter-section {
  padding: 10rpx 0;
  background-color: #FFFFFF;
  border-bottom: 1rpx solid #F0F0F0;
  
  .filter-scroll {
    white-space: nowrap;
  }
  
  .filter-tags {
    display: inline-flex;
    padding: 0 20rpx;
    
    .filter-tag {
      display: inline-flex;
      padding: 10rpx 24rpx;
      margin: 0 10rpx;
      border-radius: 30rpx;
      background-color: #F6F6F6;
      font-size: 24rpx;
      color: #666;
      
      &.active {
        background-color: rgba(0, 0, 0, 0.08);
        color: #333;
        font-weight: 500;
      }
      
      &:first-child {
        margin-left: 0;
      }
    }
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

.search-results {
  flex: 1;
  background-color: #F6F6F6;
  
  .result-header {
    padding: 30rpx;
    
    .result-count {
      font-size: 28rpx;
      color: #999;
    }
  }
  
  .result-list {
    padding: 0 30rpx;
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

.search-tips {
  flex: 1;
  padding: 30rpx;
  
  .section-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30rpx;
    
    .title-text {
      font-size: 32rpx;
      font-weight: 500;
      color: #333;
    }
    
    .clear-text {
      font-size: 28rpx;
      color: #999;
    }
  }
  
  .hot-tags {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 50rpx;
    
    .hot-tag {
      padding: 16rpx 28rpx;
      margin: 0 20rpx 20rpx 0;
      border-radius: 8rpx;
      background-color: #F6F6F6;
      font-size: 28rpx;
      color: #666;
    }
  }
  
  .recent-searches {
    .recent-item {
      display: flex;
      align-items: center;
      padding: 20rpx 0;
      border-bottom: 1rpx solid #F6F6F6;
      
      .iconfont {
        font-size: 32rpx;
        color: #999;
        margin-right: 16rpx;
      }
      
      .recent-text {
        font-size: 28rpx;
        color: #666;
      }
    }
  }
}
</style> 