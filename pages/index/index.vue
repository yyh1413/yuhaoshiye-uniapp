<template>
	<view class="content">
		<view class="header">
			<text class="title">岩板图库</text>
		</view>

		<!-- Tab Content -->
		<swiper class="tab-content" :current="currentTab" @change="onSwiperChange" :style="{ height: contentHeight + 'px' }">
			<!-- Material Selection Tab -->
			<swiper-item>
				<scroll-view scroll-y="true" class="scroll-view-content">
					<!-- Banner Swiper -->
					<app-swiper :items="banners" @click="onBannerClick" />

					<!-- Search Bar -->
					<search-bar placeholder="请输入关键词或产品名称" :readOnly="true" @click="goToSearch" />

					<!-- Category List -->
					<view class="category-section">
						<view class="section-title">
							<text class="title-text">岩板选材</text>
							<text class="title-desc">ROCK SHEET SELECTION</text>
						</view>

						<view class="category-list">
							<view class="category-item" v-for="(item, index) in categories" :key="index" @click="goToCategoryDetail(item)">
								<view class="category-card">
									<image class="category-image" :src="item.image" mode="aspectFill"></image>
									<view class="category-title">{{ item.title }}</view>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</swiper-item>

			<!-- About Us Tab -->
			<swiper-item>
				<scroll-view scroll-y="true" class="scroll-view-content">
					<view class="about-section">
						<image class="about-image" src="/static/images/about-banner.jpg" mode="aspectFill"></image>

						<view class="about-content">
							<view class="section-title">
								<text class="title-text">关于我们</text>
								<text class="title-desc">ABOUT US</text>
							</view>

							<view class="about-info">
								<text class="about-desc">{{ companyInfo.description }}</text>

								<view class="contact-info">
									<view class="contact-item">
										<text class="iconfont icon-phone"></text>
										<text class="contact-text">{{ companyInfo.phone }}</text>
									</view>

									<view class="contact-item">
										<text class="iconfont icon-email"></text>
										<text class="contact-text">{{ companyInfo.email }}</text>
									</view>

									<view class="contact-item">
										<text class="iconfont icon-address"></text>
										<text class="contact-text">{{ companyInfo.address }}</text>
									</view>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>

		<!-- Bottom Tab Bar -->
		<view class="bottom-tab-bar">
			<view 
				v-for="(tab, index) in tabs" 
				:key="index"
				class="tab-item"
				:class="{ active: currentTab === index }"
				@click="onTabChange(index)"
			>
				<text class="iconfont" :class="tab.icon"></text>
				<text class="tab-text">{{ tab.name }}</text>
			</view>
		</view>
	</view>
</template>

<script>
import AppSwiper from '@/components/common/AppSwiper.vue';
import SearchBar from '@/components/common/SearchBar.vue';
import { getBanners, getCategories, getCompanyInfo } from '@/utils/api';
import { navigateTo } from '@/utils/common';

