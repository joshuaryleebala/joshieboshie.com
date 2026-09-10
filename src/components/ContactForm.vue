<script setup lang="ts">
import { ref, reactive } from 'vue';

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: '',
});

const statusMessage = ref('');
const statusClass = ref<'success' | 'error' | ''>('');

function handleSubmit() {
  const mailtoLink = `mailto:joshuaryleebala@gmail.com?subject=${encodeURIComponent(
    form.subject
  )}&body=${encodeURIComponent(
    `Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`
  )}`;

  window.location.href = mailtoLink;

  statusMessage.value = 'Opening your email client...';
  statusClass.value = 'success';

  setTimeout(() => {
    form.name = '';
    form.email = '';
    form.subject = '';
    form.message = '';
    statusMessage.value = '';
    statusClass.value = '';
  }, 3000);
}
</script>

<template>
  <div class="contact-content">
    <div class="contact-info">
      <h3>Get in touch</h3>
      <p>Have a project in mind? Let's discuss how we can work together to bring your vision to life.</p>

      <div class="contact-details">
        <div class="contact-item">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
          <span>joshuaryleebala@gmail.com</span>
        </div>
      </div>
      <div class="contact-details">
        <div class="contact-item">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-label="Instagram"
            role="img"
          >
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
            <circle cx="12" cy="12" r="4"></circle>
            <circle cx="17.5" cy="6.5" r="1"></circle>
          </svg>
          <span>@joshieboshie_</span>
        </div>
      </div>
    </div>

    <form class="contact-form" @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="name">Name</label>
        <input type="text" id="name" name="name" v-model="form.name" required>
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" name="email" v-model="form.email" required>
      </div>

      <div class="form-group">
        <label for="subject">Subject</label>
        <input type="text" id="subject" name="subject" v-model="form.subject" required>
      </div>

      <div class="form-group">
        <label for="message">Message</label>
        <textarea id="message" name="message" rows="6" v-model="form.message" required></textarea>
      </div>

      <button type="submit" class="submit-button">Send Message</button>
      <div v-if="statusMessage" class="form-status" :class="statusClass">{{ statusMessage }}</div>
    </form>
  </div>
</template>
