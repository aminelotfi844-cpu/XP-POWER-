/* =====================================================
   XP POWER — MOKHTAR ZAZAY
   ===================================================== */


/* =========================
   SETTINGS
========================= */

const PRODUCTS_KEY = "xp_power_products_v2";
const CART_KEY = "xp_power_cart_v2";

const ADMIN_EMAIL = "lotfiamine677@gmail.com";


/* =========================
   SUPABASE
========================= */

console.log("=== XP POWER START ===");
console.log("SUPABASE:", window.supabase);
console.log("SUPABASE URL:", window.SUPABASE_URL);

if (!window.supabase) {
  console.error("❌ Supabase CDN is not loaded.");
}

if (!window.SUPABASE_URL) {
  console.error("❌ SUPABASE_URL is missing from config.js");
}

if (!window.SUPABASE_PUBLISHABLE_KEY) {
  console.error("❌ SUPABASE_PUBLISHABLE_KEY is missing from config.js");
}

const db =
  window.supabase &&
  window.SUPABASE_URL &&
  window.SUPABASE_PUBLISHABLE_KEY
    ? window.supabase.createClient(
        window.SUPABASE_URL,
        window.SUPABASE_PUBLISHABLE_KEY
      )
    : null;

console.log("DATABASE:", db ? "✅ Connected" : "❌ Not initialized");


/* =========================
   DEFAULT PRODUCTS
========================= */

const DEFAULT_PRODUCTS = [

  {
    id: "citizen-v1",
    name: "Citizen Pack V1",
    category: "FiveM",
    price: 5,
    description:
      "Premium Citizen resources for your FiveM server.",
    image: "images/citizen.svg"
  },

  {
    id: "custom-scripts",
    name: "Custom Scripts",
    category: "Script",
    price: 10,
    description:
      "Useful scripts for your FiveM server.",
    image: "images/scripts.svg"
  },

  {
    id: "los-santos-mlo",
    name: "Los Santos MLO",
    category: "MLO",
    price: 8,
    description:
      "High quality custom MLO.",
    image: "images/mlo.svg"
  },

  {
    id: "police-pack",
    name: "Police Pack",
    category: "Pack",
    price: 7,
    description:
      "Police resources for FiveM servers.",
    image: "images/police-pack.svg"
  },

  {
    id: "gaming-wallpapers",
    name: "Gaming Wallpaper Pack",
    category: "Wallpaper",
    price: 3,
    description:
      "Gaming wallpapers for your setup.",
    image: "images/wallpaper.svg"
  },

  {
    id: "ultimate-pack",
    name: "Ultimate Gaming Pack",
    category: "Pack",
    price: 12,
    description:
      "A complete gaming bundle.",
    image: "images/gaming-pack.svg"
  }

];


/* =========================
   VARIABLES
========================= */

let selectedProduct = null;

let cart =
  JSON.parse(
    localStorage.getItem(CART_KEY) || "[]"
  );


/* =========================
   PRODUCTS
========================= */

function getCustomProducts() {

  try {

    return JSON.parse(
      localStorage.getItem(PRODUCTS_KEY) || "[]"
    );

  } catch (error) {

    console.error("Products storage error:", error);

    return [];

  }

}


function getAllProducts() {

  return [
    ...DEFAULT_PRODUCTS,
    ...getCustomProducts()
  ];

}


/* =========================
   CART
========================= */

function saveCart() {

  localStorage.setItem(
    CART_KEY,
    JSON.stringify(cart)
  );

  renderCart();
  updateCartCount();

}


function updateCartCount() {

  const count =
    document.getElementById("cartCount");

  if (count) {
    count.textContent = cart.length;
  }

}


function addToCart(product) {

  cart.push({

    id: Date.now(),

    productId: product.id,

    name: product.name,

    price: Number(product.price),

    image: product.image || ""

  });

  saveCart();

}


function addSelectedToCart() {

  if (!selectedProduct) return;

  addToCart(selectedProduct);

  toast("🛒 Added to cart");

}


function removeCartItem(id) {

  cart =
    cart.filter(
      item => item.id !== id
    );

  saveCart();

}


