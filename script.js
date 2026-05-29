/* ========================================
   福岡水道設備 HP — script.js
   ======================================== */

/* ---------- Hero 押し出しスライダー ---------- */
(function () {
  const slides     = document.querySelectorAll('.hero-slide');
  const indicators = document.querySelectorAll('.indicator');
  const btnPrev    = document.querySelector('.hero-arrow-prev');
  const btnNext    = document.querySelector('.hero-arrow-next');

  const total = slides.length;
  let current = 0;
  let animating = false;
  let timer;

  // 初期状態：最初の1枚だけ表示
  slides[0].classList.add('active');

  function goTo(index) {
    if (animating) return;
    animating = true;

    const nextIndex = (index + total) % total;
    const currentSlide = slides[current];
    const nextSlide = slides[nextIndex];

    // 次のスライドを右から入れる準備（transitionなしで位置セット）
    nextSlide.style.transition = 'none';
    nextSlide.style.transform = 'translateX(100%)';
    nextSlide.style.zIndex = 3;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // アニメーション開始
        nextSlide.style.transition = 'transform 1.2s cubic-bezier(0.77, 0, 0.18, 1)';
        nextSlide.style.transform = 'translateX(0%)';

        // 現在のスライドを左に押し出す
        currentSlide.style.transition = 'transform 1.2s cubic-bezier(0.77, 0, 0.18, 1)';
        currentSlide.style.transform = 'translateX(-30%)';
      });
    });

    setTimeout(() => {
      // クリーンアップ
      currentSlide.style.transition = 'none';
      currentSlide.style.transform = 'translateX(100%)';
      currentSlide.style.zIndex = 1;
      nextSlide.style.zIndex = 2;

      indicators[current].classList.remove('active');
      current = nextIndex;
      indicators[current].classList.add('active');
      animating = false;
    }, 1300);
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startTimer() { timer = setInterval(next, 5000); }
  function resetTimer() { clearInterval(timer); startTimer(); }

  btnNext.addEventListener('click', () => { next(); resetTimer(); });
  btnPrev.addEventListener('click', () => { prev(); resetTimer(); });

  indicators.forEach((dot, i) => {
    dot.addEventListener('click', () => { goTo(i); resetTimer(); });
  });

  let touchStartX = 0;
  const heroEl = document.querySelector('.hero');

  heroEl.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  heroEl.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      diff > 0 ? next() : prev();
      resetTimer();
    }
  }, { passive: true });

  startTimer();
})();


/* ---------- スクロール フェードイン ---------- */
(function () {
  const targets = document.querySelectorAll('.fade-in');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -30px 0px'
  });

  targets.forEach((el) => observer.observe(el));
})();


/* ---------- アンカーリンクのスムーススクロール ---------- */
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 12;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});


/* ---------- お問い合わせフォーム（仮送信） ---------- */
function handleSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('.btn-submit');
  btn.textContent = '送信完了！';
  btn.style.background = '#38a169';
  btn.disabled = true;
  alert('お問い合わせありがとうございます。\n担当者より折り返しご連絡いたします。');
}
