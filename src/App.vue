<template>
  <div id="app" dir="rtl">
    <!-- Navigation Tabs -->
    <div class="nav-container">
      <ul class="nav nav-pills nav-pills-bg-soft my-3 mx-3 px-3 nav-justified">
        <li class="nav-item ms-2 ms-sm-5" role="presentation">
          <button 
            class="nav-link mb-0" 
            :class="{ active: activeTab === 'form' }"
            @click="setActiveTab('form')"
          >
            فرم
          </button>
        </li>
        <li class="nav-item ms-2 ms-sm-5" role="presentation">
          <button 
            class="nav-link mb-0" 
            :class="{ active: activeTab === 'design' }"
            @click="setActiveTab('design')"
          >
            طراحی
          </button>
        </li>
        <li class="nav-item ms-2 ms-sm-5" role="presentation">
          <button 
            class="nav-link mb-0" 
            :class="{ active: activeTab === 'publish' }"
            @click="setActiveTab('publish')"
          >
            انتشار
          </button>
        </li>
      </ul>
    </div>

    <!-- Tab Content -->
    <div class="tab-content">
      <!-- Form Tab -->
      <div v-show="activeTab === 'form'" class="tab-pane fade" :class="{ 'show active': activeTab === 'form' }">
        <FormBuilder />
      </div>

      <!-- Design Tab -->
      <div v-show="activeTab === 'design'" class="tab-pane fade" :class="{ 'show active': activeTab === 'design' }">
        <DesignSettings />
      </div>

      <!-- Publish Tab -->
      <div v-show="activeTab === 'publish'" class="tab-pane fade" :class="{ 'show active': activeTab === 'publish' }">
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
  },
  methods: {
    setActiveTab(tab) {
      this.activeTab = tab;
    }
  },
  mounted() {
    console.log('App mounted with components:', Object.keys(this.$options.components));
  }
}
</script>

<style>
/* Basic reset and styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Vazir, Tahoma, Arial, sans-serif;
  background-color: #fafafa;
  color: #333;
}

#app {
  min-height: 100vh;
}

.nav-container {
  background-color: #f8f9fa;
  border-radius: 8px;
  margin: 10px;
}

.nav-pills {
  padding: 10px 0;
}

.nav-link {
  cursor: pointer;
  padding: 10px 20px;
  border-radius: 20px;
  color: #495057;
  transition: all 0.3s ease;
  border: none;
  background: transparent;
}

.nav-link.active {
  background-color: #673ab7;
  color: white;
}

.nav-link:hover:not(.active) {
  background-color: #e9ecef;
}

.tab-content {
  padding: 20px;
}

.tab-pane {
  min-height: 500px;
}
</style>