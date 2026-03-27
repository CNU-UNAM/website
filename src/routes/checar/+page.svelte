<script lang="ts">
  import { userStore } from '$lib/stores/session';
</script>

<h1>Verificador de sesión</h1>

{#if $userStore.loading}
  <p>Cargando...</p>
{:else if $userStore.error}
  <p style="color: red;">Error: {$userStore.error}</p>
{:else if $userStore.user}
  <div style="border: 1px solid green; padding: 1rem;">
    <h2 style="color: green;">✅ Sesión activa</h2>
    <p><strong>Usuario ID:</strong> {$userStore.user.id}</p>
    <p><strong>Email:</strong> {$userStore.user.email}</p>
    <p><strong>Nombre:</strong> {$userStore.user.name}</p>
    <p><strong>Equipo:</strong> {$userStore.user.team ?? 'No asignado'}</p>
    <p><strong>Tipo de usuario:</strong> {$userStore.user.usertype}</p>
    <p><strong>Access level:</strong> {$userStore.user.access}</p>
    <p><strong>Emoji:</strong> {$userStore.user.emoji}</p>
    <p><strong>Miembro desde:</strong> {new Date($userStore.user.created_at).toLocaleDateString()}</p>
    
    <details>
      <summary>Ver todos los datos</summary>
      <pre>{JSON.stringify($userStore.user, null, 2)}</pre>
    </details>
  </div>
{:else}
  <div style="border: 1px solid red; padding: 1rem;">
    <h2 style="color: red;">❌ No hay sesión activa</h2>
    <p>Por favor <a href="/login">inicia sesión</a>.</p>
  </div>
{/if}