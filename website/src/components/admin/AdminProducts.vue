<template>
  <div class="admin-products">
    <div class="content">
      <transition :name="slideDirection === 'forward' ? 'slide-horizontal' : 'slide-horizontal-reverse'" mode="out-in">
        <div v-if="!editingProductId" key="list" class="slide-content">
          <h1>Produits</h1>
          <div class="header-row">
            <router-link to="/create-product" class="create-product-btn">Créer un produit</router-link>
          </div>
          <div v-if="loading" class="loading">
            <span class="spinner"></span>
          </div>
          <template v-else>
            <div class="products-list">
              <div class="products-header">
                <div class="col col-header col-title">Nom</div>
                <div class="col col-header col-price">Prix</div>
                <div class="col col-header col-actions">Actions</div>
              </div>
              <div class="scroll">
                <div v-for="product in products" :key="product.id" class="product-row">
                  <div class="col col-title">{{ product.title }}</div>
                  <div class="col col-price">{{ product.price }} €</div>
                  <div class="col col-actions">
                    <button class="edit-btn" @click="editProduct(product.id)"><img src="/admin/pencil.png" alt=""></button>
                    <button class="delete-btn" @click="deleteProduct(product.id)"><img src="/admin/trash.png" alt=""></button>
                  </div>
                </div>
              </div>
              <div v-if="products.length === 0" class="empty">Aucun produit pour le moment.</div>
            </div>
          </template>
        </div>
        <div v-else key="edit" class="slide-content edit-content">
          <template v-if="selectedProduct">
            <AdminProduct :product="selectedProduct" @back="goBackToList" @saved="onProductSaved" />
          </template>
          <template v-else>
            <div style="color:red; padding:2em;">Erreur : produit introuvable (id={{ editingProductId }})<br>Produits chargés : {{ products.length }}</div>
          </template>
        </div>
      </transition>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { supabase } from '../../../supabase'
import AdminProduct from './AdminProduct.vue'

export interface ProductRow {
  id: number
  title: string
  price: number
  little_description: string
  big_description: string
  photo_url: string
}

const products = ref<ProductRow[]>([])
const loading = ref(true)

const editingProductId = ref<number | null>(null)
const slideDirection = ref<'forward' | 'back'>('forward')

const selectedProduct = computed(() => {
  return products.value.find(p => p.id === editingProductId.value) || null
})

const fetchProducts = async () => {
  loading.value = true
  const { data, error } = await supabase.from('products').select('*').order('id', { ascending: false })
  if (error) {
    console.error('Erreur lors de la récupération des produits:', error)
    loading.value = false
    return
  }
  products.value = data || []
  loading.value = false
}

const editProduct = (id: number) => {
  slideDirection.value = 'forward'
  editingProductId.value = id
}

const goBackToList = () => {
  slideDirection.value = 'back'
  editingProductId.value = null
}

const onProductSaved = async () => {
  await fetchProducts()
}

const deleteProduct = async (id: number) => {
  if (confirm('Voulez-vous vraiment supprimer ce produit ?')) {
    // Supprimer l'image du storage si besoin
    const product = products.value.find(p => p.id === id)
    if (product && product.photo_url) {
      // Extraire le chemin du fichier depuis l'URL publique
      const urlParts = product.photo_url.split('/products/')
      if (urlParts.length === 2) {
        await supabase.storage.from('products').remove([urlParts[1]])
      }
    }
    // Supprimer le produit de la table
    const { error: productError } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
    if (productError) {
      alert('Erreur suppression produit: ' + productError.message)
    }
  }
  await fetchProducts();
}

onMounted(() => {
  fetchProducts()
})
</script>

<style scoped>
.admin-products {
  display: block;
  width: 100%;
  height: 100%;
  position: relative;
  box-sizing: border-box;
}

h1 {
  height: 20%;
}

.content {
  display: block;
  position: relative;
  height: 100%;
  overflow: hidden;
}

.slide-content {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.edit-content {
  box-sizing: border-box;
}

.back-btn {
  margin-bottom: 20px;
  background: #222;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 8px 18px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.2s;
}

.back-btn:hover {
  background: #444;
}

.header-row {
  display: flex;
  justify-content: flex-end;
  height: 65px;
}

.create-product-btn {
  border: solid 1px rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  background-color: rgba(255, 255, 255, 0.2);
  color: #fff;
  border-radius: 5px;
  padding: 10px 24px;
  font-size: 1.1rem;
  text-decoration: none;
  cursor: pointer;
  transition: background 0.2s;
  font-weight: 500;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  margin-bottom: 10px;
}

.create-product-btn:hover {
  background: #888;
}

.products-list {
  display: block;
  box-sizing: border-box;
  width: 100%;
  max-height: calc(80% - 65px);
  color: #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
  font-size: 1.1rem;
  border: solid 1px rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  background-color: rgba(255, 255, 255, 0.1);
  overflow-y: auto;
}

.products-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.3);
  padding-top: 10px;
  padding-bottom: 10px;
  font-weight: 500;
}

.product-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: solid 1px rgba(255, 255, 255, 0.2);
  padding: 10px 0;
  transition: background 0.2s;
  font-weight: 300;
}

.col {
  display: flex;
  justify-content: left;
  width: 33%;
  box-sizing: border-box;
  padding: 5px 20px;
}

.edit-btn {
  background: #222;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.2s;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.edit-btn img {
  width: 100%;
}

.edit-btn:hover {
  background: #888;
}

.delete-btn {
  background: #ff4d4f;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 10px;
  transition: background 0.2s;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.delete-btn img {
  width: 100%;
}

.delete-btn:hover {
  background: #d9363e;
}

.empty {
  margin-top: 30px;
  color: #bcbcbc;
  text-align: center;
}

.loading {
  margin-top: 40px;
  color: #bcbcbc;
  text-align: center;
  font-size: 1.3rem;
  letter-spacing: 1px;
}

.spinner {
  display: inline-block;
  width: 48px;
  height: 48px;
  border: 5px solid #bcbcbc;
  border-top: 5px solid #5D5D5D;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