function renderCart() {

  const box =
    document.getElementById("cartItems");

  const totalElement =
    document.getElementById("cartTotal");

  if (!box || !totalElement) return;

  box.innerHTML = "";

  let total = 0;

  if (cart.length === 0) {

    box.innerHTML =
      '<p class="muted">Your cart is empty.</p>';

    totalElement.textContent = "0.00";

    return;

  }

  cart.forEach(item => {

    total += Number(item.price);

    const row =
      document.createElement("div");

    row.className = "cart-item";

    row.innerHTML = `

      <div>

        <b>${safe(item.name)}</b>

        <div class="muted">
          $${Number(item.price).toFixed(2)}
        </div>

      </div>

      <button onclick="removeCartItem(${item.id})">
        Remove
      </button>

    `;

    box.appendChild(row);

  });

  totalElement.textContent =
    total.toFixed(2);

}


function openCart() {

  renderCart();

  openModal("cartModal");

}


/* =========================
   TOAST
========================= */

function toast(message) {

  const element =
    document.getElementById("toast");

  if (!element) return;

  element.textContent = message;

  element.classList.add("show");

  clearTimeout(window.toastTimer);

  window.toastTimer =
    setTimeout(() => {

      element.classList.remove("show");

    }, 2200);

}


/* =========================
   MODALS
========================= */

function openModal(id) {

  const modal =
    document.getElementById(id);

  if (modal) {

    modal.classList.add("active");

  } else {

    console.error(
      "❌ Modal not found:",
      id
    );

  }

}


function closeModal(id) {

  const modal =
    document.getElementById(id);

  if (modal) {

    modal.classList.remove("active");

  }

}


/* =========================
   SECURITY / HTML
========================= */

