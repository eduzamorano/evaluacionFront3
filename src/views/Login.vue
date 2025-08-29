<template>
  <div class="login-vuexy-container">
    <div class="login-vuexy-left">
      <img src="/logov1.jpeg" class="vuexy-logo" alt="Logo" />
      <div class="vuexy-cards">
        <div class="vuexy-card">
          <div class="vuexy-card-title">Profit</div>
          <div class="vuexy-card-sub">Last Month</div>
          <div class="vuexy-card-value">624k <span class="vuexy-card-green">+8.24%</span></div>
          <img src="https://dummyimage.com/120x40/ededed/aaa&text=Chart" class="vuexy-chart" />
        </div>
        <div class="vuexy-card">
          <div class="vuexy-card-title">Order</div>
          <div class="vuexy-card-sub">Last week</div>
          <div class="vuexy-card-value">124k <span class="vuexy-card-green">+12.6%</span></div>
          <img src="https://dummyimage.com/120x40/ededed/aaa&text=Chart" class="vuexy-chart" />
        </div>
      </div>
    </div>
    <div class="login-vuexy-right">
      <div class="vuexy-welcome">
        <h2>Bienvenido a KPO View </h2>
        <p>Por favor, ingresa tu usuario y contraseña para acceder al sistema</p>
        <div class="vuexy-demo-info">
          <div>Usuario: <b>usuario asignado</b> / Clave: <b>Tu password</b></div>
        </div>
      </div>
      <form class="vuexy-login-form" @submit.prevent="login">
        <div class="mb-3">
          <label>Usuario</label>
          <input v-model="usuario" type="text" class="form-control" required />
        </div>
        <div class="mb-3">
          <label>Password</label>
          <div class="input-group">
            <input v-model="password" :type="showPassword ? 'text' : 'password'" class="form-control" required />
            <span class="input-group-text" @click="showPassword = !showPassword" style="cursor:pointer;">
              <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </span>
          </div>
        </div>
        <div v-if="error" class="alert alert-danger mb-3">
          {{ error }}
        </div>
        <div class="d-flex justify-content-between align-items-center mb-3">
          <div>
            <input type="checkbox" v-model="remember" id="remember" />
            <label for="remember" class="ms-1">Remember me</label>
          </div>
          <a href="#" class="vuexy-link">Forgot Password?</a>
        </div>
        <button class="btn btn-vuexy w-100" type="submit" :disabled="loading">
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
      </form>
      <div class="vuexy-bottom-links">
        <span>Necesitas ayuda? <a href="#" class="vuexy-link">Comunicate con el administrador</a></span>

        <!-- Aquí puedes poner login social si lo deseas -->
      </div>
    </div>
  </div>
</template>

<script>
import { AuthService } from '../services/AuthService';

export default {
  name: 'LoginView',
  data() {
    return {
      usuario: '',
      password: '',
      showPassword: false,
      remember: false,
      loading: false,
      error: null
    }
  },
  methods: {
    async login() {
      this.loading = true;
      this.error = null;
      try {
        await AuthService.login(this.usuario, this.password);
        this.$router.push('/dashboard');
      } catch (err) {
        this.error = err.message || 'Error al iniciar sesión';
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>

<style scoped>
.login-vuexy-container {
  display: flex;
  min-height: 100vh;
  background: #f8fafd;
}
.login-vuexy-left {
  flex: 1.2;
  background: #f8fafd;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 2rem 0;
}
.vuexy-logo {
  width: 120px;
  margin-bottom: 2rem;
}
.vuexy-cards {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
}
.vuexy-card {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 12px 0 rgba(44,62,80,0.07);
  padding: 1.5rem 2rem;
  min-width: 180px;
  text-align: left;
}
.vuexy-card-title {
  font-weight: 600;
  color: #6c757d;
}
.vuexy-card-sub {
  font-size: 0.9rem;
  color: #b0b0b0;
}
.vuexy-card-value {
  font-size: 2rem;
  font-weight: 700;
  margin-top: 0.5rem;
}
.vuexy-card-green {
  color: #28c76f;
  font-size: 1rem;
  margin-left: 0.5rem;
}
.vuexy-chart {
  width: 100%;
  margin-top: 1rem;
}
.vuexy-character {
  width: 220px;
  margin-top: 2rem;
}
.login-vuexy-right {
  flex: 1;
  background: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 3rem 2rem;
  min-width: 400px;
  box-shadow: -2px 0 12px 0 rgba(44,62,80,0.04);
}
.vuexy-welcome h2 {
  font-weight: 700;
  margin-bottom: 0.5rem;
}
.vuexy-welcome p {
  color: #888;
  margin-bottom: 1rem;
}
.vuexy-demo-info {
  background: #f3f0ff;
  color: #7c3aed;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  margin-bottom: 2rem;
  font-size: 0.95rem;
}
.vuexy-login-form label {
  font-weight: 500;
  margin-bottom: 0.25rem;
}
.vuexy-login-form .form-control {
  border-radius: 8px;
  border: 1px solid #e3e6ea;
  margin-bottom: 0.5rem;
}
.btn-vuexy {
  background: #7367f0;
  color: #fff;
  border-radius: 8px;
  font-weight: 600;
  padding: 0.75rem 0;
  font-size: 1.1rem;
  border: none;
  transition: background 0.2s;
}
.btn-vuexy:hover {
  background: #5e50ee;
}
.vuexy-link {
  color: #7367f0;
  text-decoration: none;
  font-weight: 500;
}
.vuexy-link:hover {
  text-decoration: underline;
}
.vuexy-bottom-links {
  margin-top: 2rem;
  text-align: center;
  color: #888;
}
.vuexy-or {
  margin: 1rem 0;
  color: #bbb;
  font-size: 0.95rem;
}
.wave {
  font-size: 1.5rem;
}
@media (max-width: 900px) {
  .login-vuexy-container {
    flex-direction: column;
  }
  .login-vuexy-left {
    display: none !important;
  }
  .login-vuexy-right {
    min-width: unset;
    width: 100%;
    box-shadow: none;
    padding: 2rem 1rem;
    display: flex;
  }
}
</style>
