<template>
    <div class="shop-view">
        <PageTitles title="Boutique" subtitle="Bienvenue dans la boutique !" />

        <div class="content">

            <ArrowDownPage />


            <!-- Liste dynamique des produits -->
            <div v-for="product in products" :key="product.id" class="product-card">
                <img :src="product.photo_url || '/book.jpg'" :alt="product.title" class="product-image" />
                <div class="product-info">
                    <h2 class="product-title">{{ product.title }}</h2>
                    <p class="product-description">{{ product.little_description }}</p>
                    <div class="product-bottom">
                        <span class="product-price">{{ product.price}}&nbsp;€</span>
                        <button class="buy-button" @click="openBuyForm(product)">Acheter</button>
                    </div>
                </div>
            </div>

        </div>

    </div>



    <transition name="modal-fade">
        <div v-if="showForm" class="buy-form-modal">
            <transition name="modal-scale">
                <form v-if="showForm" class="buy-form" @submit.prevent="sendBuyRequest">
                    <h2>Formulaire d'achat</h2>
                    <p class="buy-explanation">
                        Les livres sont disponibles uniquement à la commande directe.<br><br>
                        Pour garantir une expérience personnalisée et un suivi de chaque demande, l'achat ne se fait pas
                        en ligne mais en contactant directement le photographe via ce formulaire.<br><br>
                        Merci de remplir vos informations, vous serez recontacté rapidement pour finaliser votre
                        commande !
                    </p>
                    <div>
                        <label for="buy-nom">Nom :</label>
                        <input id="buy-nom" v-model="buyNom" required />
                    </div>
                    <div>
                        <label for="buy-prenom">Prénom :</label>
                        <input id="buy-prenom" v-model="buyPrenom" required />
                    </div>
                    <div>
                        <label for="buy-email">Email :</label>
                        <input id="buy-email" v-model="buyEmail" type="email" required />
                    </div>
                    <div>
                        <label for="buy-quantite">Quantité :</label>
                        <input id="buy-quantite" v-model="buyQuantite" type="number" min="1" required />
                    </div>
                    <div>
                        <label for="buy-message">Message (optionnel) :</label>
                        <textarea id="buy-message" v-model="buyMessage" rows="2"></textarea>
                    </div>
                    <div class="buy-form-actions">
                        <button type="submit" class="buy-button2">Envoyer la demande</button>
                        <button type="button" class="buy-button2" @click="showForm = false">Annuler</button>
                    </div>
                    <div v-if="buyStatus" class="buy-status">{{ buyStatus }}</div>
                </form>
            </transition>
        </div>
    </transition>

</template>



<script setup lang="ts">

import { ref, watch, onMounted, onUnmounted } from 'vue';
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
const showForm = ref(false);
const buyNom = ref('');
const buyPrenom = ref('');
const buyEmail = ref('');
const buyQuantite = ref(1);
const buyMessage = ref('');
const buyStatus = ref('');
const selectedProduct = ref<any>(null)

const setBodyModalState = (active: boolean) => {
    if (active) {
        document.body.classList.add('modal-open');
    } else {
        document.body.classList.remove('modal-open');
    }
};

watch(showForm, (val) => {
    setBodyModalState(val);
});

const fetchProducts = async () => {
    const { data, error } = await supabase.from('products').select('*').order('id', { ascending: false })
    if (error) {
        console.error('Erreur lors de la récupération des produits:', error)
        return
    }
    products.value = data || []
}

onMounted(() => {
    setBodyModalState(showForm.value);
    fetchProducts()
});
onUnmounted(() => {
    setBodyModalState(false);
});
const openBuyForm = (product: any) => {
    selectedProduct.value = product
    showForm.value = true
}

const sendBuyRequest = async () => {
    if (!buyNom.value || !buyPrenom.value || !buyEmail.value || !buyQuantite.value) {
        buyStatus.value = 'Veuillez remplir tous les champs obligatoires.';
        return;
    }
    try {
        const response = await fetch('http://localhost:3001/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: buyNom.value,
                prenom: buyPrenom.value,
                email: buyEmail.value,
                quantite: buyQuantite.value,
                message: buyMessage.value,
                type: 'achat',
                productId: selectedProduct.value ? selectedProduct.value.id : null,
                productTitle: selectedProduct.value ? selectedProduct.value.title : null
            })
        });
        if (!response.ok) throw new Error("Erreur lors de l'envoi de la demande.");
        buyStatus.value = 'Demande envoyée avec succès !';
        buyNom.value = '';
        buyPrenom.value = '';
                buyEmail.value = '';
                buyQuantite.value = 1;
                buyMessage.value = '';
                setTimeout(() => { showForm.value = false; buyStatus.value = ''; }, 2000);
        } catch (error) {
                buyStatus.value = error instanceof Error ? error.message : 'Une erreur est survenue.';
        }
};

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
    font-size: 1.3rem;
    font-weight: bold;
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
    border: solid 1px rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    max-width: 500px;
    min-width: 300px;
    width: 40%;
}

.product-image {
    width: 100%;
    height: auto;
    border-radius: 12px;
    margin-bottom: 1rem;
}

.product-info {
    padding: 12px;
    color: #ffffff;
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 10px;
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
    color: #ffffff;
    text-align: left;

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
