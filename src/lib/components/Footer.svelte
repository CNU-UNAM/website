<script lang="ts">
  const currentYear = new Date().getFullYear();
  
  // Usamos una CDN de iconos simple y ligera para evitar dependencias locales
  const iconBase = "https://api.iconify.design/lucide";
</script>

<footer class="footer">
  <div class="container footer-grid">
    
    <div class="brand-section">
      <img src="/Centro_de_Negocios_Universitario.png" alt="CNU" class="footer-logo-small" />
      <div class="brand-text">
        <span class="acronym">CNU</span>
        <span class="full-name desktop-only">Comunidad de Negocios Universitarios</span>
      </div>
    </div>

    <nav class="footer-nav desktop-only">
      <a href="/proyectos">Proyectos</a>
      <a href="/nosotros">Nosotros</a>
      <a href="/vacantes">Vacantes</a>
    </nav>

    <div class="footer-actions">
      <div class="social-icons">
        <a href="mailto:unamcnu@gmail.com" title="Email" class="social-link">
          <img src="{iconBase}:mail.svg?color=%23666666" alt="Email" />
        </a>
        <a href="https://mx.linkedin.com/company/centro-de-negocios-universitario" target="_blank" title="LinkedIn" class="social-link">
          <img src="{iconBase}:linkedin.svg?color=%23666666" alt="LinkedIn" />
        </a>
        <a href="https://www.instagram.com/cnu_unam/" target="_blank" title="Instagram" class="social-link">
          <img src="{iconBase}:instagram.svg?color=%23666666" alt="Instagram" />
        </a>
        <a href="https://www.youtube.com/channel/UCVqdhM-kymF4I0-Gqwh8d9A" target="_blank" title="YouTube" class="social-link">
          <img src="{iconBase}:youtube.svg?color=%23666666" alt="YouTube" />
        </a>
      </div>
    </div>

  </div>

  <div class="footer-bottom">
    <div class="container bottom-inner">
      <span>© {currentYear} CNU</span>
      <span class="credits">Hecho por estudiantes para estudiantes 💙</span>
    </div>
  </div>
</footer>

<style>
  .footer {
    background: rgb(246, 243, 243);
    border-top: 1px solid var(--border-color);
    padding: 30px 0 0;
    margin-top: 60px;
  }

  .footer-grid {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 25px;
  }

  .brand-section {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .footer-logo-small {
    height: 28px;
    width: auto;
  }

  .acronym {
    font-weight: 800;
    font-size: 1.1rem;
    color: var(--foreground);
    line-height: 1;
  }

  .full-name {
    font-size: 0.75rem;
    color: var(--text-muted);
    margin-left: 8px;
  }

  .footer-nav {
    display: flex;
    gap: 24px;
  }

  .footer-nav a {
    text-decoration: none;
    color: var(--text-muted);
    font-size: 0.85rem;
    font-weight: 500;
    transition: color 0.2s;
  }

  .footer-nav a:hover {
    color: var(--cnu-coral);
  }

  /* Social Icons */
  .social-icons {
    display: flex;
    gap: 16px;
    align-items: center;
  }

  .social-link {
    display: flex;
    transition: transform 0.2s ease;
  }

  .social-link img {
    width: 20px;
    height: 20px;
  }

  .social-link:hover {
    transform: translateY(-2px);
  }

  /* Bottom Bar */
  .footer-bottom {
    border-top: 1px solid rgba(0,0,0,0.05);
    padding: 15px 0;
    font-size: 0.7rem;
    color: var(--text-muted);
  }

  .bottom-inner {
    display: flex;
    justify-content: space-between;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .footer-grid {
      flex-direction: column;
      gap: 20px;
    }

    .desktop-only {
      display: none;
    }

    .social-icons {
      gap: 24px; /* Más espacio para touch en móvil */
    }

    .bottom-inner {
      flex-direction: column;
      align-items: center;
      gap: 5px;
    }
  }
</style>