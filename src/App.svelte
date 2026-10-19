<script lang="ts">
  import { onMount } from "svelte";
  let interactive = $state(false);
  onMount(() => {
    interactive = true;
  });
  const quotes = [
    "My code doesn't always work, but when it does, I don't know why.",
    "Claude rewrite my backend from scratch. Make no mistakes.",
    "Data Analyst by day, Debugger by night.",
    "Trying to find the perfect shade of dark green for the company's About page.",
    "Turning coffee into models since the last sprint.",
  ];
  let currentQuoteIndex: number = $state(0);
  const sections = [
    { id: "work", label: "Work" },
    { id: "about", label: "About" },
    { id: "journey", label: "Journey" },
    { id: "skills", label: "Skills" },
    { id: "contact", label: "Contact" },
  ] as const;
</script>

<a href="#content" class="skip-link">Skip to content</a>
<header class="site-header">
  <a class="brand" href="#intro">Rohan Jasani</a>
  <nav aria-label="Sections">
    {#each sections as section (section.id)}
      <a href={`#${section.id}`}>{section.label}</a>
    {/each}
  </nav>
</header>

<main id="content" tabindex="-1">
  <section id="intro" aria-labelledby="intro-title" class="hero">
    <div>
      <p class="eyebrow">
        Business Intelligence · Storytelling with Data · Analytics
      </p>
      <h1 id="intro-title">Rohan Jasani</h1>
      <p class="hero-subtitle">
        MBAN candidate — Data Analytics &amp; Visualization
      </p>
      <div class="actions">
        <a class="primary" href="#work">Browse selected work</a>
        <a href="#about">Read about my approach</a>
      </div>
    </div>
    <img
      src="headshot.jpeg"
      alt="Headshot of Rohan Jasani in suit, black and white"
      width="200"
      height="200"
    />
  </section>

  <section id="work" aria-labelledby="work-title">
    <h2 id="work-title">Selected work</h2>
    <div class="work-row">
      <span class="metadata">BAIT 518<br />Assignment 0</span>
      <div>
        <p>No case studies are published in this assignment portfolio yet.</p>
        <p>
          Interested in my work? <a href="mailto:jasani.rohan@gmail.com"
            >Get in touch by email</a
          >.
        </p>
      </div>
    </div>
  </section>
  <!-- Section 2: About Me -->
  <section id="about" aria-labelledby="about-title">
    <div class="content-container">
      <h2 id="about-title">About</h2>
      <div class="card">
        <p class="intro-text">
          I'm Rohan, an aspiring data storyteller currently pursuing my Master
          of Business Analytics. I love turning messy data into clear,
          actionable insights and creating visualizations that actually make
          people say "aha!" When I'm not diving into datasets, you'll find me
          exploring new analytical tools and techniques, always looking for
          better ways to communicate through data.
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
  <section id="journey" aria-labelledby="journey-title">
    <div class="content-container">
      <h2 id="journey-title">Journey</h2>
      <div class="timeline">
        <div class="timeline-item">
          <div class="timeline-content">
            <h3>Professional Experience</h3>
            <p>
              Built a strong foundation in business and analytics at Goldman
              Sachs, where I developed sharp analytical skills and crucial
              business acumen while navigating a fast-paced financial services
              environment.
            </p>
          </div>
        </div>
        <div class="timeline-item">
          <div class="timeline-content">
            <h3>Pursuing MBAN</h3>
            <p>
              I'm currently deepening my analytical capabilities through the
              Master of Business Analytics (MBAN) program. My focus is on data
              visualization, statistical modeling, and business intelligence.
            </p>
          </div>
        </div>
        <div class="timeline-item">
          <div class="timeline-content">
            <h3>Looking Ahead</h3>
            <p>
              I'm eager to apply my data analytics and visualization skills to
              tackle complex business challenges and spearhead truly
              data-informed decision-making.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Section 4: Skills & Tools -->
  <section id="skills" aria-labelledby="skills-title">
    <div class="content-container">
      <h2 id="skills-title">Skills</h2>
      <div class="skills-grid">
        <div class="skill-category">
          <h3>Analytics Tools</h3>
          <ul>
            <li>Tableau</li>
            <li>Excel & VBA</li>
            <li>Statistical Analysis</li>
            <li>Data Modeling</li>
          </ul>
        </div>
        <div class="skill-category">
          <h3>Technical Skills</h3>
          <ul>
            <li>Python</li>
            <li>SQL</li>
            <li>R</li>
            <li>Data Visualization</li>
          </ul>
        </div>
        <div class="skill-category">
          <h3>Business Acumen</h3>
          <ul>
            <li>Problem Solving</li>
            <li>Strategic Thinking</li>
            <li>Stakeholder Communication</li>
            <li>Project Management</li>
          </ul>
        </div>
        <div class="skill-category">
          <h3>Learning Goals</h3>
          <ul>
            <li>Advanced Data Visualization</li>
            <li>Dashboard Design</li>
            <li>Storytelling with Data</li>
            <li>Visual Analytics</li>
          </ul>
        </div>
      </div>
      <div class="footer-quote">
        <p class="quote">"{quotes[currentQuoteIndex]}"</p>
        <p class="quote-author">— Rohan Jasani</p>
        <button
          type="button"
          disabled={!interactive}
          onclick={() =>
            (currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length)}
          >Next quote</button
        >
      </div>
    </div>
  </section>
  <section id="contact" aria-labelledby="contact-title">
    <h2 id="contact-title">Contact</h2>
    <div class="actions">
      <a class="primary" href="mailto:jasani.rohan@gmail.com">Email me</a>
      <a
        href="https://www.linkedin.com/in/rohan-jasani-451a219b/"
        target="_blank"
        rel="noreferrer noopener">LinkedIn</a
      >
      <a
        href="rohan-jasani-resume.pdf"
        download="rohan-jasani-resume-incomplete.pdf"
        target="_blank"
        rel="noopener">Download resume</a
      >
    </div>
  </section>
</main>
<footer>Created for BAIT 518 — Assignment 0</footer>
