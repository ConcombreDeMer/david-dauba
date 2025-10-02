
<template>
	<div class="down-arrow-container">
		<svg class="down-arrow" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
			<polyline points="6 9 12 15 18 9" />
		</svg>
	</div>
</template>

<style scoped>
.down-arrow-container {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	margin-bottom: 20px;
	height: 40px;
}

.down-arrow {
	color: #dcdcdc;
	animation: bounce-arrow 1.2s infinite;
	margin-top: 0;
	width: 56px;
	height: 56px;
}

@keyframes bounce-arrow {
	0%, 100% {
		transform: translateY(0);
	}
	50% {
		transform: translateY(12px);
	}
}
</style>
