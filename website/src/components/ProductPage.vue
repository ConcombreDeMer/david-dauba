<template>
    <div v-if="product" class="product-page">
        <div class="product-page-content">
            <img :src="product.photo_url || '/book.jpg'" :alt="product.title" class="product-image" />
            <div class="product-info">
                <div class="product-top">
                    <h1 class="product-title">{{ product.title }}</h1>
                    <p class="product-description">{{ product.big_description }}</p>
                </div>
                <div class="product-bottom">
                    <span class="product-price">{{ product.price }} €</span>
                    <button class="buy-button" @click="openBuyForm">Acheter</button>
                </div>
            </div>
        </div>
    </div>
    <div v-else>
        <p>Produit introuvable.</p>
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
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { supabase } from '../../supabase';

const route = useRoute();
const product = ref<any>(null);
const loading = ref(true);

const showForm = ref(false);
const buyNom = ref('');
const buyPrenom = ref('');
const buyEmail = ref('');
const buyQuantite = ref(1);
const buyMessage = ref('');
const buyStatus = ref('');

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

const fetchProduct = async (id: number) => {
    const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
    if (error) {
        console.error('Erreur lors de la récupération du produit:', error);
        product.value = null;
    } else {
        product.value = data;
    }
    loading.value = false;
};

onMounted(() => {
    const id = Number(route.params.id);
    fetchProduct(id);
    setBodyModalState(showForm.value);
});

const openBuyForm = () => {
    showForm.value = true;
};

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
                productId: product.value ? product.value.id : null,
                productTitle: product.value ? product.value.title : null
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
/* ...existing code... */

.product-page {
    width: 100%;
    margin-top: 200px;
    position: relative;
    margin-left: auto;
    margin-right: auto;
    max-width: 1200px;
}

.product-page-content {
    display: flex;
    flex-direction: row;
    gap: 50px;
    height: 60vh;
}


.product-image {
    width: 40%;
    height: 100%;
    object-fit: cover;
    border-radius: 5px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.product-info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    color: #fff;
    text-align: left;
    height: 100%;
    width: 60%;
}

.product-top {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.product-title {
    font-size: 4rem;
    font-weight: 600;
    font-family: 'Roboto', sans-serif;
    margin: 0;
    padding: 0;
}

.product-description {
    font-size: 1.2rem;
    font-weight: 300;
    color: #c9c9c9;
}

.product-bottom {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
}

.product-price {
    font-size: 2rem;
    color: #ffffff;
    margin-right: 1.5rem;
}

.buy-button {
    background: #ffffff;
    color: #1f1f1f;
    border: none;
    border-radius: 50px;
    padding: 10px 30px;
    font-size: 1.3rem;
    font-weight: 300;
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


@media (max-width: 900px) {
    .product-page {
        margin-top: 100px;
    }

    .product-page-content {
        display: flex;
        height: auto;
        align-items: center;
        flex-direction: column;
        padding: 20px;
        box-sizing: border-box;
        gap: 20px;
    }

    .product-image {
        width: 100%;
        margin: 0;
        padding: 0;
        object-fit: cover;
    }

    .product-info {
        width: 100%;
        height: auto;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .product-title {
        font-size: 2.2rem;
        margin: 0;
        padding: 0;
    }

    .product-description {
        font-size: 1rem;
        margin: 0;
        padding: 0;
    }

    .product-bottom {
        flex-direction: column;
        align-items: flex-start;
        gap: 30px;
    }

    .product-price {
        font-size: 1.5rem;
        margin-right: 0;
    }

    .buy-button {
        width: 100%;
        font-size: 1.1rem;
        padding: 10px 0;
    }

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
        box-shadow: 0 -2px 16px 0 rgba(0, 0, 0, 0.18);
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
</style>
