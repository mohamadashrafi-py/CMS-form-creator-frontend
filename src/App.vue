<template>
  <div id="app" dir="rtl">
    <!-- Navigation Tabs -->
    <ul class="nav nav-pills nav-pills-bg-soft my-3 mx-3 px-3 nav-justified">
      <li class="nav-item ms-2 ms-sm-5" role="presentation">
        <button 
          class="nav-link mb-0" 
          :class="{ active: activeTab === 'form' }"
          @click="activeTab = 'form'"
        >
          فرم
        </button>
      </li>
      <li class="nav-item ms-2 ms-sm-5" role="presentation">
        <button 
          class="nav-link mb-0" 
          :class="{ active: activeTab === 'design' }"
          @click="activeTab = 'design'"
        >
          طراحی
        </button>
      </li>
      <li class="nav-item ms-2 ms-sm-5" role="presentation">
        <button 
          class="nav-link mb-0" 
          :class="{ active: activeTab === 'publish' }"
          @click="activeTab = 'publish'"
        >
          انتشار
        </button>
      </li>
    </ul>

    <!-- Tab Content -->
    <div class="tab-content">
      <!-- Form Tab -->
      <div v-if="activeTab === 'form'" class="tab-pane fade show active">
        <FormBuilder />
      </div>

      <!-- Design Tab -->
      <div v-if="activeTab === 'design'" class="tab-pane fade">
        <DesignSettings />
      </div>

      <!-- Publish Tab -->
      <div v-if="activeTab === 'publish'" class="tab-pane fade">
        <PublishSettings />
      </div>
    </div>
  </div>
</template>

<script>
import FormBuilder from './components/FormBuilder.vue'
import DesignSettings from './components/DesignSettings.vue'
import PublishSettings from './components/PublishSettings.vue'

export default {
  name: 'App',
  components: {
    FormBuilder,
    DesignSettings,
    PublishSettings
  },
  data() {
    return {
      activeTab: 'form'
    }
  }
}
</script>

<style>
:root {
  --primary-color: #673ab7;
  --secondary-color: #f5f5f5;
  --accent-color: #7c4dff;
}

body {
  background-color: #fafafa;
  font-family: Vazir, sans-serif;
}

.form-header {
  background-color: var(--primary-color);
  color: white;
  border-radius: 8px 8px 0 0;
}

</style>