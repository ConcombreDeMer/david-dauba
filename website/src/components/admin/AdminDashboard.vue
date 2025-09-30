<template>

    <div class="admin-dashboard">
        
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
.admin-dashboard {
    display: block;
    width: 100%;
    height: 100%;
    position: relative;
    box-sizing: border-box;

    h1{
        height: 20%;
    }
}


.content {
    display: grid;
    height: 80%;
    gap : 20px;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
    box-sizing: border-box;
}

.box {
    position: relative;
    border: solid 1px rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
    background-color: rgba(255, 255, 255, 0.1);
    height: auto;
    border-radius: 20px;
    cursor: pointer;
    box-sizing: border-box;
}

.box:hover {
    background-color: rgba(255, 255, 255, 0.2);
    transform: scale(1.02);
    transition: all 0.3s ease-in-out;
}
</style>