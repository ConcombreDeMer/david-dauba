<template>
    <div class="edit-product">
        <div class="header">
            <div class="header-left">
                <button class="back-btn" @click="emit('back')">←</button>
                <div class="title-edit">
                    <input v-if="editMode.title && editedProduct" v-model="editedProduct.title" class="title-input"
                        @input="onInput" @blur="editMode.title = false" />
                    <h1 v-else @click="startEdit('title')">{{ editedProduct ? editedProduct.title : '' }}</h1>
                </div>
            </div>
            <div class="open-product" v-if="editedProduct && editedProduct.id">
                <a :href="`/product/${editedProduct.id}`" target="_blank" rel="noopener">
                    <!-- <img src="/admin/sidebar/site/black.png" alt="Voir le produit" /> -->
                </a>
            </div>
        </div>
        <div v-if="editedProduct" class="details">
            <!-- Petite description -->
            <div class="case little-description">
                <div class="title-case">Petite description</div>
                <template v-if="editMode.little_description">
                    <textarea v-model="editedProduct.little_description" @input="onInput" rows="2" style="width:100%"
                        class="edit-area"></textarea>
                </template>
                <template v-else>
                    <div class="data">{{ editedProduct.little_description }}</div>
                </template>
                <button class="edit-btn" v-if="!editMode.little_description"
                    @click="startEdit('little_description')">✎</button>
            </div>
            <!-- Grande description -->
            <div class="case big-description">
                <div class="title-case">Grande description</div>
                <template v-if="editMode.big_description">
                    <textarea v-model="editedProduct.big_description" @input="onInput" rows="4" style="width:100%"
                        class="edit-area"></textarea>
                </template>
                <template v-else>
                    <div class="data">{{ editedProduct.big_description }}</div>
                </template>
                <button class="edit-btn" v-if="!editMode.big_description"
                    @click="startEdit('big_description')">✎</button>
            </div>
            <!-- Prix -->
            <div class="case price">
                <div class="title-case">Prix</div>
                <template v-if="editMode.price">
                    <input type="number" min="0" step="0.01" v-model.number="editedProduct.price" @input="onInput"
                        class="price-input" />
                </template>
                <template v-else>
                    <div class="data">{{ editedProduct.price }} €</div>
                </template>
                <button class="edit-btn" v-if="!editMode.price" @click="startEdit('price')">✎</button>
            </div>
            <!-- Image -->
            <div class="case photo">
                <div class="title-case">Image</div>
                <template v-if="editMode.photo_url">
                    <input type="file" accept="image/*" @change="onFileChange" />
                    <div v-if="previewUrl" class="photo-preview"><img :src="previewUrl" alt="Preview" /></div>
                    <button @click="savePhoto" :disabled="loading">Enregistrer l'image</button>
                    <button @click="cancelPhotoEdit">Annuler</button>
                </template>
                <template v-else>
                    <div class="photo-preview">
                        <img :src="editedProduct.photo_url" alt="Photo du produit" v-if="editedProduct.photo_url" />
                        <span v-else style="color:#bbb;">Aucune image</span>
                    </div>
                </template>
                <button class="edit-btn" v-if="!editMode.photo_url" @click="startEdit('photo_url')">✎</button>
            </div>
        </div>
        <div v-else>
            <p>Chargement du produit...</p>
            <pre style="color:red; background:#222; padding:1em; margin-top:1em;">
        props.product: {{ JSON.stringify(props.product, null, 2) }}
        editedProduct: {{ JSON.stringify(editedProduct, null, 2) }}
    </pre>
        </div>
        <div v-if="editedProduct" class="footer">
            <div v-if="errorMsg" style="color:red;">{{ errorMsg }}</div>
            <button @click="deleteProduct" :disabled="loading" class="delete-btn">Supprimer</button>
            <div class="right-buttons">
                <button class="cancel-btn" @click="cancelEdit" :disabled="!edited || loading">Annuler</button>
                <button class="save-btn" @click="saveEdit" :disabled="!edited || loading">Enregistrer les
                    modifications</button>
            </div>
            <transition name="toast-slide">
                <div v-if="showToast" class="toast-success">
                    {{ successMsg }}
                </div>
            </transition>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { supabase } from '../../../supabase'
import type { ProductRow } from './AdminProducts.vue'

const props = defineProps<{ product: ProductRow | null }>()
const emit = defineEmits(['back', 'saved'])

const editMode = ref<{ [key: string]: boolean }>({})
const edited = ref(false)
const editedProduct = ref<ProductRow | null>(null)
const loading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')
const showToast = ref(false)
const photoFile = ref<File | null>(null)
const previewUrl = ref<string | null>(null)

if (props.product) {
    editedProduct.value = { ...props.product }
}
watch(() => props.product, (newProduct) => {
    if (newProduct) {
        editedProduct.value = { ...newProduct }
        editMode.value = {}
        edited.value = false
        errorMsg.value = ''
        previewUrl.value = null
        photoFile.value = null
    }
})

