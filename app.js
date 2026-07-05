const dataUrl = "./data/hotels.json";

let hotels = [];
let sortMode = "rank";

const money = (value) =>
  typeof value === "number"
    ? `¥${value.toLocaleString("ja-JP")}`
    : "未取得";

const scoreText = (value) => `${value.toFixed(1)} / 5.0`;

async function loadData({ bustCache = false } = {}) {
  const suffix = bustCache ? `?ts=${Date.now()}` : "";
  const response = await fetch(`${dataUrl}${suffix}`);
  if (!response.ok) {
    throw new Error("データ読み込みに失敗しました。");
  }
  return response.json();
}

function getDisplayPrice(hotel) {
  if (typeof hotel.pricing.qualifyingFrom === "number") {
    return hotel.pricing.qualifyingFrom;
  }
  if (typeof hotel.pricing.referenceFrom === "number") {
    return hotel.pricing.referenceFrom;
  }
  return Number.POSITIVE_INFINITY;
}

function sortHotels(items) {
  const sorted = [...items];
  if (sortMode === "price") {
    sorted.sort((a, b) => getDisplayPrice(a) - getDisplayPrice(b));
  } else {
    sorted.sort((a, b) => a.rank - b.rank);
  }
  return sorted;
}

function renderSnapshot(snapshot) {
  document.getElementById(
    "snapshot-label"
  ).textContent = `スナップショット: ${snapshot.updatedAt}`;
}

function renderTopSummary(items) {
  const winner = items[0];
  const bestFood = [...items].sort((a, b) => b.scores.food - a.scores.food)[0];
  const bestOnsen = [...items].sort((a, b) => b.scores.onsen - a.scores.onsen)[0];
  const bestBath = [...items].sort((a, b) => b.scores.privateBath - a.scores.privateBath)[0];

  const summaryItems = [
    { label: "総合1位", value: winner.name },
    { label: "食事1位", value: bestFood.name },
    { label: "温泉1位", value: bestOnsen.name },
    { label: "風呂条件1位", value: bestBath.name },
  ];

  document.getElementById("top-summary").innerHTML = summaryItems
    .map(
      (item) => `
        <article class="summary-tile">
          <p class="tile-label">${item.label}</p>
          <p class="tile-value">${item.value}</p>
        </article>
      `
    )
    .join("");
}

function renderRecommendation(items) {
  const [first] = items;
  const foodSorted = [...items].sort((a, b) => b.scores.food - a.scores.food);
  const bestFood = foodSorted[0].id === first.id ? foodSorted[1] ?? foodSorted[0] : foodSorted[0];
  const foodLead =
    bestFood.id === first.id
      ? `食事最優先でも ${bestFood.name}`
      : `食事最優先なら ${bestFood.name}`;
  document.getElementById("recommendation").innerHTML = `
    <div class="recommendation-card">
      <p><strong>おすすめは ${first.name}</strong> です。</p>
      <p class="meta-text">${first.recommendation}</p>
    </div>
    <div class="recommendation-card">
      <p><strong>${foodLead}</strong> も有力です。</p>
      <p class="meta-text">${bestFood.recommendation}</p>
    </div>
  `;
}

function renderTable(items) {
  document.getElementById("compare-table").innerHTML = items
    .map(
      (hotel) => `
        <tr>
          <td>
            <strong>${hotel.name}</strong><br />
            <span class="meta-text">${hotel.rank}位 / ${hotel.bestFor}</span>
          </td>
          <td>${hotel.summary}</td>
          <td>${hotel.pricing.shortLabel}</td>
          <td><span class="badge ${hotel.availability.badgeClass}">${hotel.availability.label}</span></td>
          <td>${scoreText(hotel.scores.food)}</td>
          <td>${scoreText(hotel.scores.onsen)}</td>
          <td>${scoreText(hotel.scores.cleanliness)}</td>
          <td>${scoreText(hotel.scores.privateBath)}</td>
        </tr>
      `
    )
    .join("");
}

function renderMobileMatrix(items) {
  document.getElementById("compare-mobile").innerHTML = items
    .map(
      (hotel) => `
        <article class="mobile-row-card">
          <div class="mobile-row-top">
            <div>
              <span class="rank-chip">${hotel.rank}位</span>
              <h3>${hotel.name}</h3>
            </div>
            <span class="badge ${hotel.availability.badgeClass}">${hotel.availability.label}</span>
          </div>
          <p class="mobile-row-summary">${hotel.summary}</p>
          <dl class="mobile-spec-list">
            <div>
              <dt>料金</dt>
              <dd>${hotel.pricing.shortLabel}</dd>
            </div>
            <div>
              <dt>食事</dt>
              <dd>${scoreText(hotel.scores.food)}</dd>
            </div>
            <div>
              <dt>温泉</dt>
              <dd>${scoreText(hotel.scores.onsen)}</dd>
            </div>
            <div>
              <dt>綺麗さ</dt>
              <dd>${scoreText(hotel.scores.cleanliness)}</dd>
            </div>
            <div>
              <dt>貸切 / 客室風呂</dt>
              <dd>${scoreText(hotel.scores.privateBath)}</dd>
            </div>
          </dl>
        </article>
      `
    )
    .join("");
}

