document.addEventListener("DOMContentLoaded", () => {
    

  
function scrollToTop(){
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

    const navbar = document.getElementById("navbar");

window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});


AOS.init();

const WHATSAPP_NUMBER = "355676320030";

function sendLocationWhatsApp(){

  if(!navigator.geolocation){
    alert("Geolocation not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition((position)=>{

    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    const mapsLink = `https://maps.google.com/?q=${lat},${lng}`;

    const message = encodeURIComponent(`My location is: ${mapsLink}`);

    window.open(`https://wa.me/355676320030?text=${message}`, "_blank");

  }, () => {
    alert("Location access denied");
  });

}

window.sendLocationWhatsApp = sendLocationWhatsApp;

function scrollToContact(){
  const el = document.getElementById("contact");
  if(el){
    el.scrollIntoView({behavior:"smooth"});
  }
}

window.scrollToContact = scrollToContact;


// CAROUSEL


const carousel = document.getElementById("carousel");

// CLONE ITEMS FOR INFINITE EFFECT
const items = [...carousel.children];
items.forEach(item => {
  const clone = item.cloneNode(true);
  carousel.appendChild(clone);
});

let scrollSpeed = 0.5;

function autoScroll() {
  carousel.scrollLeft += scrollSpeed;

  // RESET WITHOUT JUMP
  if (carousel.scrollLeft >= carousel.scrollWidth / 2) {
    carousel.scrollLeft = 0;
  }

  requestAnimationFrame(autoScroll);
}

autoScroll();



});

//reviews
/**
 * TAXI ERI SARANDA - THE GLITCH-KILLER ENGINE
 * Features: 6-set Buffer, Math.round Precision, Reflow Snap, Auto-Play
 */

const reviews = [
    { name: "Elena R.", loc: "Italy", text: "Best taxi in Saranda! Spotless car and very professional." },
    { name: "Mark T.", loc: "UK", text: "Airport transfer was perfect. On time and safe driving." },
    { name: "Lukas M.", loc: "Germany", text: "Easier than the bus. Great price for Ksamil trips!" },
    { name: "Sarah J.", loc: "USA", text: "Eri is the best. He knows all the hidden gems." },
    { name: "David N.", loc: "Poland", text: "WhatsApp booking was so fast. Highly recommend!" }
];

const track = document.getElementById('reviews-track');
const viewport = document.getElementById('reviews-viewport');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');

// 1. INJECT 6 SETS FOR INFINITE BUFFER
const bufferSet = [...reviews, ...reviews, ...reviews, ...reviews, ...reviews, ...reviews];

bufferSet.forEach((r) => {
    const card = document.createElement('div');
    card.className = `review-item flex flex-col justify-between`;
    card.innerHTML = `
        <div>
            <div class="text-yellow-400 mb-3 text-sm">★★★★★</div>
            <p class="text-gray-700 italic text-[0.95rem] leading-relaxed">"${r.text}"</p>
        </div>
        <div class="flex items-center gap-3 mt-6">
            <div class="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center font-bold text-black text-sm">${r.name[0]}</div>
            <div class="text-left">
                <h4 class="font-bold text-gray-900 text-sm leading-none">${r.name}</h4>
                <span class="text-[0.7rem] text-gray-400 uppercase tracking-wider">${r.loc}</span>
            </div>
        </div>`;
    track.appendChild(card);
});

// 2. STATE MANAGEMENT
let currentIndex = reviews.length * 2; // Start in the second "real" set
let isDragging = false;
let startX = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let autoPlayInterval;

function getCardWidth() {
    const card = track.querySelector('.review-item');
    const gap = 24; // 1.5rem = 24px
    return card.offsetWidth + gap;
}

