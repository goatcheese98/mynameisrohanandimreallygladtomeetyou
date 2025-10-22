<script>
  import { onMount } from 'svelte';
  import gsap from 'gsap';
  
  let sections = ['intro', 'about', 'journey', 'skills'];
  let currentSection = 0;
  let isAnimating = false;
  let prefersReducedMotion = false;
  let observer;
  
  const quotes = [
    "My code doesn't always work, but when it does, I don't know why.",
    "Claude rewrite my backend from scratch. Make no mistakes.",
    "Data Analyst by day, Debugger by night.",
    "Trying to find the perfect shade of dark green for the company's About page.",
    "Turning coffee into models since the last sprint."
  ];
  let currentQuoteIndex = 0;

  onMount(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotion = mq.matches;

    if (!prefersReducedMotion) {
      gsap.from('.hero-title', {
        duration: 1,
        y: 36,
        opacity: 0,
        ease: 'power3.out',
        delay: 0.15
      });

      gsap.from('.hero-subtitle', {
        duration: 0.9,
        y: 22,
        opacity: 0,
        ease: 'power3.out',
        delay: 0.25
      });

      gsap.from('.profile-image', {
        duration: 1.1,
        scale: 0.94,
        opacity: 0,
        ease: 'power3.out',
        delay: 0.2
      });

      // Gentle float
      gsap.to('.profile-image', {
        duration: 4,
        y: -8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    }

    // IntersectionObserver reveals
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

    // Observe sections to update active state
    const sectionEls = Array.from(document.querySelectorAll('section.section'));
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = sections.findIndex((id) => id === entry.target.id);
            if (idx !== -1) currentSection = idx;
          }
        });
      },
      { threshold: 0.55 }
    );
    sectionEls.forEach((el) => sectionObserver.observe(el));

    // Click ripple
    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.addEventListener('click', createRipple);
    }

    // Keyboard navigation
    const onKey = (e) => {
      if (isAnimating) return;
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        if (currentSection < sections.length - 1) scrollToSection(currentSection + 1);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        if (currentSection > 0) scrollToSection(currentSection - 1);
      } else if (e.key === 'Home') {
        scrollToSection(0);
      } else if (e.key === 'End') {
        scrollToSection(sections.length - 1);
      }
    };
    window.addEventListener('keydown', onKey);

    // Rotate quotes every 5 seconds
    const quoteInterval = setInterval(() => {
      currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
    }, 5000);

    return () => {
      if (mainElement) mainElement.removeEventListener('click', createRipple);
      window.removeEventListener('keydown', onKey);
      clearInterval(quoteInterval);
    };
  });

  function createRipple(e) {
    if (prefersReducedMotion) return;
    const ripple = document.createElement('div');
    ripple.className = 'click-ripple';
    
    const waterContainer = document.querySelector('.water-container');
    if (!waterContainer) return;
    
    waterContainer.appendChild(ripple);
    
    // Position ripple at click location
    const x = e.clientX;
    const y = e.clientY;
    
    gsap.set(ripple, {
      left: x,
      top: y,
      xPercent: -50,
      yPercent: -50
    });
    
    // Animate ripple
    gsap.to(ripple, {
      duration: 1.5,
      width: 400,
      height: 400,
      opacity: 0,
      ease: 'power2.out',
      onComplete: () => ripple.remove()
    });
  }

  function scrollToSection(index) {
    if (isAnimating) return;
    isAnimating = true;
    currentSection = index;
    
    const section = document.getElementById(sections[index]);
    section.scrollIntoView({ behavior: 'smooth' });
    
    setTimeout(() => {
      isAnimating = false;
    }, 1000);
  }

  // Removed explicit wheel handler to allow native scrolling (prevents jank)
</script>

