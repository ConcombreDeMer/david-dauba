<template>
    <div class="shop-view">
        <PageTitles title="Boutique" subtitle="Bienvenue dans la boutique !" />

        <div class="content">

            <ArrowDownPage />


            <ProductCard v-for="product in products" :key="product.id" :product="product" />

        </div>

    </div>

</template>



<script setup lang="ts">

import { ref, onMounted, onUnmounted } from 'vue';
import ProductCard from '@/components/ProductCard.vue';
import PageTitles from '@/components/PageTitles.vue';
import ArrowDownPage from '@/components/ArrowDownPage.vue';
import { supabase } from '../../supabase'

const products = ref<Array<{
    id: number
    title: string
    little_description: string
    big_description: string
    photo_url: string
    price: number
}>>([])


const fetchProducts = async () => {
    const { data, error } = await supabase.from('products').select('*').order('id', { ascending: false })
    if (error) {
        console.error('Erreur lors de la récupération des produits:', error)
        return
    }
    products.value = data || []
}

onMounted(() => {
    fetchProducts()
});



</script>

<style scoped>
.shop-view {
    margin-top: 80vh;

    .content {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        width: 70%;
        margin-left: auto;
        margin-right: auto;
        gap: 50px;
    }
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

.buy-button2 {
    background: #222;
    color: #ffffff;
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

.buy-button2:hover {
    background: linear-gradient(90deg, #bdbdbd 0% #ffff 100%);
    opacity: 1;
    transition: all 0.3s ease-in-out;
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

.buy-form-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    /* Pour l'animation fade */
    pointer-events: auto;
    box-sizing: border-box;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 0.3s cubic-bezier(.4, 0, .2, 1);
}

.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
}

.modal-fade-enter-to,
.modal-fade-leave-from {
    opacity: 1;
}

.modal-scale-enter-active,
.modal-scale-leave-active {
    transition: transform 0.3s cubic-bezier(.4, 0, .2, 1), opacity 0.3s cubic-bezier(.4, 0, .2, 1);
}

.modal-scale-enter-from,
.modal-scale-leave-to {
    transform: scale(0.85);
    opacity: 0;
}

.modal-scale-enter-to,
.modal-scale-leave-from {
    transform: scale(1);
    opacity: 1;
}


.buy-form {
        background: rgba(255, 255, 255, 1);
        border-radius: 12px;
        padding: 32px 24px;
        box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
        display: flex;
        flex-direction: column;
        gap: 18px;
        box-sizing: border-box;
        width: 40vw;
        max-width: 90vw;
        min-width: 300px;
}

@media (max-width: 600px) {
    .buy-form-modal {
        align-items: flex-end;
        padding: 0;
    }
    .buy-form {
        width: 100vw;
        min-width: unset;
        height: 100vh;
        overflow-y: auto;
        max-width: 100vw;
        border-radius: 0 0 0 0;
        padding: 20px;
        font-size: 0.98rem;
        box-shadow: 0 -2px 16px 0 rgba(0,0,0,0.18);
        padding-bottom: 100px;
        padding-top: 20px;
    }
    .buy-form h2 {
        font-size: 1.2rem;
    }
    .buy-form label {
        font-size: 0.98rem;
    }
    .buy-form input,
    .buy-form textarea {
        font-size: 1rem;
        padding: 5px 6px;
    }
    .buy-form-actions {
        flex-direction: column;
        gap: 8px;
        justify-content: stretch;
    }
}

.buy-explanation {
    font-size: 1rem;
    color: #1a1a1a;
    margin-bottom: 12px;
    font-weight: 300;

}

.buy-form h2 {
    color: #222;
    margin-bottom: 10px;
    font-size: 1.7rem;
    margin-top: 0;
    padding: 0;
}

.buy-form label {
    color: #222;
    font-size: 1rem;
    margin-bottom: 2px;
}

.buy-form input,
.buy-form textarea {
    width: 100%;
    font-size: 1.1rem;
    padding: 6px 8px;
    border: 1px solid #bdbdbd;
    border-radius: 6px;
    margin-bottom: 8px;
    background: #fff;
    color: #222;
    box-sizing: border-box;
}

.buy-form-actions {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
}

.buy-status {
    color: #0e0e0e;
    font-size: 1rem;
    margin-top: 8px;
}
/* Empêche le scroll et la sélection du contenu derrière la modal */
.modal-open {
    overflow: hidden !important;
    height: 100vh !important;
    touch-action: none;
    user-select: none;
    -webkit-user-select: none;
    -webkit-overflow-scrolling: none;
}
</style>