function safe(value) {

  return String(value ?? "")
    .replace(
      /[&<>"']/g,
      character => {

        const entities = {

          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#039;"

        };

        return entities[character];

      }
    );

}


/* =========================
   FALLBACK IMAGE
========================= */

function placeholderSVG(name) {

  const text =
    encodeURIComponent(
      String(name).slice(0, 24)
    );

  return `
    data:image/svg+xml;charset=UTF-8,
    <svg xmlns="http://www.w3.org/2000/svg"
         width="900"
         height="600">

      <defs>

        <linearGradient
          id="g"
          x1="0"
          x2="1">

          <stop
            stop-color="%23051122"/>

          <stop
            offset="1"
            stop-color="%2300aaff"/>

        </linearGradient>

      </defs>

      <rect
        width="100%"
        height="100%"
        fill="url(%23g)"/>

      <text
        x="50%"
        y="50%"
        text-anchor="middle"
        dominant-baseline="middle"
        fill="white"
        font-size="48"
        font-family="Arial"
        font-weight="bold">

        ${text}

      </text>

    </svg>
  `.replace(/\s+/g, " ");

}


/* =========================
   RENDER PRODUCTS
========================= */

function renderProducts() {

  const grid =
    document.getElementById("productsGrid");

  if (!grid) return;

  grid.innerHTML = "";

  getAllProducts().forEach(product => {

    const card =
      document.createElement("article");

    card.className = "product-card";

    const image =
      product.image ||
      placeholderSVG(product.name);

    card.innerHTML = `

      <div class="product-image-wrap">

        <img
          class="product-image"
          src="${image}"
          alt="${safe(product.name)}">

        <div class="product-actions">

          <button
            data-like="${safe(product.id)}">
            ❤️
          </button>

          <button
            data-dislike="${safe(product.id)}">
            👎
          </button>

        </div>

      </div>

      <div class="product-info">

        <span class="tag">
          ${safe(product.category)}
        </span>

        <h3>
          ${safe(product.name)}
        </h3>

        <p>
          ${safe(product.description)}
        </p>

        <div class="product-price">
          $${Number(product.price).toFixed(2)}
        </div>

        <button
          class="buy-btn"
          data-buy="${safe(product.id)}">

          🛒 BUY NOW

        </button>

      </div>

    `;

    const imageElement =
      card.querySelector(".product-image");

    if (imageElement) {

      imageElement.addEventListener(
        "error",
        function () {

          this.onerror = null;

          this.src =
            placeholderSVG(product.name);

        }
      );

    }

    const buyButton =
      card.querySelector("[data-buy]");

    if (buyButton) {

      buyButton.addEventListener(
        "click",
        () => openProduct(product.id)
      );

    }

    const likeButton =
      card.querySelector("[data-like]");

    if (likeButton) {

      likeButton.addEventListener(
        "click",
        () => likeProduct(product.id)
      );

    }

    const dislikeButton =
      card.querySelector("[data-dislike]");

    if (dislikeButton) {

      dislikeButton.addEventListener(
        "click",
        () => dislikeProduct(product.id)
      );

    }

    grid.appendChild(card);

  });

  renderLikes();

}


/* =========================
   PRODUCT DETAILS
========================= */

function openProduct(id) {

  selectedProduct =
    getAllProducts().find(
      product =>
        String(product.id) === String(id)
    );

  if (!selectedProduct) return;

  const image =
    document.getElementById(
      "modalProductImage"
    );

  if (image) {

    image.src =
      selectedProduct.image ||
      placeholderSVG(selectedProduct.name);

    image.onerror =
      function () {

        this.onerror = null;

        this.src =
          placeholderSVG(
            selectedProduct.name
          );

      };

  }

  const category =
    document.getElementById(
      "modalProductCategory"
    );

  const name =
    document.getElementById(
      "modalProductName"
    );

  const description =
    document.getElementById(
      "modalProductDescription"
    );

  const price =
    document.getElementById(
      "modalProductPrice"
    );

  if (category)
    category.textContent =
      selectedProduct.category;

  if (name)
    name.textContent =
      selectedProduct.name;

  if (description)
    description.textContent =
      selectedProduct.description;

  if (price)
    price.textContent =
      Number(
        selectedProduct.price
      ).toFixed(2);

  openModal("productModal");

}


/* =========================
   LIKE / DISLIKE
========================= */

function voteKey() {

  return "xp_power_votes_v1";

}


function vote(productId, type) {

  const votes =
    JSON.parse(
      localStorage.getItem(
        voteKey()
      ) || "{}"
    );

  if (!votes[productId]) {

    votes[productId] = {

      like: false,

      dislike: false

    };

  }

  votes[productId][type] =
    !votes[productId][type];

  if (votes[productId][type]) {

    if (type === "like") {

      votes[productId].dislike =
        false;

    } else {

      votes[productId].like =
        false;

    }

  }

  localStorage.setItem(
    voteKey(),
    JSON.stringify(votes)
  );

  renderLikes();

  toast(
    type === "like"
      ? "❤️ Liked"
      : "👎 Disliked"
  );

}


function likeProduct(id) {

  vote(id, "like");

}


function dislikeProduct(id) {

  vote(id, "dislike");

}


function renderLikes() {

  const votes =
    JSON.parse(
      localStorage.getItem(
        voteKey()
      ) || "{}"
    );

  document
    .querySelectorAll("[data-like]")
    .forEach(button => {

      const id =
        button.dataset.like;

      button.classList.toggle(
        "active",
        !!votes[id]?.like
      );

    });

  document
    .querySelectorAll("[data-dislike]")
    .forEach(button => {

      const id =
        button.dataset.dislike;

      button.classList.toggle(
        "active",
        !!votes[id]?.dislike
      );

    });

}


/* =========================
   ADMIN LOGIN
========================= */

function openAdminLogin() {

  console.log("🔐 Admin button clicked");

  const modal =
    document.getElementById(
      "adminLoginModal"
    );

  if (!modal) {

    console.error(
      "❌ adminLoginModal not found in index.html"
    );

    return;

  }

  openModal("adminLoginModal");

  setTimeout(() => {

    const input =
      document.getElementById(
        "adminPassword"
      );

    if (input) input.focus();

  }, 100);

}


async function adminLogin() {

  console.log("🔐 Admin login started");

  const passwordInput =
    document.getElementById(
      "adminPassword"
    );

  const errorElement =
    document.getElementById(
      "loginError"
    );

  if (!passwordInput) {

    console.error(
      "❌ adminPassword input not found"
    );

    return;

  }

  const password =
    passwordInput.value.trim();

  if (!password) {

    if (errorElement) {

      errorElement.textContent =
        "❌ Enter your password.";

    }

    return;

  }

  if (!db) {

    console.error(
      "❌ Supabase is not initialized."
    );

    if (errorElement) {

      errorElement.textContent =
        "❌ Supabase connection error.";

    }

    return;

  }

  if (errorElement) {

    errorElement.textContent =
      "⏳ Checking...";

  }

  const { error } =
    await db.auth.signInWithPassword({

      email:
        ADMIN_EMAIL,

      password:
        password

    });

  if (error) {

    console.error(
      "❌ Login error:",
      error
    );

    if (errorElement) {

      errorElement.textContent =
        "❌ Wrong password.";

    }

    return;

  }

  if (errorElement) {

    errorElement.textContent = "";

  }

  closeModal(
    "adminLoginModal"
  );

  enableAdmin();

  toast("🔓 Admin unlocked");

}


function enableAdmin() {

  const adminBar =
    document.getElementById(
      "adminBar"
    );

  if (adminBar) {

    adminBar.classList.add("active");

    console.log("✅ Admin bar enabled");

  } else {

    console.error(
      "❌ adminBar not found in index.html"
    );

  }

}


async function adminLogout() {

  if (!db) return;

  await db.auth.signOut();

  const adminBar =
    document.getElementById(
      "adminBar"
    );

  if (adminBar) {

    adminBar.classList.remove("active");

  }

  toast("🔒 Admin locked");

}


/* =========================
   ADD PRODUCT
========================= */

function openAddProduct() {

  openModal(
    "addProductModal"
  );

}


function saveProduct() {

  const name =
    document
      .getElementById(
        "productName"
      )
      .value
      .trim();

  const category =
    document.getElementById(
      "productCategory"
    ).value;

  const price =
    Number(
      document.getElementById(
        "productPrice"
      ).value
    );

  const description =
    document
      .getElementById(
        "productDescription"
      )
      .value
      .trim();

  const file =
    document.getElementById(
      "productImage"
    ).files[0];

  if (
    !name ||
    !description ||
    Number.isNaN(price) ||
    price < 0 ||
    !file
  ) {

    toast(
      "❌ Fill all product fields"
    );

    return;

  }

  const reader =
    new FileReader();

  reader.onload =
    event => {

      const products =
        getCustomProducts();

      products.push({

        id:
          "custom-" +
          Date.now(),

        name,

        category,

        price,

        description,

        image:
          event.target.result

      });

      try {

        localStorage.setItem(
          PRODUCTS_KEY,
          JSON.stringify(products)
        );

      } catch (error) {

        toast(
          "❌ Image is too large. Use a smaller image."
        );

        return;

      }

      closeModal(
        "addProductModal"
      );

      clearProductForm();

      renderProducts();

      toast(
        "🚀 Product published"
      );

    };

  reader.readAsDataURL(file);

}


function clearProductForm() {

  const name =
    document.getElementById(
      "productName"
    );

  const price =
    document.getElementById(
      "productPrice"
    );

  const description =
    document.getElementById(
      "productDescription"
    );

  const image =
    document.getElementById(
      "productImage"
    );

  if (name) name.value = "";

  if (price) price.value = "";

  if (description) description.value = "";

  if (image) image.value = "";

  const preview =
    document.getElementById(
      "imagePreview"
    );

  if (preview) {

    preview.style.backgroundImage =
      "";

    preview.textContent =
      "📷 Image preview";

  }

}


/* =========================
   BUYER FORM
========================= */

function openBuyerForm() {

  if (!selectedProduct) return;

  closeModal("productModal");

  openModal("buyerModal");

}


function submitOrder() {

  const name =
    document.getElementById(
      "buyerName"
    ).value.trim();

  const email =
    document.getElementById(
      "buyerEmail"
    ).value.trim();

  const phone =
    document.getElementById(
      "buyerPhone"
    ).value.trim();

  const discord =
    document.getElementById(
      "buyerDiscord"
    ).value.trim();

  const note =
    document.getElementById(
      "buyerNote"
    ).value.trim();

  if (
    !name ||
    !email ||
    !phone ||
    !discord
  ) {

    toast(
      "❌ Please fill name, email, phone and Discord"
    );

    return;

  }

  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      email
    )
  ) {

    toast(
      "❌ Enter a valid email"
    );

    return;

  }

  selectedProduct.buyer = {

    name,

    email,

    phone,

    discord,

    note

  };

  closeModal("buyerModal");

  renderCheckoutSummary();

  openModal("checkoutModal");

}


