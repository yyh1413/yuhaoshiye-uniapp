<template>
	<view class="content">
		<view class="header">
			<text class="title">关于我们</text>
		</view>

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
	</view>
</template>

<script>
import { getCompanyInfo } from '@/utils/api';

export default {
	data() {
		return {
			companyInfo: {}
		};
	},
	onLoad() {
		this.loadData();
	},
	methods: {
		async loadData() {
			try {
				const companyInfo = await getCompanyInfo();
				this.companyInfo = companyInfo;
			} catch (error) {
				console.error('Error loading company info:', error);
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

.scroll-view-content {
	flex: 1;
	height: calc(100vh - 80rpx);
	background-color: #F6F6F6;
}

.about-section {
	.about-image {
		width: 100%;
		height: 400rpx;
	}

	.about-content {
		padding: 30rpx;
		background-color: #FFFFFF;

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
</style> 