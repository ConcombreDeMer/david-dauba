
<template>
	<div class="titles">
		<h1 class="title">{{ title }}</h1>
		<p class="subtitle">{{ subtitle }}</p>
		<div class="line"></div>
	</div>
</template>

<script setup lang="ts">
defineProps<{
	title: string
	subtitle: string
}>()
</script>

<style scoped>
.titles {
	position: absolute;
	top: 40%;
	left: 32%;
	transform: translate(-50%, -50%);
	z-index: 8;
	width: fit-content;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
}

.title {
		position: relative;
		color: #dcdcdc;
		z-index: 10;
		width: fit-content;
		font-size: 12vh;
}

.subtitle {
		color: #dcdcdc;
		font-size: 2.5vh;
		z-index: 10;
		font-family: 'Fairplay Display', serif;
		font-weight: 400;
		margin-left: 2px;
		padding: 0;
}

.line {
		width: 2px;
		height: 85%;
		background-color: white;
		position: absolute;
		top: 18%;
		left: -20px;
}

@media (max-width: 900px) {
	.titles {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 90vw;
		align-items: center;
		text-align: center;
	}
	.title {
		font-size: 6vh;
	}
	.subtitle {
		font-size: 2vh;
		margin-left: 0;
	}
	.line {
		display: none;
	}
}
</style>