/* =========================
   CART CHECKOUT
========================= */

function checkoutCart() {

  if (!cart.length) {

    toast("🛒 Cart is empty");

    return;

  }

  selectedProduct = null;

  closeModal("cartModal");

  renderCheckoutSummary();

  openModal("checkoutModal");

}


function renderCheckoutSummary() {

  const items =
    selectedProduct
      ? [selectedProduct]
      : cart;

  const total =
    items.reduce(
      (sum, item) =>
        sum + Number(item.price),
      0
    );

  const summary =
    document.getElementById(
      "checkoutSummary"
    );

  if (!summary) return;

  summary.innerHTML =

    items
      .map(
        item =>
          `<div>
            ${safe(item.name)}
            —
            <b>
              $${Number(item.price).toFixed(2)}
            </b>
          </div>`
      )
      .join("")

    +

    `<hr>

     <b>
       Total:
       $${total.toFixed(2)}
     </b>`;

}


/* =========================
   COMPLETE ORDER
========================= */

async function completeOrder() {

  if (!db) {

    toast(
      "❌ Supabase connection error"
    );

    return;

  }

  const reference =
    document.getElementById(
      "transferReference"
    ).value.trim();

  if (!reference) {

    toast(
      "❌ Enter your transfer reference"
    );

    return;

  }

  const proof =
    document.getElementById(
      "proofFile"
    ).files[0];

  const items =
    selectedProduct
      ? [selectedProduct]
      : cart;

  if (!items.length) {

    toast(
      "❌ No products selected"
    );

    return;

  }

  const total =
    items.reduce(
      (sum, item) =>
        sum + Number(item.price),
      0
    );

  const buyer =
    selectedProduct?.buyer ||

    {

      name:
        "Cart customer",

      email:
        "",

      phone:
        "",

      discord:
        "",

      note:
        ""

    };

  const order = {

    id:
      "XP-" +
      Date.now()
        .toString()
        .slice(-8),

    buyer_name:
      buyer.name,

    buyer_email:
      buyer.email,

    buyer_phone:
      buyer.phone,

    buyer_discord:
      buyer.discord,

    buyer_note:
      buyer.note || "",

    items:
      items.map(
        item => ({

          name:
            item.name,

          price:
            Number(item.price)

        })
      ),

    total:
      total,

    transfer_reference:
      reference,

    proof_file_name:
      proof
        ? proof.name
        : "",

    status:
      "PENDING_PAYMENT"

  };

  toast("⏳ Sending order...");

  const { error } =
    await db
      .from("orders")
      .insert(order);

  if (error) {

    console.error(
      "Supabase order error:",
      error
    );

    toast(
      "❌ Order could not be saved"
    );

    return;

  }

  cart = [];

  saveCart();

  clearBuyerForm();

  closeModal(
    "checkoutModal"
  );

  const orderId =
    document.getElementById(
      "orderId"
    );

  if (orderId) {

    orderId.textContent =
      order.id;

  }

  selectedProduct = null;

  openModal(
    "successModal"
  );

}


