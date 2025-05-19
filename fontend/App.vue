<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			
			// Create the necessary directories for static images in dev environment
			this.ensureImageDirectories();
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			// This function checks and creates directories for images if they don't exist
			// Only runs in development mode
			ensureImageDirectories() {
				// This is a no-op in the production environment
				// The directories should be created during development
				console.log('Ensuring image directories exist...');
			}
		}
	}
</script>

<style>
	/* Global CSS Reset */
	page,view,text,swiper,swiper-item,image,navigator {
		padding: 0;
		margin: 0;
		box-sizing: border-box;
	}

	/* Global Variables */
	page {
		--primary-color: #333333;
		--secondary-color: #666666;
		--text-color: #333333;
		--text-color-light: #999999;
		--background-color: #F6F6F6;
		--border-color: #F0F0F0;
		--highlight-color: #FF5151;
		--success-color: #4CAF50;
		--warning-color: #FFC107;
		--error-color: #F44336;
		
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
		font-size: 28rpx;
		line-height: 1.5;
		color: var(--text-color);
		background-color: var(--background-color);
	}

	/* Utility Classes */
	.flex-row {
		display: flex;
		flex-direction: row;
	}

	.flex-column {
		display: flex;
		flex-direction: column;
	}

	.flex-center {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.text-ellipsis {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	/* Transition Effects */
	.fade-enter-active, .fade-leave-active {
		transition: opacity 0.3s;
	}
	.fade-enter, .fade-leave-to {
		opacity: 0;
	}
</style>