const startEdit = (field: keyof ProductRow | 'photo_url') => {
    editMode.value[field] = true
}

// Désactive l'édition au blur (on garde le bouton pour sortir du mode edit)

const cancelEdit = () => {
    if (props.product) {
        editedProduct.value = { ...props.product }
        editMode.value = {}
        edited.value = false
        errorMsg.value = ''
        successMsg.value = ''
        showToast.value = false
        previewUrl.value = null
        photoFile.value = null
    }
}

const onInput = () => {
    if (!props.product || !editedProduct.value) return
    edited.value =
        props.product.title !== editedProduct.value.title ||
        props.product.little_description !== editedProduct.value.little_description ||
        props.product.big_description !== editedProduct.value.big_description ||
        props.product.price !== editedProduct.value.price
}

const onFileChange = (e: Event) => {
    const target = e.target as HTMLInputElement
    if (target.files && target.files[0]) {
        photoFile.value = target.files[0]
        previewUrl.value = URL.createObjectURL(target.files[0])
    }
}

const savePhoto = async () => {
    if (!photoFile.value || !editedProduct.value) return
    loading.value = true
    errorMsg.value = ''
    // Upload image to Supabase Storage
    const fileName = `${Date.now()}_${photoFile.value.name}`
    const { data: uploadData, error: uploadError } = await supabase.storage
        .from('products')
        .upload(fileName, photoFile.value, { upsert: true })
    if (uploadError) {
        errorMsg.value = "Erreur lors de l'upload de l'image : " + uploadError.message
        loading.value = false
        return
    }
    const photoUrl = supabase.storage.from('products').getPublicUrl(fileName).data.publicUrl
    // Update product in DB
    const { error } = await supabase.from('products').update({ photo_url: photoUrl }).eq('id', editedProduct.value.id)
    if (error) {
        errorMsg.value = "Erreur lors de la mise à jour de l'image : " + error.message
        loading.value = false
        return
    }
    editedProduct.value.photo_url = photoUrl
    previewUrl.value = null
    photoFile.value = null
    editMode.value.photo_url = false
    loading.value = false
    successMsg.value = "Image mise à jour !"
    showToast.value = true
    setTimeout(() => { showToast.value = false }, 3000)
    emit('saved')
}

const cancelPhotoEdit = () => {
    previewUrl.value = null
    photoFile.value = null
    editMode.value.photo_url = false
}

const saveEdit = async () => {
    if (!props.product || !editedProduct.value) return
    loading.value = true
    errorMsg.value = ''
    successMsg.value = ''
    showToast.value = false
    const updatePayload: any = {
        title: editedProduct.value.title,
        little_description: editedProduct.value.little_description,
        big_description: editedProduct.value.big_description,
        price: editedProduct.value.price
    }
    const { error } = await supabase
        .from('products')
        .update(updatePayload)
        .eq('id', props.product.id)
    loading.value = false
    if (error) {
        errorMsg.value = `Erreur lors de la sauvegarde : ${error.message}`
        return
    }
    editMode.value = {}
    edited.value = false
    successMsg.value = 'Modifications enregistrées.'
    showToast.value = true
    emit('saved')
    setTimeout(() => { showToast.value = false }, 5000)
}

const deleteProduct = async () => {
    if (!props.product || !editedProduct.value) return
    if (!confirm('Voulez-vous vraiment supprimer ce produit ? Cette action est irréversible.')) return
    loading.value = true
    errorMsg.value = ''
    // Supprimer l'image du storage si besoin
    if (editedProduct.value.photo_url) {
        const urlParts = editedProduct.value.photo_url.split('/products/')
        if (urlParts.length === 2) {
            await supabase.storage.from('products').remove([urlParts[1]])
        }
    }
    // Supprimer le produit de la table
    const { error: productError } = await supabase
        .from('products')
        .delete()
        .eq('id', props.product.id)
    loading.value = false
    if (productError) {
        errorMsg.value = `Erreur suppression produit: ${productError.message}`
        return
    }
    emit('saved')
    emit('back')
}
</script>

<style scoped>
/* Reprend la structure et les animations de AdminChapter.vue, adapté pour les produits */



.edit-product {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    margin: 0;
    padding: 0;
    margin-bottom: 20px;

    .back-btn {
        opacity: 0.6;
        display: block;
        background: rgb(255, 255, 255, 0.3);
        color: #fff;
        border-radius: 10px;
        cursor: pointer;
        font-size: 1rem;
        transition: background 0.2s;
        aspect-ratio: 1/1;
        width: 5vh;
        margin-top: 10px;
        border: solid 1px rgba(255, 255, 255, 0.2);
        box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
        font-size: 3vh;
    }

    .back-btn:hover {
        transition: all 0.2s ease-in-out;
        opacity: 1;
    }
}

