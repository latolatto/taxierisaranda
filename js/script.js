document.addEventListener("DOMContentLoaded", () => {
    
// Force scroll to top on refresh
window.onbeforeunload = function () {
  window.scrollTo(0, 0);
};

// Alternative for some browsers
if (history.scrollRestoration) {
  history.scrollRestoration = 'manual';
}


//contact form 
const contactForm = document.getElementById('form');
const submitBtn = document.getElementById('submit-btn');
const btnText = document.getElementById('btn-text');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // UI Feedback
        const originalText = btnText.textContent;
        btnText.textContent = "Sending...";
        submitBtn.disabled = true;

        const formData = new FormData(contactForm);
        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: json
            });

            const result = await response.json();

            if (result.success) {
                // Success Alert
                alert("Success! Your message has been sent. Eri will contact you shortly.");
                contactForm.reset();
            } else {
                // API Error Alert
                alert("Oops! " + result.message);
            }
        } catch (error) {
            // Connection Error Alert
            alert("Connection error. Please check your internet and try again.");
        } finally {
            // Restore Button
            btnText.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}
  
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


function scrollToContact(){
  const el = document.getElementById("contact");
  if(el){
    el.scrollIntoView({behavior:"smooth"});
  }
}

window.scrollToContact = scrollToContact;



autoScroll();



});

//reviews
/**
 * TAXI ERI SARANDA - THE GLITCH-KILLER ENGINE
 * Features: 6-set Buffer, Math.round Precision, Reflow Snap, Auto-Play
 */

const reviews = [
    { name: "Milka K.", loc: "Rwanda", text: "We found we put a wrong location. But he was very understanding, helpful and a good driver. Thank you Eri." },
    { name: "Charlene M.", loc: "Zimbabwe", text: "Driver picked us from our hotel in Sarande to Tirana. He was very professional and we were so comfortable in there. Took a picture of the views on our way. Air conditioning was good . Highly recommend" },
    { name: "Jess R.", loc: "UK", text: "Couldn't ask for better service. Excellent driver, reliable, fully functioning luxury car and even opens the door. Would recommend to all" },
    { name: "HB McKenna", loc: "Ireland", text: "Excellent service. On time. Good driver. We will use again for future trips. Strongly recommend." },
    { name: "Alex", loc: "USA", text: "Quick to respond. Very nice. And no problem finding pickup and drop off locations. This is my go to taxi service for the area." },
        { name: "Christian T.", loc: "Ivory Coast", text: "Very good driver and polite too . Will recommend him to anyone who need taxi in Albania" },
    { name: "Antje B.", loc: "Germany", text: "Great experience. The driver was friendly, courteous and accommodating." },
    { name: "Stefan H.", loc: "Sweden", text: "On time, friendly and very service minded. I recommend Eri taxi if you want a fast and safe trip around Saranda and more!" },
    { name: "Jaypee P.", loc: "Philippines", text: "The taxi is clean and the driver is very helpful. I'd recommended." },
    { name: "Tarek K.", loc: "Lebanon", text: "Great driver, very professional and nice to talk to, functional AC. Recommend." },
    { name: "Josilene B.", loc: "Brazil", text: "Very helpful when we needed to stop on the way.Talkative and sympathetic!5 stars ." },
    { name: "Dimitra P.", loc: "Greece", text: "We had a great experience. Eri is very kind and friendly. He was on time and showed us around Sarande. His taxi service is highly recommended!" },
    { name: "Nirujan K.", loc: "Sri Lanka", text: "A great taxi service! The taxi arrived quickly and right on time. The driver, Ervin T, was excellent, very polite, professional, and friendly. We felt safe and comfortable throughout the ride. Highly recommended!" },
    { name: "Lola D.", loc: "Albania", text: "I traveled with this taxi and it left me with good impressions.The best" },
    { name: "Caroline L.", loc: "Ireland", text: "Our driver who we used on 4 occasions was outstanding. He was prompt, polite, helpful & professional. Would highly recommend." },
    { name: "Michelle L.", loc: "Brazil", text: "Great service, from helping with our bags, to getting us water and giving recommendations. 10/10" },
    { name: "Daisy H.", loc: "UK", text: "best taxi driver, lovely service to Ksmail. Very useful would recommend." },
    { name: "Ivy W.", loc: "China", text: "Eri was super friendly and chill! On time, safe driver. Highly recommend if you need a taxi around Sarandë!" }

];

const track = document.getElementById('reviews-track');
const viewport = document.getElementById('reviews-viewport');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');

// 1. INJECT 6 SETS FOR INFINITE BUFFER
const bufferSet = [...reviews, ...reviews, ...reviews, ...reviews, ...reviews, ...reviews, ...reviews, ...reviews, ...reviews, ...reviews, ...reviews, ...reviews, ...reviews, ...reviews, ...reviews, ...reviews, ...reviews, ...reviews, ...reviews];

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