<header class="site-header" aria-label="Primary">
  <div class="header-inner">
    <a class="brand" href="#intro" on:click|preventDefault={() => scrollToSection(0)} aria-label="Scroll to intro">
      <span class="brand-dot" aria-hidden="true"></span>
      <span class="brand-text">Rohan Jasani</span>
    </a>
    <nav class="header-nav" aria-label="Sections">
      {#each sections as sectionId, i}
        <a
          href={`#${sectionId}`}
          class="nav-link"
          aria-current={currentSection === i ? 'page' : undefined}
          on:click|preventDefault={() => scrollToSection(i)}
        >{sectionId}</a>
      {/each}
    </nav>
  </div>
  <a href="#content" class="skip-link">Skip to content</a>
</header>

<main id="content">
  <!-- Water ripple background -->
  <div class="water-container">
    <div class="wave wave1"></div>
    <div class="wave wave2"></div>
    <div class="wave wave3"></div>
    <div class="wave wave4"></div>
  </div>

  <!-- Gradient overlay for depth -->
  <div class="gradient-overlay"></div>

  <!-- Navigation dots -->
  <nav class="nav-dots">
    {#each sections as section, i}
      <button 
        class="dot {currentSection === i ? 'active' : ''}"
        on:click={() => scrollToSection(i)}
        aria-label={`Go to ${section} section`}
      ></button>
    {/each}
  </nav>

  <!-- Section 1: Hero/Intro -->
  <section id="intro" class="section">
    <div class="hero-content">
      <div class="profile-image-container reveal">
        <img src="headshot.jpeg" alt="Headshot of Rohan Jasani in suit, black and white" class="profile-image" />
      </div>
      <h1 class="hero-title">Rohan Jasani</h1>
      <p class="hero-subtitle">MBAN candidate — Data Analytics & Visualization</p>
      <div class="hero-chips reveal">
        <span class="chip">Business Intelligence</span>
        <span class="chip">Storytelling with Data</span>
        <span class="chip">Analytics</span>
      </div>
      <div class="hero-cta reveal">
        <a class="btn btn-primary" href="mailto:jasani.rohan@gmail.com">Email me</a>
        <a class="btn btn-secondary" href="https://www.linkedin.com/in/rohan-jasani-451a219b/" target="_blank" rel="noreferrer noopener">LinkedIn</a>
        <a class="btn" href="rohan-jasani-resume.pdf" download="rohan-jasani-resume-incomplete.pdf" target="_blank">Download resume</a>
      </div>
      <div class="scroll-indicator">
        <span>Scroll</span>
        <div class="scroll-arrow" aria-hidden="true">↓</div>
      </div>
    </div>
  </section>

  <!-- Section 2: About Me -->
  <section id="about" class="section">
    <div class="content-container">
      <h2 class="section-title">About</h2>
      <div class="card reveal">
        <p class="intro-text">
          I'm Rohan, an aspiring data storyteller currently pursuing my Master of Business Analytics. 
          I love turning messy data into clear, actionable insights and creating visualizations that actually 
          make people say "aha!" When I'm not diving into datasets, you'll find me exploring new analytical 
          tools and techniques, always looking for better ways to communicate through data.
        </p>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Program</span>
            <span class="info-value">Master of Business Analytics</span>
          </div>
          <div class="info-item">
            <span class="info-label">Focus Areas</span>
            <span class="info-value">Data Visualization, Analytics, BI</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Section 3: Journey -->
  <section id="journey" class="section">
    <div class="content-container">
      <h2 class="section-title">Journey</h2>
      <div class="timeline">
        <div class="timeline-item reveal">
          <div class="timeline-content">
            <h3>Professional Experience</h3>
            <p>Built a strong foundation in business and analytics at Goldman Sachs, where I developed sharp 
               analytical skills and crucial business acumen while navigating a fast-paced financial services environment.</p>
          </div>
        </div>
        <div class="timeline-item reveal">
          <div class="timeline-content">
            <h3>Pursuing MBAN</h3>
            <p>I'm currently deepening my analytical capabilities through the Master of Business Analytics (MBAN) program. 
               My focus is on data visualization, statistical modeling, and business intelligence.</p>
          </div>
        </div>
        <div class="timeline-item reveal">
          <div class="timeline-content">
            <h3>Looking Ahead</h3>
            <p>I'm eager to apply my data analytics and visualization skills to tackle complex business challenges 
               and spearhead truly data-informed decision-making.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Section 4: Skills & Tools -->
  <section id="skills" class="section">
    <div class="content-container">
      <h2 class="section-title">Skills</h2>
      <div class="skills-grid">
        <div class="skill-category reveal">
          <h3>Analytics Tools</h3>
          <ul>
            <li>Tableau</li>
            <li>Excel & VBA</li>
            <li>Statistical Analysis</li>
            <li>Data Modeling</li>
          </ul>
        </div>
        <div class="skill-category reveal">
          <h3>Technical Skills</h3>
          <ul>
            <li>Python</li>
            <li>SQL</li>
            <li>R</li>
            <li>Data Visualization</li>
          </ul>
        </div>
        <div class="skill-category reveal">
          <h3>Business Acumen</h3>
          <ul>
            <li>Problem Solving</li>
            <li>Strategic Thinking</li>
            <li>Stakeholder Communication</li>
            <li>Project Management</li>
          </ul>
        </div>
        <div class="skill-category reveal">
          <h3>Learning Goals</h3>
          <ul>
            <li>Advanced Data Visualization</li>
            <li>Dashboard Design</li>
            <li>Storytelling with Data</li>
            <li>Visual Analytics</li>
          </ul>
        </div>
      </div>
      <div class="footer-quote reveal">
        <p class="rotating-quote">"{quotes[currentQuoteIndex]}"</p>
        <p class="quote-author">— Rohan Jasani</p>
      </div>
    </div>
  </section>
</main>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    overflow-x: hidden;
  }

  .site-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1001;
    backdrop-filter: blur(12px);
    background: linear-gradient(180deg, rgba(0,0,0,0.7), rgba(0,0,0,0.3) 70%, transparent);
    border-bottom: 1px solid rgba(255,255,255,0.08);
  }

  .header-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.9rem 1.25rem;
    max-width: 1100px;
    margin: 0 auto;
  }

  .brand {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    text-decoration: none;
    color: #eef1f5;
    font-weight: 600;
    letter-spacing: -0.01em;
  }

  .brand-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: radial-gradient(40% 40% at 30% 30%, #fff, #b7ff62);
    box-shadow: 0 0 0 2px rgba(183,255,98,0.15);
  }

  .brand-text {
    font-feature-settings: "ss01" 1, "liga" 1;
  }

  .header-nav {
    display: flex;
    gap: 0.8rem;
  }

  .nav-link {
    text-transform: capitalize;
    color: #a7afbb;
    text-decoration: none;
    padding: 0.4rem 0.7rem;
    border-radius: 8px;
    border: 1px solid transparent;
    transition: color 0.18s ease-out, border-color 0.18s ease-out, background 0.18s ease-out;
  }

  .nav-link[aria-current="page"], .nav-link:hover {
    color: #eef1f5;
    background: rgba(255,255,255,0.05);
    border-color: rgba(255,255,255,0.1);
  }

  .skip-link {
    position: absolute;
    left: -9999px;
    top: auto;
  }
  .skip-link:focus {
    left: 1rem;
    top: 1rem;
    background: #151517;
    border: 1px solid rgba(255,255,255,0.1);
    padding: 0.5rem 0.75rem;
    border-radius: 8px;
    color: #eef1f5;
  }

  main {
    width: 100%;
    height: 100vh;
    overflow-y: scroll;
    scroll-snap-type: y proximity; /* less strict to reduce layout thrash */
    scroll-behavior: smooth;
  }

  .section {
    width: 100%;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    scroll-snap-align: start;
    position: relative;
    padding: 5.5rem 1.5rem 2rem;
    box-sizing: border-box;
    scroll-margin-top: 64px;
  }

  /* Background */
  .water-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
    overflow: hidden;
    background: radial-gradient(800px 600px at 10% 10%, rgba(109,208,255,0.06), transparent 60%);
  }

  .gradient-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(60% 50% at 50% 40%, transparent 40%, rgba(10,10,10,0.55) 100%);
    pointer-events: none;
    z-index: 2;
  }

  .wave {
    position: absolute;
    width: 200%;
    height: 200%;
    top: -50%;
    left: -50%;
    border-radius: 43%;
    opacity: 0.28;
  }

  .wave1 { background: radial-gradient(circle at 50% 50%, rgba(183,255,98,0.08) 0%, transparent 42%); animation: ripple1 16s infinite linear; will-change: transform; }
  .wave2 { background: radial-gradient(circle at 50% 50%, rgba(109,208,255,0.07) 0%, transparent 45%); animation: ripple2 22s infinite linear; animation-delay: -3s; will-change: transform; }
  .wave3 { background: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.04) 0%, transparent 50%); animation: ripple3 28s infinite linear; animation-delay: -6s; will-change: transform; }
  .wave4 { background: radial-gradient(circle at 50% 50%, rgba(183,255,98,0.05) 0%, transparent 55%); animation: ripple4 36s infinite linear; animation-delay: -9s; will-change: transform; }

  @keyframes ripple1 { 0% { transform: rotate(0deg) scale(1); } 100% { transform: rotate(360deg) scale(1.08); } }
  @keyframes ripple2 { 0% { transform: rotate(0deg) scale(1); } 100% { transform: rotate(-360deg) scale(1.1); } }
  @keyframes ripple3 { 0% { transform: rotate(0deg) scale(1); } 100% { transform: rotate(360deg) scale(1.06); } }
  @keyframes ripple4 { 0% { transform: rotate(0deg) scale(1); } 100% { transform: rotate(-360deg) scale(1.12); } }

  /* Click Ripple Effect */
  :global(.click-ripple) {
    position: absolute;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(183,255,98,0.35) 0%, rgba(109,208,255,0.25) 40%, transparent 65%);
    pointer-events: none;
    z-index: 3;
  }

  /* Navigation dots */
  .nav-dots {
    position: fixed;
    right: 1.25rem;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    z-index: 1000;
  }

  .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.22);
    border: 1px solid rgba(255,255,255,0.1);
    cursor: pointer;
    transition: transform 0.18s ease-out, background 0.18s ease-out;
    padding: 0;
  }

  .dot:hover {
    background: rgba(255, 255, 255, 0.5);
    transform: scale(1.2);
  }

  .dot.active {
    background: #fff;
    transform: scale(1.25);
  }

  /* Hero */
  .hero-content {
    text-align: center;
    z-index: 100;
    position: relative;
  }

  .profile-image-container { margin-bottom: 1.5rem; }
  .profile-image {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid rgba(255,255,255,0.9);
    box-shadow: 0 16px 48px rgba(0,0,0,0.4);
  }

  .hero-title {
    font-family: Georgia, serif;
    font-size: 3.5rem;
    font-weight: 700;
    margin: 0;
    letter-spacing: -0.02em;
    color: #fff;
    background: linear-gradient(135deg, #fff 0%, #cfd6df 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .hero-subtitle {
    font-size: 1.1rem;
    color: #a7afbb;
    margin-top: 0.75rem;
    font-weight: 400;
  }

  .hero-chips { display: flex; gap: 0.5rem; justify-content: center; margin-top: 1rem; flex-wrap: wrap; }
  .chip {
    font-size: 0.85rem;
    padding: 0.35rem 0.6rem;
    border-radius: 999px;
    color: #eef1f5;
    border: 1px solid rgba(255,255,255,0.1);
    background: rgba(255,255,255,0.05);
  }

  .hero-cta { margin-top: 1.25rem; }
  .btn { display: inline-block; text-decoration: none; border-radius: 999px; padding: 0.7rem 1rem; border: 1px solid rgba(255,255,255,0.15); color: #fff; font-weight: 500; }
  .btn-primary { background: linear-gradient(180deg, rgba(183,255,98,0.25), rgba(183,255,98,0.15)); color: #0a0a0a; border-color: rgba(183,255,98,0.3); }
  .btn-primary:hover { background: linear-gradient(180deg, rgba(183,255,98,0.35), rgba(183,255,98,0.25)); }
  .btn-secondary { background: linear-gradient(180deg, rgba(109,208,255,0.25), rgba(109,208,255,0.15)); color: #0a0a0a; margin-left: 0.5rem; border-color: rgba(109,208,255,0.3); }
  .btn-secondary:hover { background: linear-gradient(180deg, rgba(109,208,255,0.35), rgba(109,208,255,0.25)); }
  .btn + .btn { margin-left: 0.5rem; }

  .scroll-indicator { margin-top: 2rem; color: #a7afbb; font-size: 0.85rem; }
  .scroll-arrow { font-size: 1.6rem; animation: bounce 2.4s infinite; }
  @keyframes bounce { 0%, 20%, 50%, 80%, 100% { transform: translateY(0);} 40% { transform: translateY(-8px);} 60% { transform: translateY(-4px);} }

  /* Content sections */
  .content-container { max-width: 980px; width: 100%; z-index: 100; position: relative; }

  .section-title {
    font-size: 2.4rem;
    font-weight: 700;
    margin: 0 0 1.8rem 0;
    text-align: center;
    color: #fff;
    background: linear-gradient(135deg, #fff 0%, #d6dce4 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .reveal { opacity: 0; transform: translateY(12px); }
  /* svelte-ignore css-unused-selector */
  :global(.reveal.in-view) { opacity: 1; transform: none; transition: opacity 0.7s ease-out, transform 0.7s ease-out; }

  /* Card */
  .card {
    background: rgba(255,255,255,0.04);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 24px;
    padding: 2.25rem;
    box-shadow: 0 8px 24px rgba(0,0,0,0.35);
  }

  .intro-text { font-size: 1.05rem; line-height: 1.85; color: #eef1f5; opacity: 0.9; }

  .info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem; margin-top: 1.5rem; }
  .info-item { display: flex; flex-direction: column; gap: 0.35rem; }
  .info-label { font-size: 0.8rem; color: #a7afbb; text-transform: uppercase; letter-spacing: 0.08em; }
  .info-value { font-size: 1rem; color: #eef1f5; font-weight: 500; }

  /* Timeline */
  .timeline { position: relative; }
  .timeline-item { position: relative; margin-bottom: 1.5rem; }
  .timeline-content { background: rgba(255,255,255,0.04); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 1.6rem; transition: transform 0.25s ease-out, box-shadow 0.25s ease-out; }
  .timeline-content:hover { transform: translateX(4px); box-shadow: 0 8px 24px rgba(0,0,0,0.35); }
  .timeline-content h3 { font-size: 1.25rem; margin: 0 0 0.8rem 0; color: #eef1f5; }
  .timeline-content p { font-size: 1rem; line-height: 1.7; color: #a7afbb; margin: 0; }

  /* Skills */
  .skills-grid { 
    display: grid; 
    grid-template-columns: repeat(2, 1fr); 
    gap: 1.4rem; 
    margin-bottom: 2.4rem;
    max-width: 700px;
    margin-left: auto;
    margin-right: auto;
  }
  .skill-category { background: rgba(255,255,255,0.04); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 1.6rem; transition: transform 0.32s ease-out, box-shadow 0.32s ease-out; }
  .skill-category:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.35); }
  .skill-category h3 { font-size: 1.2rem; margin: 0 0 1rem 0; color: #eef1f5; }
  .skill-category ul { list-style: none; padding: 0; margin: 0; }
  .skill-category li { font-size: 0.98rem; color: #a7afbb; padding: 0.5rem 0; border-bottom: 1px solid rgba(255,255,255,0.08); }
  .skill-category li:last-child { border-bottom: none; }

  .footer-quote { 
    text-align: center; 
    padding: 2rem; 
    background: rgba(255,255,255,0.04); 
    backdrop-filter: blur(12px); 
    border: 1px solid rgba(255,255,255,0.1); 
    border-radius: 16px;
    min-height: 140px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .rotating-quote { 
    font-size: 1.3rem; 
    font-style: italic; 
    color: #eef1f5; 
    margin: 0.5rem 0;
    font-family: 'Courier New', 'Courier', monospace;
    animation: fadeInOut 5s ease-in-out infinite;
    line-height: 1.6;
  }
  
  @keyframes fadeInOut {
    0%, 100% { opacity: 0.85; }
    8%, 92% { opacity: 1; }
  }
  
  .quote-author { 
    font-size: 0.95rem !important; 
    color: #a7afbb !important; 
    font-style: normal !important; 
    margin-top: 1rem !important; 
    font-family: Georgia, serif;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .header-inner { padding: 0.8rem 1rem; }
    .header-nav { gap: 0.4rem; }
    .nav-link { padding: 0.35rem 0.55rem; }
    .section { padding-top: 5rem; }
    .hero-title { font-size: 2.4rem; }
    .hero-subtitle { font-size: 1rem; }
    .section-title { font-size: 1.8rem; }
    .card { padding: 1.4rem; }
    .nav-dots { right: 0.75rem; }
    .skills-grid { grid-template-columns: 1fr; max-width: 100%; }
    .rotating-quote { font-size: 1.1rem; }
  }
</style>
