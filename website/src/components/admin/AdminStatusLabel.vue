
<template>
	<span :class="['status-label', statusClass]">
		{{ statusLabel }}
	</span>
</template>

<script setup lang="ts">
const props = defineProps<{ status: string }>()

const statusLabel = props.status === 'Publique' ? 'Publique' : 'Privé'
const statusClass = props.status === 'Publique' ? 'status-publique' : 'status-prive'
</script>

<style scoped>
.status-label {
	display: inline-block;
	padding: 4px 14px;
	border-radius: 12px;
	font-size: 0.95em;
	font-weight: 600;
	color: #fff;
	letter-spacing: 0.5px;
	min-width: 60px;
	text-align: center;
}
.status-publique {
	background: linear-gradient(90deg, #74be7c 40%, #3c9561 100%);
}
.status-prive {
	background: linear-gradient(90deg, #e8c05b 40%, #d6a02c 100%);
}
</style>
