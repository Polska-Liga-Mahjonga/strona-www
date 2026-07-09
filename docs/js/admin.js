const API = {
    adminContent: "/api/cms-admin/content",
    seed: "/api/cms-admin/seed"
};

const state = {
    items: [],
    filtered: []
};

const form = document.getElementById("content-form");
const authStatus = document.getElementById("auth-status");
const tbody = document.getElementById("items-tbody");
const typeFilter = document.getElementById("type-filter");
const searchFilter = document.getElementById("search-filter");

function setStatus(message, isError = false) {
    if (!authStatus) return;
    authStatus.textContent = message;
    authStatus.style.borderLeftColor = isError ? "#c41e3a" : "var(--primary-color)";
}

function tryParseJson(value) {
    if (!value || !value.trim()) return undefined;
    try {
        const parsed = JSON.parse(value);
        if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
            throw new Error("JSON musi być obiektem.");
        }
        return parsed;
    } catch (error) {
        throw new Error("Pole 'Dodatkowe dane JSON' ma niepoprawny format.");
    }
}

function collectFormPayload() {
    return {
        type: document.getElementById("item-type").value,
        slug: document.getElementById("item-slug").value,
        title: document.getElementById("item-title").value,
        excerpt: document.getElementById("item-excerpt").value,
        body: document.getElementById("item-body").value,
        imageUrl: document.getElementById("item-image-url").value,
        data: tryParseJson(document.getElementById("item-data").value),
        order: Number(document.getElementById("item-order").value || 0),
        published: document.getElementById("item-published").checked
    };
}

function fillForm(item) {
    document.getElementById("item-id").value = item.id;
    document.getElementById("item-type").value = item.type || "";
    document.getElementById("item-slug").value = item.slug || "";
    document.getElementById("item-title").value = item.title || "";
    document.getElementById("item-excerpt").value = item.excerpt || "";
    document.getElementById("item-body").value = item.body || "";
    document.getElementById("item-image-url").value = item.imageUrl || "";
    document.getElementById("item-order").value = item.order ?? 0;
    document.getElementById("item-published").checked = Boolean(item.published);
    document.getElementById("item-data").value = item.data ? JSON.stringify(item.data, null, 2) : "";
    document.getElementById("save-btn").textContent = "Zapisz zmiany";
}

function resetForm() {
    form.reset();
    document.getElementById("item-id").value = "";
    document.getElementById("item-order").value = 0;
    document.getElementById("item-published").checked = true;
    document.getElementById("save-btn").textContent = "Zapisz";
}

function applyFilters() {
    const type = typeFilter.value.trim();
    const search = searchFilter.value.trim().toLowerCase();

    state.filtered = state.items.filter((item) => {
        if (type && item.type !== type) return false;
        if (!search) return true;

        const haystack = `${item.title || ""} ${item.slug || ""} ${item.type || ""}`.toLowerCase();
        return haystack.includes(search);
    });

    renderTable();
}