.header-left {
    display: flex;
    align-items: center;
    gap: 20px;
    width: 80%;
}

.title-edit {
    flex: 1;
}

.title-input {
    font-size: 2.5rem;
    width: 100%;
    background: rgba(255, 255, 255, 0.1);
    border: solid 1px rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
    color: #fff;
    border-radius: 10px;
    padding: 10px 16px;
    font-family: inherit;
    font-weight: 600;
    outline: none;
    margin: 0;
    transition: border 0.2s, box-shadow 0.2s, background 0.2s;
    box-sizing: border-box;
}

.title-input:focus {
    border: solid 1.5px #fff;
    background: rgba(255, 255, 255, 0.18);
    box-shadow: 0 0 0 2px #00000033;
}

textarea {
    background: rgba(255, 255, 255, 0.1);
    border: solid 1px rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
    color: #fff;
    border-radius: 10px;
    padding: 10px;
    font-size: 1rem;
    font-family: inherit;
    box-sizing: border-box;
    width: 100%;
    height: calc(100% - 30px);
}

.price-input {
    background: rgba(255, 255, 255, 0.1);
    border: solid 1px rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.13);
    color: #fff;
    border-radius: 10px;
    padding: 10px;
    font-size: 1rem;
    font-family: inherit;
    width: 100%;
    box-sizing: border-box;
}

.details {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
    gap: 20px;
    overflow: hidden;
    box-sizing: border-box;
    flex: 1 1 0%;
    height: 100%;
    font-size: 1rem;
}

.case {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    padding: 10px;
    border: solid 1px rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
    font-weight: 300;
    position: relative;
    box-sizing: border-box;
}

.edit-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    background: rgba(255, 255, 255, 0.2);
    border: none;
    border-radius: 5px;
    padding: 5px 10px;
    cursor: pointer;
    font-size: 1rem;
    color: #fff;
    transition: background 0.2s;
}

.edit-btn:hover {
    background: rgba(255, 255, 255, 0.4);
}

.title-case {
    font-weight: 600;
    height: 30px;
}

.photo-preview {
    width: 120px;
    height: 120px;
    border-radius: 8px;
    overflow: hidden;
    background: #222;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.13);
    margin-top: 8px;
}

.photo-preview img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
    margin-top: 20px;
}

.right-buttons {
    display: flex;
    gap: 10px;

    .cancel-btn,
    .save-btn {
        border: none;
        border-radius: 5px;
        padding: 10px 20px;
        cursor: pointer;
        font-size: 1rem;
        transition: background 0.2s;
        border: solid 1px rgba(255, 255, 255, 0.2);
        box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
    }

    .save-btn {
        background: rgba(255, 255, 255, 0.874);
        color: black;
    }

    .cancel-btn {
        background: rgba(255, 255, 255, 0.2);
        color: #fff;
    }

    .cancel-btn:disabled,
    .save-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        background: rgb(255, 255, 255, 0.1);
        color: #ccc;
    }

    .cancel-btn:hover:not(:disabled) {
        background-color: rgb(255, 255, 255, 0.3);
        color: #fff;
    }

    .save-btn:hover:not(:disabled) {
        background-color: rgb(255, 255, 255, 1);
        color: black;
    }
}

.delete-btn {
    background: #ff4d4f;
    color: #fff;
    border: none;
    border-radius: 5px;
    padding: 10px 20px;
    cursor: pointer;
    font-size: 1rem;
    transition: all 0.2s ease-in-out;
    opacity: 0.7;
    border: solid 1px rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
}

.delete-btn:hover {
    opacity: 1;
    background: #d9363e;
}

.delete-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: #ffb3b3;
}

.toast-success {
    position: fixed;
    top: 30px;
    right: 30px;
    z-index: 9999;
    background: #2ecc40;
    color: #fff;
    padding: 18px 32px;
    border-radius: 8px;
    font-size: 1.1rem;
    box-shadow: 0 4px 24px 0 rgba(0, 0, 0, 0.18);
    min-width: 220px;
    max-width: 90vw;
    opacity: 0.98;
    pointer-events: none;
}

.toast-slide-enter-active {
    transition: all 0.5s cubic-bezier(.4, 2, .6, 1);
}

.toast-slide-leave-active {
    transition: all 0.5s cubic-bezier(.4, 2, .6, 1);
}

.toast-slide-enter-from {
    transform: translateX(120%);
    opacity: 0;
}

.toast-slide-enter-to {
    transform: translateX(0);
    opacity: 1;
}

.toast-slide-leave-from {
    transform: translateX(0);
    opacity: 1;
}

.toast-slide-leave-to {
    transform: translateX(120%);
    opacity: 0;
}

.data {
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
    height: calc(100% - 40px);

}
</style>
