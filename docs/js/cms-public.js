const CMS_API_BASE = "/api/content";

async function fetchCmsList(type, limit = 100) {
    const url = `${CMS_API_BASE}?type=${encodeURIComponent(type)}&limit=${limit}`;

    try {
        const response = await fetch(url);
        if (!response.ok) return [];
        const data = await response.json();
        if (!data?.ok || !Array.isArray(data.items)) return [];
        return data.items;
    } catch {
        return [];
    }
}

function escapeHtml(value) {
    const str = String(value ?? "");
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function formatDateLabel(input) {
    if (!input) return "";
    const parsed = new Date(input);
    if (Number.isNaN(parsed.getTime())) {
        return String(input);
    }

    return parsed.toLocaleDateString("pl-PL", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    });
}

function monthShortPl(input) {
    const parsed = new Date(input);
    if (Number.isNaN(parsed.getTime())) return "---";

    return parsed.toLocaleDateString("pl-PL", {
        month: "short"
    }).replace(".", "");
}

function renderHomeEvents(items) {
    const container = document.getElementById("home-events-list");
    if (!container || items.length === 0) return;

    container.innerHTML = items.map((item) => {
        const date = item?.data?.date;
        const location = item?.data?.location || "Do potwierdzenia";
        const time = item?.data?.time || "Do potwierdzenia";
        const day = date ? String(new Date(date).getDate()).padStart(2, "0") : "--";
        const month = date ? monthShortPl(date) : "---";

        return `
            <div class="event-card">
                <div class="event-date">
                    <span class="day">${escapeHtml(day)}</span>
                    <span class="month">${escapeHtml(month)}</span>
                </div>
                <div class="event-details">
                    <h3>${escapeHtml(item.title)}</h3>
                    <p><i class="fas fa-map-marker-alt"></i> ${escapeHtml(location)}</p>
                    <p><i class="fas fa-clock"></i> ${escapeHtml(time)}</p>
                    <a href="events.html" class="btn btn-small">Szczegóły</a>
                </div>
            </div>
        `;
    }).join("");
}

function renderHomeNews(items) {
    const container = document.getElementById("home-news-list");
    if (!container || items.length === 0) return;

    container.innerHTML = items.map((item) => {
        const image = item.imageUrl ? `<img src="${escapeHtml(item.imageUrl)}" alt="${escapeHtml(item.title)}">` : "";
        const date = formatDateLabel(item?.data?.date || item.updatedAt);

        return `
            <article class="news-card">
                <div class="news-image">
                    ${image}
                </div>
                <div class="news-content">
                    <span class="news-date">${escapeHtml(date)}</span>
                    <h3>${escapeHtml(item.title)}</h3>
                    <p>${escapeHtml(item.excerpt || "")}</p>
                    <a href="news.html" class="read-more">Czytaj więcej →</a>
                </div>
            </article>
        `;
    }).join("");
}

function statusBadgeClass(status) {
    const normalized = String(status || "").toLowerCase();
    if (normalized === "soon") return "is-soon";
    if (normalized === "public") return "is-public";
    return "is-open";
}

function statusBadgeLabel(status) {
    const normalized = String(status || "").toLowerCase();
    if (normalized === "soon") return "Wkrótce rejestracja";
    if (normalized === "public") return "Otwarte dla wszystkich";
    return "Rejestracja otwarta";
}