function linkButton(label, href) {
  return `<a class="link-button" href="${href}" target="_blank" rel="noopener noreferrer">${label}</a>`;
}

function renderCards(items) {
  document.getElementById("hotel-cards").innerHTML = items
    .map(
      (hotel) => `
        <article class="hotel-card">
          <div class="hotel-top">
            <div>
              <span class="rank-chip">${hotel.rank}位</span>
              <h2>${hotel.name}</h2>
              <p class="best-for">向いている人: ${hotel.bestFor}</p>
            </div>
            <span class="badge ${hotel.availability.badgeClass}">${hotel.availability.label}</span>
          </div>

          <div class="score-strip">
            <div class="score-pill">
              <span class="pill-label">食事</span>
              <span class="pill-score">${scoreText(hotel.scores.food)}</span>
            </div>
            <div class="score-pill">
              <span class="pill-label">温泉</span>
              <span class="pill-score">${scoreText(hotel.scores.onsen)}</span>
            </div>
            <div class="score-pill">
              <span class="pill-label">綺麗さ</span>
              <span class="pill-score">${scoreText(hotel.scores.cleanliness)}</span>
            </div>
            <div class="score-pill">
              <span class="pill-label">貸切 / 客室風呂</span>
              <span class="pill-score">${scoreText(hotel.scores.privateBath)}</span>
            </div>
          </div>

          <div class="detail-grid">
            <section class="detail-box">
              <h3>料金 / 予約状況</h3>
              <p>${hotel.pricing.detail}</p>
              <p class="muted">${hotel.availability.detail}</p>
              <p class="muted">キャンセル: ${hotel.cancellation}</p>
            </section>

            <section class="detail-box">
              <h3>立地</h3>
              <p>${hotel.location.summary}</p>
              <ul class="detail-list">
                ${hotel.location.highlights.map((item) => `<li>${item}</li>`).join("")}
              </ul>
              <div class="link-buttons">
                ${linkButton("Google Maps", hotel.location.mapsUrl)}
              </div>
            </section>

            <section class="detail-box">
              <h3>設備と食事</h3>
              <ul class="detail-list">
                ${hotel.facilities.map((item) => `<li>${item}</li>`).join("")}
              </ul>
            </section>

            <section class="detail-box">
              <h3>比較メモ</h3>
              <ul class="detail-list">
                ${hotel.comparisonNotes.map((item) => `<li>${item}</li>`).join("")}
              </ul>
            </section>
          </div>

          <div class="meta-block">
            <div>
              <strong>予約導線</strong>
              <div class="link-buttons">
                ${linkButton("公式", hotel.booking.official)}
                ${linkButton("楽天で探す", hotel.booking.rakutenSearch)}
                ${linkButton("じゃらんで探す", hotel.booking.jalanSearch)}
              </div>
            </div>
            <div>
              <strong>出典メモ</strong>
              <ul class="source-list">
                ${hotel.sources.map((source) => `<li><a href="${source.url}" target="_blank" rel="noopener noreferrer">${source.label}</a></li>`).join("")}
              </ul>
            </div>
          </div>
        </article>
      `
    )
    .join("");
}

function render() {
  const rankedItems = [...hotels].sort((a, b) => a.rank - b.rank);
  const displayItems = sortHotels(hotels);
  renderTopSummary(rankedItems);
  renderRecommendation(rankedItems);
  renderTable(displayItems);
  renderMobileMatrix(displayItems);
  renderCards(displayItems);
}

async function initialize() {
  const payload = await loadData({ bustCache: true });
  hotels = payload.hotels;
  renderSnapshot(payload.snapshot);
  render();
}

document.getElementById("sort-price").addEventListener("click", () => {
  sortMode = sortMode === "price" ? "rank" : "price";
  document.getElementById("sort-price").textContent =
    sortMode === "price" ? "おすすめ順に戻す" : "価格で並び替え";
  render();
});

document.getElementById("refresh-availability").addEventListener("click", async () => {
  const button = document.getElementById("refresh-availability");
  button.disabled = true;
  button.textContent = "更新中…";
  try {
    const payload = await loadData({ bustCache: true });
    hotels = payload.hotels;
    renderSnapshot(payload.snapshot);
    render();
  } finally {
    button.disabled = false;
    button.textContent = "予約状況を更新";
  }
});

document.getElementById("save-pdf").addEventListener("click", () => {
  window.print();
});

initialize().catch((error) => {
  document.getElementById("recommendation").innerHTML = `<p>${error.message}</p>`;
});
