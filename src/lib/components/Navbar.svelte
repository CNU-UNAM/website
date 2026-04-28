<!-- Navbar.svelte -->
<script lang="ts">
  import { goto } from '$app/navigation';

  let isMenuOpen = false;

  const toggleMenu = (): void => {
    isMenuOpen = !isMenuOpen;
  };

  const closeMenu = (): void => {
    isMenuOpen = false;
  };

  const handleNavigation = (path: string): void => {
    closeMenu();
    goto(path);
  };
</script>

<header class="navbar">
  <!-- Logo con navegación -->
  <a href="/" class="logo" on:click|preventDefault={() => handleNavigation('/')}>
    <img
      src="/Centro_de_Negocios_Universitario.png"
      alt="Centro de Negocios Universitario"
      width="50"
      height="50"
      class="logoImage"
    />
  </a>

  <!-- Botón Hamburguesa -->
  <button
    class="hamburger"
    class:hamburgerActive={isMenuOpen}
    on:click={toggleMenu}
    aria-label="Toggle menu"
    aria-expanded={isMenuOpen}
  >
    <span class="hamburgerLine"></span>
    <span class="hamburgerLine"></span>
    <span class="hamburgerLine"></span>
  </button>

  <!-- Menú de navegación -->
  <nav class="nav" class:navOpen={isMenuOpen}>
    <a
      href="/proyectos"
      class="navLink"
      on:click|preventDefault={() => handleNavigation('/proyectos')}
    >
      Proyectos
    </a>
    <a
      href="/nosotros"
      class="navLink"
      on:click|preventDefault={() => handleNavigation('/nosotros')}
    >
      Nosotros
    </a>
    <a
      href="/participa"
      class="navLink"
      on:click|preventDefault={() => handleNavigation('/vacantes')}
    >Participa</a>
    <a
      href="/faq"
      class="navLink"
      on:click|preventDefault={() => handleNavigation('/faq')}
    >
      FAQ
    </a>
    <a
      href="/login"
      class="navLink specialButton"
      on:click|preventDefault={() => handleNavigation('/login')}
    >
      <span class="specialButtonLabel">Únete al Equipo</span>
    </a>
  </nav>

  <!-- Overlay para móvil -->
  {#if isMenuOpen}
    <div
      class="overlay"
      on:click={closeMenu}
      aria-hidden="true"
    ></div>
  {/if}
</header>

<style>
  /* Estilos específicos del componente */

  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 40px;
    background: rgb(246, 243, 243);
    border-bottom: 1px solid var(--border-color);
    position: sticky;
    top: 0;
    z-index: 100;
    backdrop-filter: blur(10px);
    isolation: isolate;
    flex-wrap: nowrap;
  }

  .logo {
    font-weight: bold;
    font-size: 24px;
    color: var(--action-blue);
    letter-spacing: -0.5px;
    display: flex;
    align-items: center;
    z-index: 102;
    cursor: pointer;
    transition: opacity 0.2s ease;
    flex-shrink: 0;
    width: auto;
    line-height: 0;
  }

  .logo:hover {
    opacity: 0.8;
  }

  .logoImage {
    width: auto;
    height: 50px;
    object-fit: contain;
    display: block;
  }

  .nav {
    display: flex;
    gap: 32px;
    align-items: center;
    flex-shrink: 0;
  }

  .navLink {
    font-size: 14px;
    color: var(--foreground);
    font-weight: 500;
    transition: all 0.3s ease;
    position: relative;
    padding: 8px 12px;
    border-radius: 8px;
    text-decoration: none;
    white-space: nowrap;
  }

  .navLink:hover {
    color: var(--foreground);
    background-color: rgba(240, 143, 153, 0.12);
    opacity: 1;
  }

  .navLink::after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    bottom: 4px;
    left: 50%;
    transform: translateX(-50%);
    background-color: var(--cnu-coral);
    transition: width 0.3s ease;
    border-radius: 2px;
  }

  .navLink:hover::after {
    width: 60%;
  }

  /* Special Button - Únete al Equipo (con alta especificidad) */
  .navbar .navLink.specialButton {
    background-color: var(--action-blue) !important;
    background-image: linear-gradient(135deg, var(--action-blue) 0%, #355789 100%) !important;
    color: white !important;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    position: relative;
    overflow: hidden;
    isolation: isolate;
    animation: gentlePulse 2s ease-in-out infinite;
    border: none; /* Por si algún estilo global añade borde */
    box-shadow:
      inset 0 0 0 999px rgba(37, 64, 107, 0.9),
      0 2px 8px rgba(37, 64, 107, 0.3);
    backface-visibility: hidden;
    will-change: opacity, box-shadow;
  }

  .navbar .navLink.specialButton::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      linear-gradient(135deg, var(--action-blue) 0%, #355789 100%);
    z-index: 0;
    pointer-events: none;
  }

  .navbar .navLink.specialButton::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(45deg,
            transparent 30%,
            rgba(255, 255, 255, 0.3) 50%,
            transparent 70%);
    animation: shimmer 3s ease-in-out infinite;
    z-index: 1;
    pointer-events: none;
    will-change: transform;
  }

  .navbar .navLink.specialButton:hover {
    transform: translateY(-2px);
    box-shadow:
      inset 0 0 0 999px rgba(26, 46, 79, 0.92),
      0 4px 12px rgba(37, 64, 107, 0.4);
  }

  .navbar .navLink.specialButton:hover::before {
    background:
      linear-gradient(135deg, #1a2e4f 0%, var(--action-blue) 100%);
  }

  .specialButtonLabel {
    position: relative;
    z-index: 2;
  }

  /* Hamburguesa */
  .hamburger {
    display: none;
    flex-direction: column;
    gap: 5px;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 8px;
    z-index: 102;
    transition: transform 0.3s ease;
  }

  .hamburger:hover {
    transform: scale(1.1);
  }

  .hamburgerLine {
    width: 25px;
    height: 3px;
    background-color: var(--action-blue);
    border-radius: 3px;
    transition: all 0.3s ease;
  }

  .hamburgerActive .hamburgerLine:nth-child(1) {
    transform: translateY(8px) rotate(45deg);
  }

  .hamburgerActive .hamburgerLine:nth-child(2) {
    opacity: 0;
    transform: translateX(-20px);
  }

  .hamburgerActive .hamburgerLine:nth-child(3) {
    transform: translateY(-8px) rotate(-45deg);
  }

  .overlay {
    display: none;
  }

  /* Móvil */
  @media (max-width: 768px) {
    .navbar {
      padding: 16px 20px;
      position: relative;
    }

    .logoImage {
      height: 40px;
    }

    .hamburger {
      display: flex;
      position: absolute;
      right: 20px;
      top: 0;
      bottom: 0;
      margin: auto;
    }

    .nav {
      position: fixed;
      top: 0;
      right: 0;
      transform: translateX(100%);
      width: 280px;
      height: 100vh;
      flex-direction: column;
      gap: 0;
      background: rgb(246, 243, 243);
      box-shadow: -4px 0 20px rgba(0, 0, 0, 0.1);
      padding: 80px 30px 30px;
      transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55), visibility 0s 0.4s;
      z-index: 101;
      align-items: flex-start;
      visibility: hidden;
      pointer-events: none;
    }

    .navOpen {
      transform: translateX(0);
      visibility: visible;
      pointer-events: auto;
      transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55), visibility 0s;
    }

    .navLink {
      font-size: 16px;
      padding: 16px 12px;
      width: 100%;
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
      opacity: 0;
      animation: fadeInSlide 0.4s ease forwards;
      border-radius: 8px;
      white-space: normal;
    }

    .navLink:active {
      background-color: rgba(255, 131, 125, 0.15);
    }

    .navOpen .navLink:nth-child(1) {
      animation-delay: 0.1s;
    }
    .navOpen .navLink:nth-child(2) {
      animation-delay: 0.2s;
    }
    .navOpen .navLink:nth-child(3) {
      animation-delay: 0.3s;
    }
    .navOpen .navLink:nth-child(4) {
      animation-delay: 0.4s;
    }

    .navLink::after {
      bottom: 12px;
    }

    .overlay {
      display: block;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100vh;
      background: rgba(0, 0, 0, 0.5);
      z-index: 99;
      animation: fadeIn 0.3s ease;
    }
  }

  @media (max-width: 480px) {
    .navbar {
      padding: 12px 16px;
    }

    .logoImage {
      height: 35px;
    }

    .nav {
      width: 260px;
      padding: 70px 25px 25px;
    }

    .hamburger {
      right: 16px;
    }

    .hamburgerLine {
      width: 22px;
      height: 2.5px;
    }
  }

  @keyframes fadeInSlide {
    from {
      opacity: 0;
      transform: translateX(20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes gentlePulse {
    0%, 100% {
      opacity: 1;
      box-shadow:
        inset 0 0 0 999px rgba(255, 131, 125, 0.9),
        0 2px 8px rgba(255, 131, 125, 0.3);
    }
    50% {
      opacity: 0.96;
      box-shadow:
        inset 0 0 0 999px rgba(255, 131, 125, 0.9),
        0 4px 16px rgba(255, 131, 125, 0.5);
    }
  }

  @keyframes shimmer {
    0% {
      transform: translateX(-100%) translateY(-100%) rotate(45deg);
    }
    100% {
      transform: translateX(100%) translateY(100%) rotate(45deg);
    }
  }


  
</style>
