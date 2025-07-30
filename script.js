// Game state
const dialogueTexts = [
  "Hello, traveler. You seem to be... far away from the center of the internet, eh? No problem. just take a look around..",
  "Going already? Well, best of luck, traveler. contact me if you want. <a href='https://social.example/' target='_blank'>My Social</a>"
];
let dialogueIndex = 0;
let dialogueDone = false;
let typing = false;
let spritePos = 50; // px from left in the map
let mapLeft = 0;
let moving = false;
let images = [
  {id: "info1", x: 150},
  {id: "info2", x: 350},
  {id: "info3", x: 600},
  {id: "info4", x: 850},
  {id: "info5", x: 1050}
];
const sprite = document.getElementById('sprite');
const map = document.getElementById('map');
const dialogue = document.getElementById('dialogue');
const endArrow = document.getElementById('end-arrow');

// Typewriter effect
async function typeDialogue(txt) {
  typing = true;
  dialogue.innerHTML = '';
  let i = 0;
  while (i < txt.length) {
    let chr = txt[i];
    dialogue.innerHTML += chr;
    if (chr === '.' || chr === '?') await sleep(500);
    else await sleep(30);
    i++;
  }
  typing = false;
  dialogueDone = true;
}
function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }

// Sprite movement and map scroll
function moveSprite(dir) {
  if (typing) return;
  moving = true;
  // Play GIF
  sprite.src = 'assets/sprite2.gif';
  let next = spritePos + (dir === 'right' ? 16 : -16);
  next = Math.max(0, Math.min(1130, next));
  spritePos = next;
  sprite.style.left = spritePos + 'px';

  // Center sprite in viewport
  let center = spritePos - 150;
  center = Math.max(0, Math.min(center, 1200-400));
  map.style.left = (-center) + 'px';

  // Unblur nearby images
  images.forEach(img => {
    let el = document.getElementById(img.id);
    if (Math.abs(spritePos - img.x) < 60) {
      el.style.filter = 'none';
    } else {
      el.style.filter = '';
    }
  });

  // Show arrow at end
  if (spritePos >= 1100) endArrow.style.display = '';
  else endArrow.style.display = 'none';

  setTimeout(() => {
    sprite.src = 'assets/sprite1.png';
    moving = false;
  }, 350);
}

// Keyboard controls
document.addEventListener('keydown', (e) => {
  if (moving) return;
  if (e.key === 'ArrowLeft') moveSprite('left');
  if (e.key === 'ArrowRight') moveSprite('right');
});

// Mobile controls
document.getElementById('left-btn').onclick = () => moveSprite('left');
document.getElementById('right-btn').onclick = () => moveSprite('right');

// End arrow
endArrow.onclick = () => {
  // Hide images
  images.forEach(img => document.getElementById(img.id).style.display = 'none');
  endArrow.style.display = 'none';
  // Show new dialogue
  dialogueIndex = 1;
  typeDialogue(dialogueTexts[1]);
};

// On load: type intro dialogue
window.onload = () => {
  typeDialogue(dialogueTexts[0]);
};
