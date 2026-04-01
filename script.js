let current = 0;
const total = 4;
let autoTimer;

function carouselGo(index) {
  current = (index + total) % total;
  document.getElementById("carouselTrack").style.transform =
    `translateX(-${current * 100}%)`;
  document.querySelectorAll("#thumbStrip .thumb").forEach((t, i) => {
    t.classList.toggle("active", i === current);
  });
  resetAuto();
}

function carouselMove(dir) {
  carouselGo(current + dir);
}

function resetAuto() {
  clearInterval(autoTimer);
  autoTimer = setInterval(() => carouselMove(1), 5000);
}

// keyboard nav
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") carouselMove(-1);
  if (e.key === "ArrowRight") carouselMove(1);
});

// touch swipe
let touchStartX = 0;
const track = document.getElementById("carouselTrack");
track.addEventListener(
  "touchstart",
  (e) => {
    touchStartX = e.touches[0].clientX;
  },
  { passive: true },
);
track.addEventListener("touchend", (e) => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 40) carouselMove(diff > 0 ? 1 : -1);
});

resetAuto();

// modal functions
function openPurchaseModal() {
  document.getElementById("purchaseModal").classList.add("active");
  document.body.style.overflow = "hidden";
}

function closePurchaseModal() {
  document.getElementById("purchaseModal").classList.remove("active");
  document.body.style.overflow = "";
}

// Thank You Modal functions
function openThankYouModal() {
  document.getElementById("thankYouModal").classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeThankYouModal() {
  document.getElementById("thankYouModal").classList.remove("active");
  document.body.style.overflow = "";
}

// Handle download click
function handleDownload(event) {
  event.preventDefault(); // Prevent immediate download

  const downloadUrl = event.currentTarget.href;

  closePurchaseModal();
  setTimeout(() => {
    openThankYouModal();
    startDownloadTimer(downloadUrl);
  }, 500);
}

// Download timer countdown
let downloadTimerInterval;
function startDownloadTimer(downloadUrl) {
  let countdown = 5;
  const timerElement = document.getElementById("downloadTimer");
  const countdownNumber = document.getElementById("countdownNumber");

  // Clear any existing timer
  if (downloadTimerInterval) {
    clearInterval(downloadTimerInterval);
  }

  // Show timer
  timerElement.style.display = "block";

  downloadTimerInterval = setInterval(() => {
    countdown--;
    countdownNumber.textContent = countdown;

    if (countdown <= 0) {
      clearInterval(downloadTimerInterval);

      // Hide timer and show success message
      timerElement.innerHTML = `
        <div class="flex items-center justify-center gap-2 text-green-400">
          <i class="ph-bold ph-check-circle"></i>
          <span class="text-[13px] font-medium">Download started!</span>
        </div>
      `;

      // Trigger the download
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "PeekShot-1.2.dmg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Hide timer after 2 seconds
      setTimeout(() => {
        timerElement.style.display = "none";
      }, 2000);
    }
  }, 1000);
}

function copyCouponCode() {
  const code = "20OFF";
  const btn = document.getElementById("copyCouponBtn");
  const copyText = btn.querySelector(".copy-text");
  const copyIcon = btn.querySelector(".copy-icon");

  navigator.clipboard
    .writeText(code)
    .then(() => {
      copyIcon.innerHTML = '<i class="ph-bold ph-check"></i>';
      copyText.textContent = "Copied!";
      btn.classList.add("copied");

      setTimeout(() => {
        copyIcon.innerHTML = '<i class="ph-bold ph-copy"></i>';
        copyText.textContent = "Copy";
        btn.classList.remove("copied");
      }, 2000);
    })
    .catch(() => {
      const input = document.createElement("input");
      input.value = code;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);

      copyIcon.innerHTML = '<i class="ph-bold ph-check"></i>';
      copyText.textContent = "Copied!";
      btn.classList.add("copied");

      setTimeout(() => {
        copyIcon.innerHTML = '<i class="ph-bold ph-copy"></i>';
        copyText.textContent = "Copy";
        btn.classList.remove("copied");
      }, 2000);
    });
}

// close modals on ESC
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closePurchaseModal();
    closeThankYouModal();
  }
});

// ── MICROINTERACTIONS ──────────────────────────────
// Scroll reveal animation
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("active");
    }
  });
}, observerOptions);

// Observe all reveal elements
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// Animate checkmarks in pricing cards
const pricingObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const checks = entry.target.querySelectorAll("li span");
        checks.forEach((check, i) => {
          setTimeout(() => {
            check.classList.add("check-animate");
          }, i * 100);
        });
        pricingObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 },
);

document
  .querySelectorAll("#pricing .card, #pricing > div > div")
  .forEach((el) => pricingObserver.observe(el));
