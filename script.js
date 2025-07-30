// Game state
const dialogueTexts = [
  "Hello, traveler. You seem to be... far away from the center of the internet, eh? No problem. just take a look around..",
  "Going already? Well, best of luck, traveler. contact me if you want. <a href='https://social.example/' target='_blank'>My Social</a>"
];
let dialogueIndex = 0;
let typing = false;
let spritePos = 4; // vw units for flexibility
let moving = false;
const INFO_RADIUS = 12; // vw, adjust as needed for blur effect
let images = [
  {id: "info1", x: 15},
  {id: "info2", x: 45},
  {id: "info3", x: 80},
  {id: "info4", x: 120},
  {id: "info5", x: 170}
];

const sprite = document.getElementById('sprite');
const sprite2 = document.getElementById('sprite2');
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
}

function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }

// Sprite movement with smooth animation
function moveSprite(dir) {
  if (typing || moving) return;
  moving = true;
  // Hide idle sprite, show walking sprite
  sprite.style.display = "none";
  sprite2.style.display = "block";
  sprite2.style.left = sprite.style.left;
  sprite2.style.bottom = sprite.style.bottom;

  let start = spritePos;
  let delta = (dir === 'right' ? 13 : -13); // vw units, adjust for speed
  let end = Math.max(0, Math.min(180, start + delta));
  let startTime = null;

  function animateStep(ts) {
    if (!startTime) startTime = ts;
    let progress = Math.min(1, (ts - startTime) / 200); // 200ms move
    spritePos = start + (end - start) * progress;
    let px = spritePos + 'vw';
    sprite2.style.left = px;
    sprite.style.left = px;

    // Center map on sprite
    let center = spritePos - 20;
    center = Math.max(0, Math.min(center, 200)); // Map is 300vw - 100vw
    map.style.left = (-center) + 'vw';

    // Unblur nearby images
    images.forEach(img => {
      let el = document.getElementById(img.id);
      if (Math.abs(spritePos - img.x) < INFO_RADIUS) {
        el.style.filter = 'none';
      } else {
        el.style.filter = '';
      }
    });

    // Show arrow at end
    if (spritePos >= 170) endArrow.style.display = '';
    else endArrow.style.display = 'none';

    if (progress < 1) {
      requestAnimationFrame(animateStep);
    } else {
      // Show idle sprite again
      sprite.style.display = "block";
      sprite2.style.display = "none";
      moving = false;
    }
  }
  requestAnimationFrame(animateStep);
}

// Keyboard controls
document.addEventListener('keydown', (e) => {
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

// On load: type intro dialogue and set up sprites
window.onload = () => {
  // Set starting position
  sprite.style.left = spritePos + 'vw';
  sprite.style.bottom = '10vw';
  sprite2.style.left = spritePos + 'vw';
  sprite2.style.bottom = '10vw';
  typeDialogue(dialogueTexts[0]);
};
