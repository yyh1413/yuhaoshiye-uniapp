<template>
  <view class="detail-page">
    <view class="header">
      <view class="back-button" @click="goBack">
        <text class="iconfont icon-back"></text>
      </view>
      <text class="page-title">{{ material.name || '产品详情' }}</text>
      <view class="share-button" @click="shareProduct">
        <text class="iconfont icon-share"></text>
      </view>
    </view>
    
    <!-- Loading Indicator -->
    <view class="loading-container" v-if="loading">
      <view class="loading-spinner"></view>
      <text class="loading-text">加载中...</text>
    </view>
    
    <!-- Error State -->
    <view class="error-state" v-else-if="error">
      <image class="error-image" src="/static/images/error.png" mode="aspectFit"></image>
      <text class="error-text">加载失败</text>
      <text class="error-subtext">{{ errorMessage }}</text>
      <button class="retry-button" @click="loadMaterialData">重试</button>
    </view>
    
    <!-- Material Details -->
    <scroll-view 
      scroll-y="true" 
      class="detail-content"
      v-else
    >
      <!-- Image Gallery -->
      <swiper 
        class="gallery-swiper" 
        indicator-dots 
        autoplay 
        circular
      >
        <swiper-item>
          <image 
            :src="material.image" 
            mode="aspectFill" 
            class="gallery-image"
            @click="previewImage(material.image)"
          ></image>
        </swiper-item>
        <!-- We'd normally have multiple images, but using the same one for the demo -->
        <swiper-item v-if="material.image">
          <image 
            :src="material.image" 
            mode="aspectFill" 
            class="gallery-image"
            @click="previewImage(material.image)"
          ></image>
        </swiper-item>
      </swiper>
      
      <!-- Basic Info -->
      <view class="basic-info">
        <view class="product-name-row">
          <text class="product-name">{{ material.name }}</text>
          <view class="favorite-button" @click="toggleFavorite">
            <text class="iconfont" :class="isFavorite ? 'icon-favorite-filled' : 'icon-favorite'"></text>
          </view>
        </view>
        
        <view class="product-code">
          <text>{{ material.code }}</text>
        </view>
        
        <view class="category-tags">
          <view 
            class="category-tag"
            v-for="(category, index) in material.categories"
            :key="index"
          >
            <text>{{ category }}</text>
          </view>
        </view>
      </view>
      
      <!-- Specifications -->
      <view class="specifications">
        <view class="section-title">
          <text>产品规格</text>
        </view>
        
        <view class="specs-grid">
          <view class="spec-item">
            <text class="spec-label">规格</text>
            <text class="spec-value">{{ material.size }}</text>
          </view>
          
          <view class="spec-item">
            <text class="spec-label">厚度</text>
            <text class="spec-value">{{ material.thickness }}</text>
          </view>
          
          <view class="spec-item" v-if="material.finish">
            <text class="spec-label">工艺</text>
            <text class="spec-value">{{ material.finish }}</text>
          </view>
          
          <view class="spec-item">
            <text class="spec-label">类别</text>
            <text class="spec-value">{{ material.categories ? material.categories.join(', ') : '无' }}</text>
          </view>
        </view>
      </view>
      
      <!-- Product Description -->
      <view class="product-description">
        <view class="section-title">
          <text>产品描述</text>
        </view>
        
        <text class="description-text">
          {{ material.description || '这款精美的岩板具有出色的耐用性和美感，其纹理灵感来自天然大理石，同时具备优异的耐刮擦和耐污染性能。适用于室内墙面、地面装饰，为空间增添自然高贵的气息。' }}
        </text>
      </view>
      
      <!-- Application Scenarios -->
      <view class="application-scenarios">
        <view class="section-title">
          <text>应用场景</text>
        </view>
        
        <view class="scenario-list">
          <view class="scenario-item">
            <image src="/static/images/scenario1.jpg" mode="aspectFill" class="scenario-image"></image>
            <text class="scenario-name">客厅墙面</text>
          </view>
          
          <view class="scenario-item">
            <image src="/static/images/scenario2.jpg" mode="aspectFill" class="scenario-image"></image>
            <text class="scenario-name">厨房台面</text>
          </view>
          
          <view class="scenario-item">
            <image src="/static/images/scenario3.jpg" mode="aspectFill" class="scenario-image"></image>
            <text class="scenario-name">浴室墙面</text>
          </view>
        </view>
      </view>
      
      <!-- Recommended Products -->
      <view class="recommended-products">
        <view class="section-title">
          <text>相关推荐</text>
        </view>
        
        <scroll-view 
          scroll-x="true" 
          class="recommend-scroll"
        >
          <view class="recommend-list">
            <view 
              class="recommend-item"
              v-for="(item, index) in recommendedProducts"
              :key="index"
              @click="goToMaterialDetail(item)"
            >
              <image :src="item.image" mode="aspectFill" class="recommend-image"></image>
              <text class="recommend-name">{{ item.name }}</text>
            </view>
          </view>
        </scroll-view>
      </view>
    </scroll-view>
    
    <!-- Action Bar -->
    <view class="action-bar">
      <button class="action-button" @click="contactConsultant">
        <text class="iconfont icon-phone"></text>
        <text>咨询顾问</text>
      </button>
      
      <button class="primary-button" @click="requestSample">
        申请样品
      </button>
    </view>
  </view>
