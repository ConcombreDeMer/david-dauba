<template>

  <div class="contact-container">
    <h1 class="contact-title">Contact</h1>
    <form @submit.prevent="sendMessage">
      <div>
        <label for="name">Nom :</label>
        <input id="name" v-model="name" required />
      </div>
      <div>
        <label for="email">Email :</label>
        <input id="email" v-model="email" type="email" required />
      </div>
      <div>
        <label for="message">Message :</label>
        <textarea id="message" v-model="message" required ref="messageTextarea" @input="autoResize" rows="1"
          style="overflow:hidden;resize:none;"></textarea>
      </div>
      <button class="create-chapter-button" type="submit">Envoyer</button>
      <div v-if="status">{{ status }}</div>
    </form>
  </div>


</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue'

const name = ref('')
const email = ref('')
const message = ref('')
const status = ref('')
const messageTextarea = ref<HTMLTextAreaElement | null>(null)

const autoResize = () => {
  const el = messageTextarea.value
  if (el) {
    el.style.height = 'auto'
    el.style.height = el.scrollHeight + 'px'
  }
}

onMounted(() => {
  autoResize()
})

const sendMessage = async () => {
  if (!name.value || !email.value || !message.value) {
    status.value = 'Veuillez remplir tous les champs.'
    return
  }

  try {
    const response = await fetch('http://localhost:3001/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: name.value, email: email.value, message: message.value })
    })

    if (!response.ok) {
      throw new Error('Erreur lors de l\'envoi du message.')
    }

    status.value = 'Message envoyé avec succès !'
    name.value = ''
    email.value = ''
    message.value = ''
  } catch (error) {
    if (error instanceof Error) {
      status.value = error.message
    } else {
      status.value = 'Une erreur est survenue.'
    }
  }
}


</script>

<style scoped>
.contact-title {
  text-align: center;
  padding-top: 200px;
}

form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 50px;
  margin-top: 50px;
  margin-bottom: 100px;
}

form div {
  width: 50vw;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

input,
textarea {
  width: 95%;
  margin-left: auto;
  margin-right: auto;
  background: transparent;
  border: none;
  border-bottom: 1px solid #646464;
  outline: none;
  color: inherit;
  font-size: 1.5rem;
  font-family: inherit;
  font-weight: 300;
  padding: 8px 0 4px 0;
  margin-top: 4px;
  transition: border-color 0.2s;
}

input:focus,
textarea:focus {
  border-bottom: 1px solid #ffffff;
}

label {
  font-weight: normal;
  margin-bottom: 2px;
  font-size: 2rem;
}

button[type="submit"] {
  margin-top: 16px;
  padding: 10px 32px;
  border: none;
  border-radius: 4px;
  background: #4E4E4E;
  color: #fff;
  font-size: 2rem;
  font-family: inherit;
  font-weight: lighter;
  cursor: pointer;
  transition: background 0.2s;
  width: 50vw;
  height: 70px;
}

button[type="submit"]:hover {
  background: #0056b3;
}

@media (max-width: 900px) {

  .contact-title {
    padding-top: 100px;
    font-size: 6vh;
  }

  form {
    width: 90vw;
    margin-left: auto;
    margin-right: auto;

    div{
      width: 100%;
    }
  }

  input,
  textarea {
    width: 100%;
    border-radius: 0px;
  }

  label {
    font-size: 3vh;
  }

  button[type="submit"] {
    width: 100%;
    height: auto;
    padding: 10px;
    font-size: 3vh;
  }

}
</style>
