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
const reviews = [
    { name: "Elena R.", loc: "Italy", text: "Best taxi in Saranda! Spotless car and very professional." },
    { name: "Mark T.", loc: "UK", text: "Airport transfer was perfect. On time and safe driving." },
    { name: "Lukas M.", loc: "Germany", text: "Easier than the bus. Great price for Ksamil trips!" },
    { name: "Sarah J.", loc: "USA", text: "Eri is the best. He knows all the hidden gems." },
    { name: "David N.", loc: "Poland", text: "WhatsApp booking was so fast. Highly recommend!" }
];

const track = document.getElementById('reviews-track');
const viewport = document.getElementById('reviews-viewport');

// Triple the cards: [0,1,2,3,4] [5,6,7,8,9] [10,11,12,13,14]
// We will focus on the middle set (indices 5-9)
const tripleReviews = [...reviews, ...reviews, ...reviews];

tripleReviews.forEach((r, i) => {
    const card = document.createElement('div');
    card.className = `review-item flex flex-col justify-between`;
    card.innerHTML = `
        <div>
            <div class="text-yellow-400 mb-3">★★★★★</div>
            <p class="text-gray-700 italic text-[0.95rem]">"${r.text}"</p>
        </div>
        <div class="flex items-center gap-3 mt-6">
            <div class="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center font-bold">${r.name[0]}</div>
            <div class="text-left">
                <h4 class="font-bold text-gray-900 text-sm">${r.name}</h4>
                <span class="text-[0.7rem] text-gray-400 uppercase">${r.loc}</span>
            </div>
        </div>`;
    track.appendChild(card);
});

let index = reviews.length; // Start at the first card of the second set
let isTransitioning = false;

function updateSlider(smooth = true) {
    const card = document.querySelector('.review-item');
    const cardWidth = card.offsetWidth;
    const gap = parseFloat(getComputedStyle(track).gap);
    const totalWidth = cardWidth + gap;
    
    // Center the active card in the viewport
    const offset = (viewport.offsetWidth - cardWidth) / 2;
    const xPosition = -(index * totalWidth) + offset;

    track.style.transition = smooth ? 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)' : 'none';
    track.style.transform = `translateX(${xPosition}px)`;

    // Highlight middle
    document.querySelectorAll('.review-item').forEach((c, i) => {
        c.classList.toggle('active-focus', i === index);
    });
}

function handleInfinite() {
    // If we go past the end of the middle set
    if (index >= reviews.length * 2) {
        index = reviews.length;
        updateSlider(false);
    }
    // If we go before the start of the middle set
    if (index < reviews.length) {
        index = reviews.length * 2 - 1;
        updateSlider(false);
    }
    isTransitioning = false;
}

document.getElementById('nextBtn').onclick = () => {
    if (isTransitioning) return;
    isTransitioning = true;
    index++;
    updateSlider();
    setTimeout(handleInfinite, 500);
};

document.getElementById('prevBtn').onclick = () => {
    if (isTransitioning) return;
    isTransitioning = true;
    index--;
    updateSlider();
    setTimeout(handleInfinite, 500);
};

// Touch/Swipe
let startX = 0;
viewport.addEventListener('touchstart', e => startX = e.touches[0].clientX);
viewport.addEventListener('touchend', e => {
    const endX = e.changedTouches[0].clientX;
    if (startX - endX > 50) document.getElementById('nextBtn').click();
    if (startX - endX < -50) document.getElementById('prevBtn').click();
});

window.addEventListener('resize', () => updateSlider(false));
setTimeout(() => updateSlider(false), 100);