</template>

<script>
import { getMaterialById, getMaterialsByCategory } from '@/utils/api';
import { navigateTo, showToast } from '@/utils/common';

export default {
  data() {
    return {
      materialId: '',
      material: {},
      recommendedProducts: [],
      loading: true,
      error: false,
      errorMessage: '无法加载产品信息，请检查网络连接',
      isFavorite: false
    };
  },
  onLoad(options) {
    if (options.id) {
      this.materialId = options.id;
      this.loadMaterialData();
    } else {
      this.error = true;
      this.loading = false;
      this.errorMessage = '产品ID不存在';
    }
    
    // Check if this material is in favorites
    this.checkFavoriteStatus();
  },
  methods: {
    async loadMaterialData() {
      this.loading = true;
      this.error = false;
      
      try {
        // Get material details
        const material = await getMaterialById(this.materialId);
        
        if (!material) {
          this.error = true;
          this.errorMessage = '找不到该产品信息';
          return;
        }
        
        this.material = material;
        
        // Get recommended products (similar materials)
        if (material.categories && material.categories.length > 0) {
          // For demo, we'll just get all materials from any category
          const categoryMaterials = await getMaterialsByCategory(1);
          
          // Filter out current material and limit to 5 items
          this.recommendedProducts = categoryMaterials
            .filter(item => item.id !== this.materialId)
            .slice(0, 5);
        }
      } catch (error) {
        console.error('Load material error:', error);
        this.error = true;
        this.errorMessage = '加载失败，请重试';
      } finally {
        this.loading = false;
      }
    },
    
    previewImage(url) {
      // Creates an array with the current image and a few more (same image for demo)
      const urls = [url, url, url];
      
      uni.previewImage({
        urls,
        current: url
      });
    },
    
    checkFavoriteStatus() {
      try {
        const favorites = uni.getStorageSync('favorites');
        if (favorites) {
          const favoritesList = JSON.parse(favorites);
          this.isFavorite = favoritesList.includes(this.materialId);
        }
      } catch (e) {
        console.error('Check favorites error:', e);
      }
    },
    
    toggleFavorite() {
      try {
        let favoritesList = [];
        const favorites = uni.getStorageSync('favorites');
        
        if (favorites) {
          favoritesList = JSON.parse(favorites);
        }
        
        if (this.isFavorite) {
          // Remove from favorites
          const index = favoritesList.indexOf(this.materialId);
          if (index !== -1) {
            favoritesList.splice(index, 1);
          }
          showToast('已取消收藏');
        } else {
          // Add to favorites
          favoritesList.push(this.materialId);
          showToast('已添加到收藏');
        }
        
        uni.setStorageSync('favorites', JSON.stringify(favoritesList));
        this.isFavorite = !this.isFavorite;
      } catch (e) {
        console.error('Toggle favorite error:', e);
        showToast('操作失败，请重试');
      }
    },
    
    goToMaterialDetail(material) {
      // If it's the same material, don't navigate
      if (material.id === this.materialId) return;
      
      navigateTo('/pages/material/detail', { id: material.id });
    },
    
    shareProduct() {
      // This would normally use the uni.share API, but for the demo we'll just show a toast
      uni.showActionSheet({
        itemList: ['微信好友', '朋友圈', '复制链接'],
        success: (res) => {
          showToast('分享功能开发中');
        }
      });
    },
    
    contactConsultant() {
      uni.makePhoneCall({
        phoneNumber: '0757-88888888',
        fail: () => {
          showToast('拨打电话失败，请手动拨打: 0757-88888888');
        }
      });
    },
    
    requestSample() {
      uni.showModal({
        title: '申请样品',
        content: '您确定要申请此产品的样品吗？我们的客服会与您联系确认详情。',
        confirmText: '确认申请',
        success: (res) => {
          if (res.confirm) {
            showToast('申请已提交，我们会尽快与您联系', 'success');
          }
        }
      });
    },
    
    goBack() {
      uni.navigateBack();
    }
  }
};
</script>

<style lang="scss">
@import '@/static/fonts/iconfont.css';

