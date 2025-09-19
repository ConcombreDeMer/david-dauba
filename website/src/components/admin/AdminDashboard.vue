<template>

    <div>
        <h1>Dashboard</h1>

        <div class="content">

            <div class="box chapters"></div>
            <div class="box news"></div>
            <div class="box contact"></div>
            <div class="box other"></div>

        </div>
    </div>


</template>

<script setup lang="ts">

</script>

<style scoped>
.content {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
}

.box {
    border: solid 1px rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
    margin: 10px;
    height: 270px;
    border-radius: 20px;
    margin: 20px;
    cursor: pointer;
    background-color: rgba(255, 255, 255, 0.1);
}

.box:hover {
    background-color: rgba(255, 255, 255, 0.2);
    transform: scale(1.02);
    transition: all 0.3s ease-in-out;
}
</style>