export default {
	components: {
		AppSwiper,
		SearchBar
	},
	data() {
		return {
			tabs: [
				{ name: '选材中心', icon: 'icon-material' },
				{ name: '关于我们', icon: 'icon-about' }
			],
			currentTab: 0,
			contentHeight: 500,
			banners: [],
			categories: [],
			companyInfo: {}
		};
	},
	onLoad() {
		this.loadData();
		this.calculateContentHeight();
	},
	methods: {
		async loadData() {
			try {
				const [banners, categories, companyInfo] = await Promise.all([
					getBanners(),
					getCategories(),
					getCompanyInfo()
				]);

				this.banners = banners;
				this.categories = categories;
				this.companyInfo = companyInfo;
				console.log('Categories loaded:', categories);
			} catch (error) {
				console.error('Error loading data:', error);
			}
		},

		calculateContentHeight() {
			// Get system info
			const systemInfo = uni.getSystemInfoSync();
			// Calculate content height (screen height - header - bottom tab bar height)
			this.contentHeight = systemInfo.windowHeight - uni.upx2px(180) - uni.upx2px(100);
		},

		onTabChange(index) {
			this.currentTab = index;
		},

		onSwiperChange(e) {
			this.currentTab = e.detail.current;
		},

		onBannerClick({ item }) {
			console.log('Banner clicked:', item);
		},

		goToSearch() {
			console.log('Navigating to search page');
			try {
				uni.navigateTo({
					url: '/pages/search/search',
					success: () => {
						console.log('Navigation to search page successful');
					},
					fail: (err) => {
						console.error('Navigation to search page failed:', err);
					}
				});
			} catch (error) {
				console.error('Error during navigation to search page:', error);
			}
		},

		goToCategoryDetail(category) {
			console.log('Navigating to category detail:', category);
			if (!category || !category.id) {
				console.error('Invalid category data:', category);
				return;
			}
			
			try {
				uni.navigateTo({
					url: `/pages/category/category?id=${category.id}&title=${encodeURIComponent(category.title || '')}`,
					success: () => {
						console.log('Navigation to category page successful');
					},
					fail: (err) => {
						console.error('Navigation to category page failed:', err);
					}
				});
			} catch (error) {
				console.error('Error during navigation to category page:', error);
			}
		}
	}
};
</script>

<style lang="scss">
@import '@/static/fonts/iconfont.css';

.content {
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100vh;
	background-color: #FFFFFF;
}

.header {
	padding: 20rpx 30rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: #FFFFFF;
	box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05);

	.title {
		font-size: 36rpx;
		font-weight: 600;
		color: #333;
	}
}

.tab-content {
	flex: 1;
	width: 100%;
}

.scroll-view-content {
	height: 100%;
	background-color: #F6F6F6;
}

.category-section {
	padding: 20rpx 30rpx 40rpx;

	.section-title {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin: 30rpx 0;

		.title-text {
			font-size: 32rpx;
			font-weight: 600;
			color: #333;
			margin-bottom: 6rpx;
		}

		.title-desc {
			font-size: 24rpx;
			color: #999;
		}
	}

	.category-list {
		display: flex;
		flex-wrap: wrap;
		margin: 0 -10rpx;

		.category-item {
			width: 50%;
			padding: 10rpx;
			box-sizing: border-box;

			.category-card {
				background-color: #FFFFFF;
				border-radius: 12rpx;
				overflow: hidden;
				box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);

				.category-image {
					width: 100%;
					height: 240rpx;
					background-color: #F0F0F0;
				}

				.category-title {
					padding: 16rpx;
					font-size: 28rpx;
					font-weight: 500;
					color: #333;
					text-align: center;
				}
			}
		}
	}
}

.about-section {
	.about-image {
		width: 100%;
		height: 400rpx;
	}

	.about-content {
		padding: 30rpx;
		background-color: #FFFFFF;

		.about-info {
			padding: 20rpx 0;

			.about-desc {
				font-size: 28rpx;
				color: #666;
				line-height: 1.6;
				margin-bottom: 40rpx;
			}

			.contact-info {
				margin-top: 30rpx;

				.contact-item {
					display: flex;
					align-items: center;
					margin-bottom: 20rpx;

					.iconfont {
						font-size: 36rpx;
						color: #333;
						margin-right: 20rpx;
					}

					.contact-text {
						font-size: 28rpx;
						color: #666;
					}
				}
			}
		}
	}
}

.bottom-tab-bar {
	display: flex;
	background-color: #FFFFFF;
	height: 100rpx;
	box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
	position: relative;
	z-index: 10;

	.tab-item {
		flex: 1;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		.iconfont {
			font-size: 40rpx;
			color: #999;
			margin-bottom: 6rpx;
		}

		.tab-text {
			font-size: 24rpx;
			color: #999;
		}

		&.active {
			.iconfont, .tab-text {
				color: #333;
			}
		}
	}
}
</style>