.detail-page {
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
  
  .back-button, .share-button {
    width: 60rpx;
    height: 60rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .iconfont {
    font-size: 36rpx;
    color: #333;
  }
  
  .page-title {
    font-size: 32rpx;
    font-weight: 500;
    color: #333;
    flex: 1;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0 20rpx;
  }
}

.loading-container, .error-state {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1;
  
  .loading-spinner {
    width: 80rpx;
    height: 80rpx;
    border: 6rpx solid #F0F0F0;
    border-top: 6rpx solid #333;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 20rpx;
  }
  
  .loading-text, .error-text {
    font-size: 32rpx;
    color: #333;
    margin-bottom: 16rpx;
  }
  
  .error-subtext {
    font-size: 28rpx;
    color: #999;
    margin-bottom: 40rpx;
  }
  
  .error-image {
    width: 200rpx;
    height: 200rpx;
    margin-bottom: 40rpx;
  }
  
  .retry-button {
    background-color: #333;
    color: #FFFFFF;
    font-size: 28rpx;
    padding: 12rpx 40rpx;
    border-radius: 30rpx;
    border: none;
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.detail-content {
  flex: 1;
  margin-bottom: 100rpx; /* Space for action bar */
  
  .gallery-swiper {
    width: 100%;
    height: 600rpx;
    
    .gallery-image {
      width: 100%;
      height: 100%;
    }
  }
  
  .basic-info {
    padding: 30rpx;
    background-color: #FFFFFF;
    
    .product-name-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16rpx;
      
      .product-name {
        font-size: 36rpx;
        font-weight: 600;
        color: #333;
      }
      
      .favorite-button {
        padding: 10rpx;
        
        .iconfont {
          font-size: 40rpx;
          color: #999;
          
          &.icon-favorite-filled {
            color: #FF5151;
          }
        }
      }
    }
    
    .product-code {
      font-size: 28rpx;
      color: #999;
      margin-bottom: 20rpx;
    }
    
    .category-tags {
      display: flex;
      flex-wrap: wrap;
      
      .category-tag {
        display: inline-flex;
        padding: 6rpx 20rpx;
        background-color: rgba(0, 0, 0, 0.05);
        border-radius: 6rpx;
        font-size: 24rpx;
        color: #666;
        margin-right: 16rpx;
        margin-bottom: 10rpx;
      }
    }
  }
  
  .specifications, .product-description, .application-scenarios, .recommended-products {
    margin-top: 20rpx;
    padding: 30rpx;
    background-color: #FFFFFF;
    
    .section-title {
      font-size: 32rpx;
      font-weight: 500;
      color: #333;
      margin-bottom: 30rpx;
      position: relative;
      padding-left: 20rpx;
      
      &:before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 6rpx;
        height: 28rpx;
        background-color: #333;
        border-radius: 3rpx;
      }
    }
  }
  
  .specs-grid {
    display: flex;
    flex-wrap: wrap;
    
    .spec-item {
      width: 50%;
      padding: 16rpx 0;
      
      .spec-label {
        display: block;
        font-size: 26rpx;
        color: #999;
        margin-bottom: 10rpx;
      }
      
      .spec-value {
        font-size: 28rpx;
        color: #333;
      }
    }
  }
  
  .description-text {
    font-size: 28rpx;
    color: #666;
    line-height: 1.8;
  }
  
  .scenario-list {
    display: flex;
    justify-content: space-between;
    
    .scenario-item {
      width: 30%;
      
      .scenario-image {
        width: 100%;
        height: 180rpx;
        border-radius: 8rpx;
        margin-bottom: 12rpx;
      }
      
      .scenario-name {
        font-size: 26rpx;
        color: #666;
        text-align: center;
        display: block;
      }
    }
  }
  
  .recommend-scroll {
    width: 100%;
    white-space: nowrap;
    
    .recommend-list {
      display: inline-flex;
      padding-bottom: 20rpx;
      
      .recommend-item {
        width: 200rpx;
        margin-right: 20rpx;
        
        .recommend-image {
          width: 200rpx;
          height: 240rpx;
          border-radius: 8rpx;
          margin-bottom: 12rpx;
        }
        
        .recommend-name {
          font-size: 26rpx;
          color: #666;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          display: block;
        }
      }
    }
  }
}

.action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16rpx 30rpx;
  background-color: #FFFFFF;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
  
  .action-button, .primary-button {
    height: 80rpx;
    border-radius: 40rpx;
    font-size: 28rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 40rpx;
    border: none;
  }
  
  .action-button {
    background-color: #F6F6F6;
    color: #666;
    
    .iconfont {
      font-size: 32rpx;
      margin-right: 10rpx;
    }
  }
  
  .primary-button {
    background-color: #333;
    color: #FFFFFF;
    flex: 1;
    margin-left: 30rpx;
  }
}
</style> 