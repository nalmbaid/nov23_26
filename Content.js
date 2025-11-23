const knownDomains = [
   "hm.com", "zara.com", "uniqlo.com", "gap.com", "oldnavy.com", "oldnavy.gap.com","clubllondon.us",
  "target.com", "walmart.com", "kohls.com", "macys.com", "jcpenney.com","levi.com",
  "nordstrom.com", "bloomingdales.com", "urbanoutfitters.com", "forever21.com",
  "express.com", "jcrew.com", "abercrombie.com", "aeropostale.com", "bananaRepublic.com",
  "annTaylor.com", "loft.com", "madewell.com", "landsend.com", "eddiebauer.com",
  "asos.com", "shein.com", "boohoo.com", "prettylittlething.com", "missguided.com",
  "revolve.com", "lulus.com", "fashionnova.com", "princesspolly.com", "ohpolly.com",
  "whitefoxboutique.com", "vergegirl.com", "shopbop.com", "ssense.com", "farfetch.com",
  "yoox.com", "theoutnet.com", "matchesfashion.com", "mytheresa.com", "net-a-porter.com",
  "renttherunway.com", "nike.com", "adidas.com", "reebok.com", "puma.com", "newbalance.com",
  "converse.com", "vans.com", "underarmour.com", "asics.com", "champion.com", "fila.com",
  "footlocker.com", "finishline.com", "eastbay.com", "stockx.com", "goat.com","na-kd.com",
  "flightclub.com", "stadiumgoods.com", "hoka.com", "on-running.com", "allbirds.com",
  "lululemon.com", "gymshark.com", "aloYoga.com", "amazon.com", "ebay.com", "etsy.com",
  "aliexpress.com", "poshmark.com", "thredup.com", "depop.com", "grailed.com",
  "theRealreal.com", "mercari.com", "zalando.com", "shopify.com", "gucci.com", "prada.com",
  "dior.com", "chanel.com", "balenciaga.com", "burberry.com", "louisvuitton.com",
  "saintlaurent.com", "versace.com", "hermes.com", "fendi.com", "celine.com", "valentino.com",
  "bottegaveneta.com", "moncler.com", "off---white.com", "fearofgod.com", "givenchy.com",
  "balmain.com", "patagonia.com", "thenorthface.com", "columbia.com", "arcteryx.com",
  "carhartt.com", "timberland.com", "dockers.com", "levis.com", "wrangler.com",
  "diesel.com", "superdry.com", "hollisterco.com", "birkenstock.com", "crocs.com", "ugg.com",
  "drmartens.com", "toms.com", "vionicshoes.com", "skechers.com", "everlane.com", "tentree.com",
  "outerknown.com", "pact.com", "girlfriend.com", "mate-the-label.com", "reformation.com",
  "veja-store.com", "rains.com", "bombas.com", "allsbirds.com", "sephora.com", "ulta.com",
  "glossier.com", "fentybeauty.com", "kyliecosmetics.com", "rarebeauty.com", "patmcgrath.com",
  "zalora.com", "myntra.com", "ajio.com", "nykaa.com", "asos.co.uk", "boohooman.com",
  "aboutyou.com", "asos.de", "asos.fr", "asos.com.au","clarks.com","sezane.com","prettylittlething.us","colourpop.com","anthropologie.com","jellycat.com"
];


function isShoppingSite() {
  return knownDomains.some(domain => location.hostname.includes(domain));
}


// --- Image sets ---
const baseImages = [
  "ems0.png", "ems1.png", "ems2.png", "ems3.png", "ems4.png",
  "ems5.png", "ems6.png", "ems7.png", "ems8.png", "ems9.png", "ems10.png"
];
const tbImages = [
  "ems1_b.png", "ems2_b.png", "ems3_b.png", "ems4_b.png",
  "ems5_b.png", "ems6_b.png", "ems7_b.png", "ems8_b.png",
  "ems9_b.png", "ems10_b.png"
];

let currentImageIndex = 0;
let activeImageElement = null;
let activeTBImage = null;

// --- Create popup image ---
function createPopupImage(filename, options = {}) {
  const img = document.createElement("img");
  img.src = chrome.runtime.getURL(filename);

  Object.assign(img.style, {
    position: "fixed",
    right: options.right || "20px",
    top: options.top || "20px",
    width: options.width || "100px",
    height: "auto",
    opacity: "0",
    borderRadius: "8px",
    zIndex: options.zIndex || "9999",
    pointerEvents: "none",
    transition: "opacity 0.6s ease"
  });

  document.body.appendChild(img);
  requestAnimationFrame(() => (img.style.opacity = options.opacity || "0.8"));
  return img;
}

// --- Show main image ---
function updateDisplayedImage() {
  const chosenImage = baseImages[currentImageIndex];

  if (!activeImageElement) {
    activeImageElement = createPopupImage(chosenImage, { width: "100px" });
  } else {
    activeImageElement.src = chrome.runtime.getURL(chosenImage);
    activeImageElement.style.width = "100px";
  }

  localStorage.setItem("currentImageIndex", currentImageIndex);
  showTemporaryTBImage(currentImageIndex);
}

// --- Show temporary TB overlay ---
function showTemporaryTBImage(index) {
  const tbFile = tbImages[index - 1];
  if (!tbFile) return;

  if (activeTBImage) {
    activeTBImage.remove();
    activeTBImage = null;
  }

  // proportional ratio: (1792 / 454)
   // chatgpt helped with ratio concept
  const ratio = 1792 / 454; // ≈ 3.948
  const tbWidth = 100 * ratio; // proportional to base image width
  activeTBImage = createPopupImage(tbFile, {
    width: tbWidth + "px",
    zIndex: "10000",
    opacity: 0.9
  });

  // Fade out after 5 seconds
  setTimeout(() => {
    if (activeTBImage) {
      activeTBImage.style.opacity = "0";
      setTimeout(() => {
        activeTBImage?.remove();
        activeTBImage = null;
      }, 600);
    }
  }, 5000);
}

// --- Initialize on load ---
if (isShoppingSite()) {
  const savedIndex = parseInt(localStorage.getItem("currentImageIndex"), 10);
  currentImageIndex = isNaN(savedIndex) ? 0 : Math.min(savedIndex, baseImages.length - 1);

  activeImageElement = createPopupImage(baseImages[currentImageIndex], { width: "100px" });
  console.log("Restored image:", baseImages[currentImageIndex]);
}

// --- Click handling ---
document.addEventListener("click", (e) => {
  if (!isShoppingSite()) return;

  const button = e.target.closest("button, a");
  if (!button) return;

  const text = (button.textContent || "").toLowerCase();
  const aria = (button.getAttribute("aria-label") || "").toLowerCase();
  const classes = (button.className || "").toLowerCase();

   // chatgpt helped with aria labeling options
  const addKeywords = ["add to cart", "add to bag", "buy now", "purchase", "add", "shop now", "order now", "+"];
  const removeKeywords = ["remove", "minus", "-"];

  const isAdd = addKeywords.some(word => text.includes(word) || aria.includes(word) || classes.includes(word));
  const isRemove = removeKeywords.some(word => text.includes(word) || aria.includes(word) || classes.includes(word));

  if (isAdd) {
    currentImageIndex = Math.min(currentImageIndex + 1, baseImages.length - 1);
    updateDisplayedImage();
  } else if (isRemove) {
    currentImageIndex = Math.max(currentImageIndex - 1, 0);
    updateDisplayedImage();
  }
});