/* =========================
   CLEAR BUYER FORM
========================= */

function clearBuyerForm() {

  [

    "buyerName",
    "buyerEmail",
    "buyerPhone",
    "buyerDiscord",
    "buyerNote",
    "transferReference",
    "proofFile"

  ].forEach(id => {

    const element =
      document.getElementById(id);

    if (element) {

      element.value = "";

    }

  });

}


/* =========================
   ADMIN ORDERS
========================= */

async function openOrders() {

  if (!db) {

    toast(
      "❌ Supabase connection error"
    );

    return;

  }

  const list =
    document.getElementById(
      "ordersList"
    );

  if (!list) return;

  list.innerHTML =
    '<p class="muted">Loading orders...</p>';

  openModal(
    "ordersModal"
  );

  const { data: orders, error } =
    await db
      .from("orders")
      .select("*")
      .order(
        "created_at",
        {
          ascending: false
        }
      );

  if (error) {

    console.error(
      "Supabase orders error:",
      error
    );

    list.innerHTML =
      '<p class="muted">❌ Could not load orders.</p>';

    return;

  }

  if (!orders || !orders.length) {

    list.innerHTML =
      '<p class="muted">No orders yet.</p>';

    return;

  }

  list.innerHTML =
    orders
      .map(
        order => `

          <div class="order-card">

            <h3>
              ${safe(order.id)}
              —
              $${Number(order.total).toFixed(2)}
            </h3>

            <span class="status">
              ${safe(order.status)}
            </span>

            <p>
              <b>Customer:</b>
              ${safe(order.buyer_name)}
            </p>

            <p>
              <b>Email:</b>
              ${safe(order.buyer_email)}
            </p>

            <p>
              <b>Phone:</b>
              ${safe(order.buyer_phone)}
            </p>

            <p>
              <b>Discord:</b>
              ${safe(order.buyer_discord)}
            </p>

            <p>
              <b>Note:</b>
              ${safe(order.buyer_note || "None")}
            </p>

            <p>
              <b>Product:</b>
              ${
                (order.items || [])
                  .map(
                    item =>
                      safe(item.name)
                  )
                  .join(", ")
              }
            </p>

            <p>
              <b>Transfer ref:</b>
              ${safe(
                order.transfer_reference
              )}
            </p>

            <p>
              <b>Proof file:</b>
              ${safe(
                order.proof_file_name ||
                "Not provided"
              )}
            </p>

            <div class="order-buttons">

              <button
                onclick="markPaid('${safe(order.id)}')">
                Mark Paid
              </button>

              <button
                onclick="markDelivered('${safe(order.id)}')">
                Delivered
              </button>

              <button
                class="red"
                onclick="deleteOrder('${safe(order.id)}')">
                Delete
              </button>

            </div>

          </div>

        `
      )
      .join("");

}


