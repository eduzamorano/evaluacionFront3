<template>
    <div class="mt-3 mt-md-4 dashboard-iframe-container">
      <iframe 
        title="STM Trade" 
        class="dashboard-iframe"
        src="https://app.powerbi.com/reportEmbed?reportId=1295db2a-8505-4ead-b216-a433f9697d90&autoAuth=true&ctid=5fe769e5-850d-4a15-bba0-87d397056ae3" 
        frameborder="0">
      </iframe>
    </div>
  
</template>



<style scoped>
.dashboard-bg {
  background: linear-gradient(120deg, #f8fafc 60%, #e2efd9 100%);
  min-height: 100vh;
}

.dashboard-card {
  width: 100%;
  max-width: 1200px;
  border-radius: 18px;
}

.stat-card {
  transition: box-shadow 0.2s;
}

.stat-card:hover {
  box-shadow: 0 4px 24px 0 rgba(44,62,80,0.10);
}

.dashboard-iframe-container {
  width: 100%;
  max-width: 1200px;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
}

.dashboard-iframe {
  width: 100%;
  height: 400px;
  border: none;
  border-radius: 12px;
}

/* Responsive breakpoints */
@media (min-width: 576px) {
  .dashboard-iframe {
    height: 450px;
  }
}

@media (min-width: 768px) {
  .dashboard-iframe {
    height: 500px;
  }
}

@media (min-width: 992px) {
  .dashboard-iframe {
    height: 541px;
  }
}

@media (min-width: 1200px) {
  .dashboard-iframe {
    height: 600px;
  }
}

/* Clases de utilidad para responsive */
.fs-md-3 {
  font-size: 1.75rem !important;
}

.fa-md-3x {
  font-size: 3em !important;
}

@media (max-width: 767.98px) {
  .fs-md-3 {
    font-size: 1.5rem !important;
  }
  
  .fa-md-3x {
    font-size: 2em !important;
  }
}
</style>

<script>export default { name: 'DashboardView' }</script>