function renderEventsPage(items) {
    const container = document.getElementById("events-page-list");
    if (!container || items.length === 0) return;

    container.innerHTML = items.map((item) => {
        const dateLabel = formatDateLabel(item?.data?.date);
        const time = item?.data?.time || "Do potwierdzenia";
        const location = item?.data?.location || "Do potwierdzenia";
        const maxParticipants = item?.data?.maxParticipants || "-";
        const badgeClass = statusBadgeClass(item?.data?.status);
        const badgeLabel = statusBadgeLabel(item?.data?.status);

        return `
            <div class="event-detail-card">
                <div class="event-header">
                    <div class="event-title">
                        <h2>${escapeHtml(item.title)}</h2>
                        <p>${escapeHtml(item.excerpt || "")}</p>
                    </div>
                    <div class="event-badge ${escapeHtml(badgeClass)}">${escapeHtml(badgeLabel)}</div>
                </div>

                <div class="event-meta">
                    <div class="meta-item">
                        <i class="fas fa-calendar"></i>
                        <div>
                            <strong>Data</strong>
                            <p>${escapeHtml(dateLabel)}</p>
                        </div>
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-clock"></i>
                        <div>
                            <strong>Godzina</strong>
                            <p>${escapeHtml(time)}</p>
                        </div>
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <div>
                            <strong>Miejsce</strong>
                            <p>${escapeHtml(location)}</p>
                        </div>
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-users"></i>
                        <div>
                            <strong>Uczestnicy</strong>
                            <p>Maksymalnie ${escapeHtml(maxParticipants)} graczy</p>
                        </div>
                    </div>
                </div>

                <h3>Opis</h3>
                <p>${escapeHtml(item.body || item.excerpt || "Szczegóły wydarzenia będą dostępne wkrótce.")}</p>

                <div class="registration-box">
                    <h3>Rejestracja</h3>
                    <p>W celu rejestracji skontaktuj się z organizatorem wydarzenia.</p>
                    <a href="contact.html" class="btn btn-primary">Zarejestruj się</a>
                </div>
            </div>
        `;
    }).join("");
}

function renderNewsPage(items) {
    if (items.length === 0) return;

    const featuredWrap = document.getElementById("news-featured-card");
    const listWrap = document.getElementById("news-page-list");
    if (!featuredWrap || !listWrap) return;

    const featured = items.find((item) => item?.data?.featured) || items[0];
    const rest = items.filter((item) => item.id !== featured.id);

    const featuredImage = featured.imageUrl ? `<img src="${escapeHtml(featured.imageUrl)}" alt="${escapeHtml(featured.title)}">` : "🏆";

    featuredWrap.innerHTML = `
        <div class="article-header article-header-left">
            <span class="article-date">${escapeHtml(formatDateLabel(featured?.data?.date || featured.updatedAt))}</span>
            <h2 class="article-title article-title-compact">${escapeHtml(featured.title)}</h2>
        </div>
        <div class="news-image featured-news-image">${featuredImage}</div>
        <div class="article-content article-content-plain">
            <p>${escapeHtml(featured.body || featured.excerpt || "")}</p>
        </div>
    `;

    listWrap.innerHTML = rest.map((item) => {
        const image = item.imageUrl ? `<img src="${escapeHtml(item.imageUrl)}" alt="${escapeHtml(item.title)}">` : "📰";

        return `
            <article class="news-card">
                <div class="news-image">${image}</div>
                <div class="news-content">
                    <span class="news-date">${escapeHtml(formatDateLabel(item?.data?.date || item.updatedAt))}</span>
                    <h3>${escapeHtml(item.title)}</h3>
                    <p>${escapeHtml(item.excerpt || "")}</p>
                    <a href="#" class="read-more">Czytaj więcej →</a>
                </div>
            </article>
        `;
    }).join("");
}

function renderTeamPage(items) {
    if (items.length === 0) return;

    const boardWrap = document.getElementById("team-board-list");
    const coordinatorsWrap = document.getElementById("team-coordinators-list");
    if (!boardWrap || !coordinatorsWrap) return;

    const board = items.filter((item) => String(item?.data?.group || "").toLowerCase() === "board");
    const coordinators = items.filter((item) => String(item?.data?.group || "").toLowerCase() === "coordinators");

    const renderCard = (item) => `
        <div class="team-member">
            <div class="member-photo">👤</div>
            <div class="member-info">
                <h3>${escapeHtml(item.title)}</h3>
                <p class="member-role">${escapeHtml(item?.data?.role || item.excerpt || "")}</p>
                <p class="member-bio">${escapeHtml(item.body || item.excerpt || "")}</p>
            </div>
        </div>
    `;

    if (board.length > 0) {
        boardWrap.innerHTML = board.map(renderCard).join("");
    }

    if (coordinators.length > 0) {
        coordinatorsWrap.innerHTML = coordinators.map(renderCard).join("");
    }
}

async function bootstrapCms() {
    const [events, news, team] = await Promise.all([
        fetchCmsList("event", 50),
        fetchCmsList("news", 50),
        fetchCmsList("team", 50)
    ]);

    renderHomeEvents(events.slice(0, 3));
    renderHomeNews(news.slice(0, 3));
    renderEventsPage(events);
    renderNewsPage(news);
    renderTeamPage(team);
}

window.addEventListener("DOMContentLoaded", () => {
    void bootstrapCms();
});