/* =========================
   UPDATE ORDER
========================= */

async function updateOrder(
  id,
  status
) {

  if (!db) return;

  const { error } =
    await db
      .from("orders")
      .update({
        status:
          status
      })
      .eq(
        "id",
        id
      );

  if (error) {

    console.error(
      "Update order error:",
      error
    );

    toast(
      "❌ Could not update order"
    );

    return;

  }

  toast(
    "✅ Order updated"
  );

  openOrders();

}


function markPaid(id) {

  updateOrder(
    id,
    "PAID"
  );

}


function markDelivered(id) {

  updateOrder(
    id,
    "DELIVERED"
  );

}


/* =========================
   DELETE ORDER
========================= */

async function deleteOrder(id) {

  if (
    !confirm(
      "Delete this order?"
    )
  ) {

    return;

  }

  if (!db) return;

  const { error } =
    await db
      .from("orders")
      .delete()
      .eq(
        "id",
        id
      );

  if (error) {

    console.error(
      "Delete order error:",
      error
    );

    toast(
      "❌ Could not delete order"
    );

    return;

  }

  toast(
    "🗑️ Order deleted"
  );

  openOrders();

}


/* =========================
   CLEAR ALL ORDERS
========================= */

async function clearOrders() {

  if (
    !confirm(
      "Delete all orders?"
    )
  ) {

    return;

  }

  if (!db) return;

  const { error } =
    await db
      .from("orders")
      .delete()
      .neq(
        "id",
        ""
      );

  if (error) {

    console.error(
      "Clear orders error:",
      error
    );

    toast(
      "❌ Could not delete orders"
    );

    return;

  }

  toast(
    "🗑️ All orders deleted"
  );

  openOrders();

}


/* =========================
   IMAGE PREVIEW
========================= */

function setupImagePreview() {

  const input =
    document.getElementById(
      "productImage"
    );

  const preview =
    document.getElementById(
      "imagePreview"
    );

  if (!input || !preview) return;

  input.addEventListener(
    "change",
    () => {

      const file =
        input.files[0];

      if (!file) return;

      const reader =
        new FileReader();

      reader.onload =
        event => {

          preview.style.backgroundImage =
            `url("${event.target.result}")`;

          preview.textContent = "";

        };

      reader.readAsDataURL(file);

    }
  );

}


/* =========================
   CHECK ADMIN SESSION
========================= */

async function checkAdminSession() {

  if (!db) {

    console.error(
      "❌ Cannot check admin session: database unavailable."
    );

    return;

  }

  const {
    data,
    error
  } =
    await db.auth.getSession();

  if (error) {

    console.error(
      "Session error:",
      error
    );

    return;

  }

  if (
    data &&
    data.session &&
    data.session.user &&
    data.session.user.email === ADMIN_EMAIL
  ) {

    enableAdmin();

  }

}


/* =========================
   AUTH STATE
========================= */

if (db) {

  db.auth.onAuthStateChange(
    (event, session) => {

      console.log(
        "AUTH EVENT:",
        event
      );

      if (
        session &&
        session.user &&
        session.user.email === ADMIN_EMAIL
      ) {

        enableAdmin();

      }

    }
  );

}


/* =========================
   DEBUG
========================= */

console.log(
  "ADMIN LOGIN FUNCTION:",
  typeof openAdminLogin
);


/* =========================
   START WEBSITE
========================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    console.log(
      "✅ XP POWER DOM loaded"
    );

    renderProducts();

    renderCart();

    updateCartCount();

    setupImagePreview();

    checkAdminSession();

    const passwordInput =
      document.getElementById(
        "adminPassword"
      );

    if (passwordInput) {

      passwordInput.addEventListener(
        "keydown",
        event => {

          if (
            event.key === "Enter"
          ) {

            adminLogin();

          }

        }
      );

    }

  }
);