function renderTable() {
    tbody.innerHTML = "";

    if (state.filtered.length === 0) {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td colspan="5" class="muted">Brak wyników</td>`;
        tbody.appendChild(tr);
        return;
    }

    for (const item of state.filtered) {
        const tr = document.createElement("tr");
        const updated = item.updatedAt ? new Date(item.updatedAt).toLocaleString("pl-PL") : "-";

        tr.innerHTML = `
            <td>
                <div><strong>${item.type || "-"}</strong></div>
                <div class="muted">${item.slug || "-"}</div>
            </td>
            <td>${item.title || "-"}</td>
            <td>${item.published ? "Opublikowane" : "Szkic"}</td>
            <td>${updated}</td>
            <td>
                <div class="row-actions">
                    <button class="edit" data-action="edit" data-id="${item.id}">Edytuj</button>
                    <button class="delete" data-action="delete" data-id="${item.id}">Usuń</button>
                </div>
            </td>
        `;

        tbody.appendChild(tr);
    }
}

async function apiRequest(url, options = {}) {
    const response = await fetch(url, {
        headers: {
            "Content-Type": "application/json"
        },
        ...options
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok || data.ok === false) {
        throw new Error(data.error || `Błąd API (${response.status})`);
    }

    return data;
}

async function loadItems() {
    const type = typeFilter.value.trim();
    const url = type ? `${API.adminContent}?type=${encodeURIComponent(type)}` : API.adminContent;

    setStatus("Pobieranie treści...");

    try {
        const data = await apiRequest(url, { method: "GET" });
        state.items = Array.isArray(data.items) ? data.items : [];
        applyFilters();
        setStatus(`Załadowano ${state.items.length} wpisów.`);
    } catch (error) {
        setStatus(`Błąd pobierania: ${error.message}`, true);
    }
}

async function saveItem(event) {
    event.preventDefault();

    let payload;
    try {
        payload = collectFormPayload();
    } catch (error) {
        setStatus(error.message, true);
        return;
    }

    const id = document.getElementById("item-id").value;
    const isEdit = Boolean(id);

    try {
        setStatus(isEdit ? "Zapisywanie zmian..." : "Tworzenie wpisu...");
        if (isEdit) {
            await apiRequest(`${API.adminContent}/${encodeURIComponent(id)}`, {
                method: "PUT",
                body: JSON.stringify(payload)
            });
        } else {
            await apiRequest(API.adminContent, {
                method: "POST",
                body: JSON.stringify(payload)
            });
        }

        resetForm();
        await loadItems();
        setStatus(isEdit ? "Zaktualizowano wpis." : "Utworzono wpis.");
    } catch (error) {
        setStatus(`Błąd zapisu: ${error.message}`, true);
    }
}

async function removeItem(id) {
    const confirmed = window.confirm("Na pewno usunąć wpis?");
    if (!confirmed) return;

    try {
        setStatus("Usuwanie wpisu...");
        await apiRequest(`${API.adminContent}/${encodeURIComponent(id)}`, {
            method: "DELETE"
        });

        await loadItems();
        setStatus("Usunięto wpis.");
    } catch (error) {
        setStatus(`Błąd usuwania: ${error.message}`, true);
    }
}

async function seedContent() {
    const confirmed = window.confirm("Wgrać dane startowe CMS? Brakujące wpisy zostaną dodane.");
    if (!confirmed) return;

    try {
        setStatus("Seedowanie danych...");
        const data = await apiRequest(API.seed, { method: "POST" });
        await loadItems();
        setStatus(`Seed zakończony: dodano ${data.inserted}, pominięto ${data.skipped}.`);
    } catch (error) {
        setStatus(`Błąd seedowania: ${error.message}`, true);
    }
}

async function loadProfile() {
    try {
        const response = await fetch("/.auth/me");
        if (!response.ok) {
            setStatus("Sesja użytkownika nie jest aktywna.", true);
            return;
        }

        const data = await response.json();
        const principal = Array.isArray(data) ? data[0]?.clientPrincipal : data?.clientPrincipal;

        if (!principal) {
            setStatus("Brak danych profilu uwierzytelniania.", true);
            return;
        }

        const roles = Array.isArray(principal.userRoles) ? principal.userRoles.join(", ") : "-";
        setStatus(`Zalogowano: ${principal.userDetails || principal.userId || "użytkownik"}. Role: ${roles}`);
    } catch {
        setStatus("Nie udało się odczytać profilu z /.auth/me.", true);
    }
}

function wireEvents() {
    form.addEventListener("submit", saveItem);

    document.getElementById("reset-btn").addEventListener("click", resetForm);
    document.getElementById("refresh-btn").addEventListener("click", loadItems);
    document.getElementById("seed-btn").addEventListener("click", seedContent);
    typeFilter.addEventListener("change", applyFilters);
    searchFilter.addEventListener("input", applyFilters);

    tbody.addEventListener("click", (event) => {
        const button = event.target.closest("button[data-action]");
        if (!button) return;

        const action = button.getAttribute("data-action");
        const id = button.getAttribute("data-id");
        if (!id) return;

        if (action === "edit") {
            const item = state.items.find((entry) => entry.id === id);
            if (item) {
                fillForm(item);
            }
            return;
        }

        if (action === "delete") {
            void removeItem(id);
        }
    });
}

window.addEventListener("DOMContentLoaded", async () => {
    wireEvents();
    await loadProfile();
    await loadItems();
});