// 3. THE SLIDER ENGINE
function updateSlider(animate = true) {
    const cardWidth = getCardWidth();
    const viewportWidth = viewport.offsetWidth;
    // Align middle of card to middle of viewport
    const centerOffset = (viewportWidth - (cardWidth - 24)) / 2;
    
    // Math.round prevents 1px rounding glitches on high-res screens
    currentTranslate = Math.round(-(currentIndex * cardWidth) + centerOffset);
    
    track.style.transition = animate ? 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)' : 'none';
    track.style.transform = `translateX(${currentTranslate}px)`;

    const allCards = track.querySelectorAll('.review-item');
    allCards.forEach((c, i) => {
        c.classList.toggle('active-focus', i === currentIndex);
    });
    
    prevTranslate = currentTranslate;
}

// 4. THE GLITCH-KILLER RESET
function handleInfiniteLoop() {
    const totalReviews = reviews.length;
    // If we've drifted out of the "safe" middle zones
    if (currentIndex >= totalReviews * 4 || currentIndex <= totalReviews) {
        track.style.transition = 'none'; // Kill animation
        
        // Calculate new index in the middle set
        currentIndex = (currentIndex % totalReviews) + totalReviews * 2;
        
        const cardWidth = getCardWidth();
        const viewportWidth = viewport.offsetWidth;
        const centerOffset = (viewportWidth - (cardWidth - 24)) / 2;
        currentTranslate = Math.round(-(currentIndex * cardWidth) + centerOffset);
        
        // FORCE REFLOW: Essential to make the 'transition: none' stick
        track.offsetHeight; 
        
        track.style.transform = `translateX(${currentTranslate}px)`;
        prevTranslate = currentTranslate;
    }
}

// 5. AUTO-PLAY
function startAutoPlay() {
    stopAutoPlay();
    autoPlayInterval = setInterval(() => {
        currentIndex++;
        updateSlider(true);
        setTimeout(handleInfiniteLoop, 650);
    }, 5000);
}

function stopAutoPlay() {
    clearInterval(autoPlayInterval);
}

// 6. INTERACTION (DRAG & SWIPE)
const onStart = (e) => {
    stopAutoPlay();
    isDragging = true;
    startX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
    track.style.transition = 'none';
    // Get current position during drag
    const matrix = new WebKitCSSMatrix(window.getComputedStyle(track).transform);
    prevTranslate = matrix.m41;
};

const onMove = (e) => {
    if (!isDragging) return;
    const x = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
    const walk = x - startX;
    track.style.transform = `translateX(${prevTranslate + walk}px)`;
};

const onEnd = (e) => {
    if (!isDragging) return;
    isDragging = false;
    const x = e.type.includes('mouse') ? e.pageX : (e.changedTouches ? e.changedTouches[0].clientX : startX);
    const movedBy = x - startX;

    if (Math.abs(movedBy) > 70) {
        if (movedBy > 0) currentIndex--;
        else currentIndex++;
    }
    
    updateSlider(true);
    setTimeout(() => {
        handleInfiniteLoop();
        startAutoPlay();
    }, 650);
};

// 7. EVENT LISTENERS
viewport.addEventListener('mousedown', onStart);
window.addEventListener('mousemove', onMove);
window.addEventListener('mouseup', onEnd);

viewport.addEventListener('touchstart', onStart, { passive: true });
viewport.addEventListener('touchmove', onMove, { passive: true });
viewport.addEventListener('touchend', onEnd);

nextBtn.onclick = () => {
    stopAutoPlay();
    currentIndex++;
    updateSlider(true);
    setTimeout(() => {
        handleInfiniteLoop();
        startAutoPlay();
    }, 650);
};

prevBtn.onclick = () => {
    stopAutoPlay();
    currentIndex--;
    updateSlider(true);
    setTimeout(() => {
        handleInfiniteLoop();
        startAutoPlay();
    }, 650);
};

viewport.addEventListener('mouseenter', stopAutoPlay);
viewport.addEventListener('mouseleave', startAutoPlay);

// 8. INITIALIZE
window.addEventListener('resize', () => {
    track.style.transition = 'none';
    updateSlider(false);
});

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        updateSlider(false);
        startAutoPlay();
    }, 300);
});