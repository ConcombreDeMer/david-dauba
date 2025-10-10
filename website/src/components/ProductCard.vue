<template>
  <div class="product-card" @click="goToProductPage">
    <img :src="product.photo_url || '/book.jpg'" :alt="product.title" class="product-image" />
    <div class="product-info">
      <h2 class="product-title">{{ product.title }}</h2>
      <p class="product-description">{{ product.little_description }}</p>
      <div class="product-bottom">
        <span class="product-price">{{ product.price }}&nbsp;€</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { useRouter } from 'vue-router';
const props = defineProps<{ product: {
  id: number;
  title: string;
  little_description: string;
  big_description: string;
  photo_url: string;
  price: number;
} }>();

const router = useRouter();
function goToProductPage() {
  router.push({ name: 'product-detail', params: { id: props.product.id } });
}
</script>

<style scoped>
.product-card {
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 20px;
    border: solid 1px rgba(180, 180, 180, 0.1);
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 5px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    max-width: 500px;
    min-width: 300px;
    width: 30%;
    padding: 20px;
    box-sizing: border-box;
    transition: all 0.3s ease-in-out;
    opacity: 0.9;
}
.product-card:hover {
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
    transform: translateY(-4px);
    transition: all 0.3s ease-in-out;
    cursor: pointer;
    opacity: 1;
}
.product-image {
    width: 100%;
    height: auto;
    border-radius: 5px;
    user-select: none;
    -webkit-user-drag: none;
}
.product-info {
    color: #ffffff;
    display: flex;
    flex-direction: column;
    align-items: start;
    width: 100%;
    box-sizing: border-box;
}
.product-title {
    font-size: 2rem;
    font-weight: 500;
    margin: 0;
    padding: 0;
}
.product-description {
    font-size: 1rem;
    color: #b6b6b6;
    text-align: left;
    font-weight: 300;
    margin: 0;
    padding: 0;
}
.product-bottom {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-top: 20px;
}
.product-price {
    font-size: 1.5rem;
    font-weight: 300;
    color: #ffffff;
    margin-right: 1.5rem;
}
.buy-button {
    background: #ffffff;
    color: #111111;
    border: none;
    border-radius: 50px;
    padding: 10px 30px;
    font-size: 1.3rem;
    font-weight: 500;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
    opacity: 0.8;
    transition: all 0.3 ease-in-out;
}
.buy-button:hover {
    background: linear-gradient(90deg, #bdbdbd 0% #ffff 100%);
    opacity: 1;
    transition: all 0.3s ease-in-out;
}
</style>
