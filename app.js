document.addEventListener("DOMContentLoaded", function () {
  const userIcon = document.getElementById("userIcon");
  const signInModal = document.getElementById("signInModal");
  const closeModal = document.getElementById("closeModal");

  userIcon.addEventListener("click", function (e) {
    e.preventDefault();
    signInModal.classList.add("is-open");
  });

  closeModal.addEventListener("click", function () {
    signInModal.classList.remove("is-open");
  });

  window.addEventListener("click", function (e) {
    if (e.target === signInModal) signInModal.classList.remove("is-open");
  });

  const homeLink = document.getElementById("homeLink");
  const allListingsLink = document.getElementById("allListingsLink");
  const addListingLink = document.getElementById("addListingLink");
  const listingsView = document.getElementById("listingsView");
  const newListingView = document.getElementById("newListingView");
  const listingsContainer = document.getElementById("listingsContainer");
  const pagination = document.getElementById("pagination");
  const newListingForm = document.getElementById("newListingForm");

  // Load every listing from data.js. Each page displays exactly 9 cards (except the last page).
  const listings = [...(window.sampleListings || [])];
  const cardsPerPage = 9;
  let currentPage = 1;

  function renderListings() {
    const totalPages = Math.ceil(listings.length / cardsPerPage);
    if (totalPages === 0) {
      listingsContainer.innerHTML = '<p class="text-muted">No listings available.</p>';
      pagination.innerHTML = "";
      return;
    }

    if (currentPage > totalPages) currentPage = totalPages;
    const startIndex = (currentPage - 1) * cardsPerPage;
    const pageListings = listings.slice(startIndex, startIndex + cardsPerPage);

    listingsContainer.innerHTML = pageListings.map((listing) => `
      <div class="col">
        <div class="card listing-card h-100">
          <img
            src="${escapeHTML(listing.image.url)}"
            class="card-img-top listing-card-image"
            alt="${escapeHTML(listing.title)}"
            loading="lazy"
          />
          <div class="card-body">
            <h5 class="card-title">${escapeHTML(listing.title)}</h5>
            <p class="card-text mb-1"><i class="fa-solid fa-location-dot"></i>
              ${escapeHTML(listing.location || "")}, ${escapeHTML(listing.country || "")}
            </p>
            <p class="card-text"><strong>$${Number(listing.price).toLocaleString("en-US")}</strong> / night</p>
          </div>
        </div>
      </div>
    `).join("");

    renderPagination(totalPages);
  }

  // Escape text before inserting listing data into HTML.
  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, function (character) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character];
    });
  }

  function renderPagination(totalPages) {
    let buttons = `
      <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
        <button class="page-link" type="button" data-page="${currentPage - 1}" ${currentPage === 1 ? "disabled" : ""}>Previous</button>
      </li>`;

    for (let page = 1; page <= totalPages; page++) {
      buttons += `
        <li class="page-item ${page === currentPage ? "active" : ""}">
          <button class="page-link" type="button" data-page="${page}" ${page === currentPage ? 'aria-current="page"' : ""}>${page}</button>
        </li>`;
    }

    buttons += `
      <li class="page-item ${currentPage === totalPages ? "disabled" : ""}">
        <button class="page-link" type="button" data-page="${currentPage + 1}" ${currentPage === totalPages ? "disabled" : ""}>Next</button>
      </li>`;

    pagination.innerHTML = buttons;
  }

  pagination.addEventListener("click", function (e) {
    const button = e.target.closest("button[data-page]");
    if (!button || button.disabled) return;
    currentPage = Number(button.dataset.page);
    renderListings();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  function showHome() {
    listingsView.classList.remove("d-none");
    newListingView.classList.add("d-none");
    renderListings();
  }

  function showAddListing() {
    listingsView.classList.add("d-none");
    newListingView.classList.remove("d-none");
  }

  homeLink.addEventListener("click", function (e) {
    e.preventDefault();
    showHome();
  });

  allListingsLink.addEventListener("click", function (e) {
    e.preventDefault();
    showHome();
  });

  addListingLink.addEventListener("click", function (e) {
    e.preventDefault();
    showAddListing();
  });

  newListingForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const title = document.getElementById("title").value.trim();
    const image = document.getElementById("image").value.trim();
    const price = Number(document.getElementById("price").value);

    // Keep the existing form working; newly added listings appear at the start.
    listings.unshift({
      title,
      description: "",
      image: { filename: "listingimage", url: image },
      price,
      location: "",
      country: ""
    });

    currentPage = 1;
    newListingForm.reset();
    showHome();
  });

  renderListings();
});
