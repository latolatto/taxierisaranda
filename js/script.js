document.addEventListener("DOMContentLoaded", () => {
    


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
  if(!navigator.geolocation) return;

  navigator.geolocation.getCurrentPosition((position)=>{
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    const mapsLink = `https://maps.google.com/?q=${lat},${lng}`;
    const message = encodeURIComponent(`My location is: ${mapsLink}`);

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
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

document.addEventListener("DOMContentLoaded", () => {

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

});