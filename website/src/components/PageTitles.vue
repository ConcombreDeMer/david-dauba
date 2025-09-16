
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
		z-index: 20;
		width: fit-content;
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
		margin-top: -20px;
}

.line {
		width: 2px;
		height: 85%;
		background-color: white;
		position: absolute;
		top: 18%;
		left: -20px;
}
</style>
