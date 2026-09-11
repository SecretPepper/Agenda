"use strict";

/* ==========================================
STORAGE
========================================== */

const TASKS_KEY = "myAgenda_tasks";
const THEME_KEY = "myAgenda_theme";
const LANGUAGE_KEY = "myAgenda_language";
const ALARM_SOUND_KEY = "myAgenda_alarmSound";
const HOME_SHORTCUTS_KEY = "myAgenda_homeShortcuts";

/* ==========================================
DATA
========================================== */

let tasks = [];

try {
    tasks =
        JSON.parse(
            localStorage.getItem(TASKS_KEY)
        ) || [];
} catch {
    tasks = [];
}

let selectedDate = new Date();
let editingTaskId = null;
let alarmTimer = null;
let alarmAudioUnlocked = false;
let previewingAlarmSound = null;

let homeShortcuts = [];

try {
    homeShortcuts = JSON.parse(
        localStorage.getItem(HOME_SHORTCUTS_KEY)
    ) || [];
} catch {
    homeShortcuts = [];
}

/* ==========================================
ELEMENTS
========================================== */

const activitySearch =
    document.getElementById("activitySearch");

const clearSearch =
    document.getElementById("clearSearch");

const dateTitle =
    document.getElementById("dateTitle");

const dateSubtitle =
    document.getElementById("dateSubtitle");

const timeline =
    document.getElementById("timeline");

const emptyMessage =
    document.getElementById("emptyMessage");

const pastNotice =
    document.getElementById("pastNotice");

const previousDay =
    document.getElementById("previousDay");

const nextDay =
    document.getElementById("nextDay");

const todayBtn =
    document.getElementById("todayBtn");

const todaySidebar =
    document.getElementById("todaySidebar");

const addTaskBtn =
    document.getElementById("addTaskBtn");

const emptyAddButton =
    document.getElementById("emptyAddButton");

const modal =
    document.getElementById("modal");

const closeModal =
    document.getElementById("closeModal");

const taskForm =
    document.getElementById("taskForm");

const taskTitle =
    document.getElementById("taskTitle");

const taskDescription =
    document.getElementById("taskDescription");

const taskStart =
    document.getElementById("taskStart");

const taskEnd =
    document.getElementById("taskEnd");

const taskColor =
    document.getElementById("taskColor");

const taskAlarm =
    document.getElementById("taskAlarm");

const timeError =
    document.getElementById("timeError");

const settingsBtn =
    document.getElementById("settingsBtn");

const settingsModal =
    document.getElementById("settingsModal");

const closeSettings =
    document.getElementById("closeSettings");

const darkModeToggle =
    document.getElementById("darkModeToggle");

const languageSelect =
    document.getElementById("languageSelect");

const alarmSoundSelect =
    document.getElementById("alarmSoundSelect");

const alarmPreviewButtons =
    document.querySelectorAll("[data-preview-alarm]");

const alarmChooseButtons =
    document.querySelectorAll("[data-choose-alarm]");

/* ==========================================
TRANSLATIONS
========================================== */

const translations = {

    en: {

        appName: "Agenda",
        appSubtitle: "Plan your day",

        today: "Today",

        stayOrganized: "Stay organized",

        stayOrganizedText:
            "Plan your time and get things done.",

        settings: "Settings",

        yourDay: "YOUR DAY",

        pastDay: "Past day",

        pastDayText:
            "This day is read-only. You can look back at your plans, but you can't change them.",

        nothingPlanned:
            "Nothing planned",

        freeDay:
            "Your day is completely free.",

        addActivity:
            "Add activity",

        newActivity:
            "NEW ACTIVITY",

        editActivity:
            "EDIT ACTIVITY",

        addActivityTitle:
            "Add activity",

        editActivityTitle:
            "Edit activity",

        activity:
            "Activity",

        activityPlaceholder:
            "e.g. Study mathematics",

        description:
            "Description",

        descriptionPlaceholder:
            "What are you going to do?",

        start:
            "Start",

        end:
            "End",

        color:
            "Color",

        blue: "Blue",
        purple: "Purple",
        green: "Green",
        orange: "Orange",
        pink: "Pink",
        red: "Red",

        addToAgenda:
            "Add to agenda",

        saveChanges:
            "Save changes",

        preferences:
            "PREFERENCES",

        darkMode:
            "Dark mode",

        darkModeText:
            "Use a darker appearance.",

        language:
            "Language",

        languageText:
            "Choose your preferred language.",

        alarm:
            "Alarm",

        noAlarm:
            "No alarm",

        atStart:
            "At start time",

        fiveMinutes:
            "5 minutes before",

        tenMinutes:
            "10 minutes before",

        fifteenMinutes:
            "15 minutes before",

        thirtyMinutes:
            "30 minutes before",

        oneHour:
            "1 hour before",

        alarmSound:
            "Alarm sound",

        alarmSoundText:
            "Choose the sound used for your activity alarms.",

        alarm1:
            "Alarm 1",

        alarm2:
            "Alarm 2",

        alarm3:
            "Alarm 3",

        endTimeError:
            "The end time must be later than the start time.",

        previousDay:
            "Previous day",

        nextDay:
            "Next day",

        complete:
            "Complete",

        undo:
            "Undo",

        edit:
            "Edit",

        delete:
            "Delete",

        alarmNotification:
            "Activity starting",

        searchActivities:
            "Search activities...",

        addHomeScreen:
            "Add to home screen",

        removeHomeScreen:
            "Remove from home screen",

        shortcutSetup:
            "HOME SCREEN SHORTCUT",

        shortcutTitle:
            "Add this activity to your Home Screen",

        shortcutText:
            "Android does not allow a website to place a launcher icon automatically. Open this activity, then use your browser menu and choose Add to Home screen.",

        shortcutStepOne:
            "Open this activity",

        shortcutStepTwo:
            "Open the browser menu",

        shortcutStepThree:
            "Choose Add to Home screen",

        removeShortcutTitle:
            "Remove this activity shortcut",

        removeShortcutText:
            "Android controls launcher icons. Use your Home Screen or launcher settings to remove the icon. You can also remove this activity from Agenda's shortcut list here.",

        removeShortcutTracking:
            "Remove from Agenda"

    },

    nl: {

        appName: "Agenda",
        appSubtitle: "Plan je dag",

        today: "Vandaag",

        stayOrganized:
            "Blijf georganiseerd",

        stayOrganizedText:
            "Plan je tijd en krijg dingen gedaan.",

        settings: "Instellingen",

        yourDay: "JOUW DAG",

        pastDay: "Afgelopen dag",

        pastDayText:
            "Deze dag is alleen-lezen. Je kunt je plannen bekijken, maar ze niet aanpassen.",

        nothingPlanned:
            "Niets gepland",

        freeDay:
            "Je dag is helemaal vrij.",

        addActivity:
            "Activiteit toevoegen",

        newActivity:
            "NIEUWE ACTIVITEIT",

        editActivity:
            "ACTIVITEIT BEWERKEN",

        addActivityTitle:
            "Activiteit toevoegen",

        editActivityTitle:
            "Activiteit bewerken",

        activity:
            "Activiteit",

        activityPlaceholder:
            "bijv. Wiskunde leren",

        description:
            "Beschrijving",

        descriptionPlaceholder:
            "Wat ga je doen?",

        start: "Begin",
        end: "Einde",
        color: "Kleur",

        blue: "Blauw",
        purple: "Paars",
        green: "Groen",
        orange: "Oranje",
        pink: "Roze",
        red: "Rood",

        addToAgenda:
            "Toevoegen aan agenda",

        saveChanges:
            "Wijzigingen opslaan",

        preferences:
            "VOORKEUREN",

        darkMode:
            "Donkere modus",

        darkModeText:
            "Gebruik een donker uiterlijk.",

        language:
            "Taal",

        languageText:
            "Kies je voorkeurstaal.",

        alarm: "Alarm",

        noAlarm:
            "Geen alarm",

        atStart:
            "Op begintijd",

        fiveMinutes:
            "5 minuten van tevoren",

        tenMinutes:
            "10 minuten van tevoren",

        fifteenMinutes:
            "15 minuten van tevoren",

        thirtyMinutes:
            "30 minuten van tevoren",

        oneHour:
            "1 uur van tevoren",

        alarmSound:
            "Alarmgeluid",

        alarmSoundText:
            "Kies het geluid voor je activiteit-alarmen.",

        alarm1: "Alarm 1",
        alarm2: "Alarm 2",
        alarm3: "Alarm 3",

        endTimeError:
            "De eindtijd moet later zijn dan de begintijd.",

        previousDay:
            "Vorige dag",

        nextDay:
            "Volgende dag",

        complete:
            "Voltooien",

        undo:
            "Ongedaan maken",

        edit:
            "Bewerken",

        delete:
            "Verwijderen",

        alarmNotification:
            "Activiteit begint",

        searchActivities:
            "Activiteiten zoeken...",

        addHomeScreen:
            "Aan startscherm toevoegen",

        removeHomeScreen:
            "Van startscherm verwijderen",

        shortcutSetup:
            "STARTSCHERM-SNELKOPPELING",

        shortcutTitle:
            "Deze activiteit aan je startscherm toevoegen",

        shortcutText:
            "Android staat websites niet toe om automatisch een pictogram op je startscherm te plaatsen. Open deze activiteit en gebruik daarna het browsermenu om Aan startscherm toevoegen te kiezen.",

        shortcutStepOne:
            "Open deze activiteit",

        shortcutStepTwo:
            "Open het browsermenu",

        shortcutStepThree:
            "Kies Aan startscherm toevoegen",

        removeShortcutTitle:
            "Deze activiteitssnelkoppeling verwijderen",

        removeShortcutText:
            "Android beheert pictogrammen op het startscherm. Verwijder het pictogram via je startscherm of launcherinstellingen. Je kunt de activiteit hier ook uit de snelkoppelingenlijst van Agenda verwijderen.",

        removeShortcutTracking:
            "Uit Agenda verwijderen"

    }

};

let currentLanguage =
    localStorage.getItem(LANGUAGE_KEY) || "en";

let selectedAlarmSound =
    localStorage.getItem(ALARM_SOUND_KEY) || "1";

/* ==========================================
TRANSLATION
========================================== */

function translatePage() {

    const language =
        translations[currentLanguage] ||
        translations.en;

    document
        .querySelectorAll("[data-i18n]")
        .forEach(element => {

            const key =
                element.dataset.i18n;

            if (language[key]) {
                element.textContent =
                    language[key];
            }

        });

    document
        .querySelectorAll(
            "[data-i18n-placeholder]"
        )
        .forEach(element => {

            const key =
                element.dataset.i18nPlaceholder;

            if (language[key]) {
                element.placeholder =
                    language[key];
            }

        });

    if (previousDay) {
        previousDay.title =
            language.previousDay;
    }

    if (nextDay) {
        nextDay.title =
            language.nextDay;
    }

    document.documentElement.lang =
        currentLanguage;

    updateDateDisplay();
    renderTasks();
}

/* ==========================================
LANGUAGE
========================================== */

if (languageSelect) {

    languageSelect.value =
        currentLanguage;

    languageSelect.addEventListener(
        "change",
        () => {

            currentLanguage =
                languageSelect.value;

            if (!translations[currentLanguage]) {
                currentLanguage = "en";
            }

            localStorage.setItem(
                LANGUAGE_KEY,
                currentLanguage
            );

            translatePage();

        }
    );
}

/* ==========================================
DATE HELPERS
========================================== */

function getDateKey(date) {

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            date.getDate()
        ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function isPastDay(date) {

    const today =
        new Date();

    today.setHours(
        0,
        0,
        0,
        0
    );

    const checkDate =
        new Date(date);

    checkDate.setHours(
        0,
        0,
        0,
        0
    );

    return checkDate < today;
}

/* ==========================================
DATE DISPLAY
========================================== */

function updateDateDisplay() {

    if (
        !dateTitle ||
        !dateSubtitle
    ) {
        return;
    }

    const locale =
        currentLanguage === "nl"
            ? "nl-NL"
            : "en-US";

    dateTitle.textContent =
        selectedDate.toLocaleDateString(
            locale,
            {
                weekday: "long",
                month: "long",
                day: "numeric"
            }
        );

    dateSubtitle.textContent =
        selectedDate.toLocaleDateString(
            locale,
            {
                year: "numeric"
            }
        );

    if (isPastDay(selectedDate)) {

        pastNotice?.classList.remove(
            "hidden"
        );

        addTaskBtn?.classList.add(
            "hidden"
        );

        emptyAddButton?.classList.add(
            "hidden"
        );

    } else {

        pastNotice?.classList.add(
            "hidden"
        );

        addTaskBtn?.classList.remove(
            "hidden"
        );
    }
}

/* ==========================================
TIME FORMATTING
========================================== */

function formatTime(time) {

    if (!time) {
        return "";
    }

    const [
        hours,
        minutes
    ] =
        time.split(":").map(Number);

    const date =
        new Date();

    date.setHours(
        hours,
        minutes,
        0,
        0
    );

    return date.toLocaleTimeString(
        currentLanguage === "nl"
            ? "nl-NL"
            : "en-US",
        {
            hour: "numeric",
            minute: "2-digit"
        }
    );
}

function getDuration(start, end) {

    const [
        startHours,
        startMinutes
    ] =
        start.split(":").map(Number);

    const [
        endHours,
        endMinutes
    ] =
        end.split(":").map(Number);

    const startTotal =
        startHours * 60 +
        startMinutes;

    const endTotal =
        endHours * 60 +
        endMinutes;

    const difference =
        endTotal - startTotal;

    if (difference <= 0) {
        return "";
    }

    const hours =
        Math.floor(
            difference / 60
        );

    const minutes =
        difference % 60;

    if (hours === 0) {
        return `${minutes} min`;
    }

    if (minutes === 0) {

        return currentLanguage === "nl"
            ? `${hours} uur`
            : `${hours} hr`;
    }

    return currentLanguage === "nl"
        ? `${hours} uur ${minutes} min`
        : `${hours} hr ${minutes} min`;
}

/* ==========================================
HOME SCREEN ACTIVITY SHORTCUTS
========================================== */

function saveHomeShortcuts() {
    localStorage.setItem(HOME_SHORTCUTS_KEY, JSON.stringify(homeShortcuts));
}

function isHomeShortcut(taskId) {
    return homeShortcuts.includes(String(taskId));
}

function showShortcutDialog(task, removing = false) {

    document.getElementById("shortcutInstructions")?.remove();

    const language = translations[currentLanguage] || translations.en;
    const popup = document.createElement("div");
    popup.id = "shortcutInstructions";

    popup.innerHTML = `
        <div class="shortcut-instructions-box">
            <button class="shortcut-close" id="closeShortcutInstructions" type="button" aria-label="Close">×</button>
            <div class="shortcut-big-icon">📱</div>
            <span class="modal-small-title">${language.shortcutSetup}</span>
            <h2>${escapeHTML(removing ? language.removeShortcutTitle : language.shortcutTitle)}</h2>
            <p>${language.shortcutText}</p>
            ${removing ? `
                <div class="shortcut-steps">
                    <div class="shortcut-step"><span>1</span><div>${language.removeShortcutText}</div></div>
                </div>
                <button class="shortcut-open-button" id="removeShortcutTracking" type="button">${language.removeShortcutTracking}</button>
            ` : `
                <div class="shortcut-steps">
                    <div class="shortcut-step"><span>1</span><div>${language.shortcutStepOne}</div></div>
                    <div class="shortcut-step"><span>2</span><div>${language.shortcutStepTwo}</div></div>
                    <div class="shortcut-step"><span>3</span><div>${language.shortcutStepThree}</div></div>
                </div>
                <button class="shortcut-open-button" id="openActivityShortcut" type="button">${language.shortcutStepOne}</button>
            `}
        </div>`;

    document.body.appendChild(popup);

    document.getElementById("closeShortcutInstructions")?.addEventListener("click", () => popup.remove());
    popup.addEventListener("click", event => { if (event.target === popup) popup.remove(); });

    document.getElementById("openActivityShortcut")?.addEventListener("click", () => {
        popup.remove();
        openActivityPage(task.id);
    });

    document.getElementById("removeShortcutTracking")?.addEventListener("click", () => {
        homeShortcuts = homeShortcuts.filter(id => id !== String(task.id));
        saveHomeShortcuts();
        popup.remove();
        renderTasks();
    });
}

function toggleHomeShortcut(taskId) {
    const task = tasks.find(item => String(item.id) === String(taskId));
    if (!task) return;

    if (isHomeShortcut(task.id)) {
        showShortcutDialog(task, true);
        return;
    }

    homeShortcuts.push(String(task.id));
    saveHomeShortcuts();
    renderTasks();
    showShortcutDialog(task, false);
}

function openActivityPage(taskId) {
    const url = new URL(window.location.href);
    url.searchParams.set("activity", String(taskId));
    window.location.href = url.toString();
}

function loadActivityFromURL() {
    const params = new URLSearchParams(window.location.search);
    const activityId = params.get("activity");
    if (!activityId) return;

    const task = tasks.find(item => String(item.id) === String(activityId));
    if (!task) return;

    const taskDate = new Date(`${task.date}T00:00:00`);
    if (!Number.isNaN(taskDate.getTime())) selectedDate = taskDate;
    document.title = `${task.title} — Agenda`;
}

/* ==========================================
RENDER TASKS
========================================== */

function formatTaskDate(dateKey) {

    const date =
        new Date(
            `${dateKey}T00:00:00`
        );

    return date.toLocaleDateString(
        currentLanguage === "nl"
            ? "nl-NL"
            : "en-US",
        {
            weekday: "short",
            month: "short",
            day: "numeric"
        }
    );
}

function renderTasks() {

    if (!timeline) {
        return;
    }

    timeline.innerHTML = "";

    const searchTerm =
        activitySearch?.value
            .trim()
            .toLowerCase() || "";

    let displayedTasks;

    if (searchTerm) {

        // Search through ALL activities.
        displayedTasks =
            tasks
                .filter(task => {

                    const title =
                        (task.title || "").toLowerCase();

                    const description =
                        (task.description || "").toLowerCase();

                    return (
                        title.includes(searchTerm) ||
                        description.includes(searchTerm)
                    );

                })
                .sort((a, b) => {

                    if (a.date !== b.date) {
                        return a.date.localeCompare(b.date);
                    }

                    return a.start.localeCompare(b.start);
                });

    } else {

        // Normal view: only show the selected day.
        const dateKey =
            getDateKey(selectedDate);

        displayedTasks =
            tasks
                .filter(
                    task =>
                        task.date === dateKey
                )
                .sort(
                    (a, b) =>
                        a.start.localeCompare(
                            b.start
                        )
                );
    }

    if (displayedTasks.length === 0) {

        emptyMessage.style.display =
            "flex";

        if (searchTerm) {

            emptyMessage.innerHTML = `
                <div class="empty-icon">
                    🔍
                </div>

                <h3>
                    No activities found
                </h3>

                <p>
                    No activities contain
                    "<strong>${escapeHTML(searchTerm)}</strong>".
                </p>
            `;

        } else if (isPastDay(selectedDate)) {

            emptyAddButton?.classList.add(
                "hidden"
            );

        } else {

            emptyAddButton?.classList.remove(
                "hidden"
            );
        }

        return;
    }

    emptyMessage.style.display =
        "none";

    const language =
        translations[currentLanguage] ||
        translations.en;

    displayedTasks.forEach(task => {

        const element =
            document.createElement("div");

        element.className =
            `task ${task.color || "blue"}`;

        if (task.completed) {
            element.classList.add(
                "completed"
            );
        }

        let alarmText = "";

        if (
            task.alarm &&
            task.alarm !== "none"
        ) {

            const alarmLabels = {

                start:
                    language.atStart,

                "5":
                    language.fiveMinutes,

                "10":
                    language.tenMinutes,

                "15":
                    language.fifteenMinutes,

                "30":
                    language.thirtyMinutes,

                "60":
                    language.oneHour
            };

            alarmText = `
                <span class="task-alarm">
                    🔔
                    ${alarmLabels[task.alarm] || ""}
                </span>
            `;
        }

        /*
            When searching, activities from past days
            should still be read-only.
        */
        const taskDate =
            new Date(
                `${task.date}T00:00:00`
            );

        const canEdit =
            !isPastDay(taskDate);

        /*
            Show the date when search results contain
            activities from different days.
        */
        const dateLabel =
            searchTerm
                ? `
                    <span class="search-result-date">
                        ${formatTaskDate(task.date)}
                    </span>
                `
                : "";

        element.innerHTML = `

            <div class="task-time">

                ${dateLabel}

                <span>
                    ${formatTime(task.start)}
                    –
                    ${formatTime(task.end)}
                </span>

                <span class="duration">
                    ${getDuration(
                        task.start,
                        task.end
                    )}
                </span>

            </div>

            <div class="task-line"></div>

            <div class="task-info">

                <h3>
                    ${escapeHTML(task.title)}
                </h3>

                ${
                    task.description
                    ?
                    `
                    <p>
                        ${escapeHTML(
                            task.description
                        )}
                    </p>
                    `
                    :
                    ""
                }

                ${alarmText}

            </div>

            <div class="task-actions">

                <button
                    class="home-shortcut-button ${isHomeShortcut(task.id) ? "shortcut-added" : ""}"
                    data-id="${task.id}"
                    title="${isHomeShortcut(task.id) ? language.removeHomeScreen : language.addHomeScreen}"
                    aria-label="${isHomeShortcut(task.id) ? language.removeHomeScreen : language.addHomeScreen}">
                    ${isHomeShortcut(task.id) ? "📱✓" : "📱"}
                </button>

                ${canEdit ? `
                    <button class="complete-button" data-id="${task.id}" title="${task.completed ? language.undo : language.complete}">
                        ${task.completed ? "↩" : "✓"}
                    </button>
                    <button class="edit-button" data-id="${task.id}" title="${language.edit}">✏️</button>
                    <button class="delete-button" data-id="${task.id}" title="${language.delete}">🗑</button>
                ` : ""}

            </div>

        `;

        timeline.appendChild(
            element
        );
    });
}

/* ==========================================
TASK ACTIONS
========================================== */

activitySearch?.addEventListener(
    "input",
    () => {

        const hasSearch =
            activitySearch.value.trim().length > 0;

        clearSearch?.classList.toggle(
            "hidden",
            !hasSearch
        );

        renderTasks();
    }
);

clearSearch?.addEventListener(
    "click",
    () => {

        activitySearch.value = "";

        clearSearch.classList.add(
            "hidden"
        );

        renderTasks();

        activitySearch.focus();
    }
);

timeline?.addEventListener(
    "click",
    event => {

        const completeButton =
            event.target.closest(
                ".complete-button"
            );

        const homeShortcutButton =
            event.target.closest(
                ".home-shortcut-button"
            );

        const editButton =
            event.target.closest(
                ".edit-button"
            );

        const deleteButton =
            event.target.closest(
                ".delete-button"
            );

        if (completeButton) {

            toggleTask(
                completeButton.dataset.id
            );

            return;
        }

        if (homeShortcutButton) {

            toggleHomeShortcut(
                homeShortcutButton.dataset.id
            );

            return;
        }

        if (editButton) {

            openEditTask(
                editButton.dataset.id
            );

            return;
        }

        if (deleteButton) {

            deleteTask(
                deleteButton.dataset.id
            );
        }
    }
);

/* ==========================================
DEFAULT TIMES
========================================== */

function setDefaultTimes() {

    const now =
        new Date();

    const startHours =
        String(
            now.getHours()
        ).padStart(2, "0");

    const startMinutes =
        String(
            now.getMinutes()
        ).padStart(2, "0");

    taskStart.value =
        `${startHours}:${startMinutes}`;

    let endHour =
        now.getHours() + 1;

    if (endHour > 23) {
        endHour = 23;
    }

    taskEnd.value =
        `${String(endHour).padStart(2, "0")}:${startMinutes}`;
}

/* ==========================================
OPEN ADD MODAL
========================================== */

function openAddTask() {

    if (isPastDay(selectedDate)) {
        return;
    }

    editingTaskId =
        null;

    taskForm.reset();

    setModalMode("add");

    taskColor.value =
        "blue";

    taskAlarm.value =
        "none";

    setDefaultTimes();

    modal.classList.remove(
        "hidden"
    );

    taskTitle.focus();
}

addTaskBtn?.addEventListener(
    "click",
    openAddTask
);

emptyAddButton?.addEventListener(
    "click",
    openAddTask
);

/* ==========================================
MODAL MODE
========================================== */

function setModalMode(mode) {

    const language =
        translations[currentLanguage] ||
        translations.en;

    const title =
        modal.querySelector("h2");

    const smallTitle =
        modal.querySelector(
            ".modal-small-title"
        );

    const submitButton =
        taskForm.querySelector(
            "button[type='submit']"
        );

    if (mode === "edit") {

        smallTitle.textContent =
            language.editActivity;

        title.textContent =
            language.editActivityTitle;

        submitButton.textContent =
            language.saveChanges;

    } else {

        smallTitle.textContent =
            language.newActivity;

        title.textContent =
            language.addActivityTitle;

        submitButton.textContent =
            language.addToAgenda;
    }
}

/* ==========================================
OPEN EDIT
========================================== */

function openEditTask(id) {

    if (isPastDay(selectedDate)) {
        return;
    }

    const task =
        tasks.find(
            item =>
                item.id === id
        );

    if (!task) {
        return;
    }

    editingTaskId =
        id;

    taskTitle.value =
        task.title || "";

    taskDescription.value =
        task.description || "";

    taskStart.value =
        task.start || "";

    taskEnd.value =
        task.end || "";

    taskColor.value =
        task.color || "blue";

    taskAlarm.value =
        task.alarm || "none";

    setModalMode("edit");

    modal.classList.remove(
        "hidden"
    );

    taskTitle.focus();
}

/* ==========================================
FORM SUBMIT
========================================== */

taskForm?.addEventListener(
    "submit",
    event => {

        event.preventDefault();

        if (isPastDay(selectedDate)) {

            closeTaskModal();

            return;
        }

        const title =
            taskTitle.value.trim();

        const description =
            taskDescription.value.trim();

        const start =
            taskStart.value;

        const end =
            taskEnd.value;

        const color =
            taskColor.value;

        const alarm =
            taskAlarm.value;

        if (!title) {
            return;
        }

        if (!start || !end) {
            return;
        }

        if (end <= start) {

            const language =
                translations[currentLanguage] ||
                translations.en;

            timeError.textContent =
                language.endTimeError;

            return;
        }

        timeError.textContent =
            "";

        /* EDIT */

        if (editingTaskId) {

            const task =
                tasks.find(
                    item =>
                        item.id ===
                        editingTaskId
                );

            if (!task) {
                return;
            }

            task.title =
                title;

            task.description =
                description;

            task.start =
                start;

            task.end =
                end;

            task.color =
                color;

            task.alarm =
                alarm;

        }

        /* NEW */

        else {

            const newTask = {

                id:
                    typeof crypto !==
                        "undefined" &&
                    crypto.randomUUID
                        ?
                        crypto.randomUUID()
                        :
                        `${Date.now()}-${Math.random()}`,

                date:
                    getDateKey(
                        selectedDate
                    ),

                title:
                    title,

                description:
                    description,

                start:
                    start,

                end:
                    end,

                color:
                    color,

                alarm:
                    alarm,

                completed:
                    false
            };

            tasks.push(
                newTask
            );
        }

        saveTasks();

        renderTasks();

        scheduleAlarms();

        closeTaskModal();

    }
);

/* ==========================================
DELETE
========================================== */

function deleteTask(id) {

    if (isPastDay(selectedDate)) {
        return;
    }

    tasks =
        tasks.filter(
            task =>
                task.id !== id
        );

    homeShortcuts =
        homeShortcuts.filter(
            shortcutId =>
                shortcutId !== String(id)
        );

    saveHomeShortcuts();
    saveTasks();

    renderTasks();

    scheduleAlarms();
}

/* ==========================================
COMPLETE
========================================== */

function toggleTask(id) {

    if (isPastDay(selectedDate)) {
        return;
    }

    const task =
        tasks.find(
            item =>
                item.id === id
        );

    if (!task) {
        return;
    }

    task.completed =
        !task.completed;

    saveTasks();

    renderTasks();

    scheduleAlarms();
}

/* ==========================================
SAVE
========================================== */

function saveTasks() {

    localStorage.setItem(
        TASKS_KEY,
        JSON.stringify(tasks)
    );
}

/* ==========================================
CLOSE TASK MODAL
========================================== */

function closeTaskModal() {

    modal.classList.add(
        "hidden"
    );

    timeError.textContent =
        "";

    editingTaskId =
        null;
}

closeModal?.addEventListener(
    "click",
    closeTaskModal
);

modal?.addEventListener(
    "click",
    event => {

        if (
            event.target === modal
        ) {

            closeTaskModal();
        }
    }
);

/* ==========================================
DAY NAVIGATION
========================================== */

previousDay?.addEventListener(
    "click",
    () => {

        selectedDate.setDate(
            selectedDate.getDate() - 1
        );

        updatePage();
    }
);

nextDay?.addEventListener(
    "click",
    () => {

        selectedDate.setDate(
            selectedDate.getDate() + 1
        );

        updatePage();
    }
);

function goToToday() {

    selectedDate =
        new Date();

    updatePage();
}

todayBtn?.addEventListener(
    "click",
    goToToday
);

todaySidebar?.addEventListener(
    "click",
    goToToday
);

/* ==========================================
SETTINGS
========================================== */

settingsBtn?.addEventListener(
    "click",
    () => {

        settingsModal.classList.remove(
            "hidden"
        );

    }
);

closeSettings?.addEventListener(
    "click",
    () => {

        /* Stop any alarm preview when X is clicked. */
        stopAlarmSound();

        settingsModal.classList.add(
            "hidden"
        );

    }
);

settingsModal?.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            settingsModal
        ) {

            stopAlarmSound();

            settingsModal.classList.add(
                "hidden"
            );

        }

    }
);

/* ==========================================
DARK MODE
========================================== */

function loadTheme() {

    const theme =
        localStorage.getItem(
            THEME_KEY
        );

    const dark =
        theme === "dark";

    document.body.classList.toggle(
        "dark",
        dark
    );

    if (darkModeToggle) {

        darkModeToggle.checked =
            dark;
    }
}

darkModeToggle?.addEventListener(
    "change",
    () => {

        const dark =
            darkModeToggle.checked;

        document.body.classList.toggle(
            "dark",
            dark
        );

        localStorage.setItem(
            THEME_KEY,
            dark
                ? "dark"
                : "light"
        );

    }
);

/* ==========================================
ALARM SOUND SETTINGS
========================================== */

function updateAlarmSoundUI() {

    document
        .querySelectorAll("[data-alarm-row]")
        .forEach(row => {

            const isSelected =
                row.dataset.alarmRow ===
                String(selectedAlarmSound);

            row.classList.toggle(
                "selected",
                isSelected
            );

            const chooseButton =
                row.querySelector(
                    "[data-choose-alarm]"
                );

            if (chooseButton) {

                chooseButton.setAttribute(
                    "aria-pressed",
                    isSelected
                        ? "true"
                        : "false"
                );

            }

        });
}

function saveAlarmSound(soundId) {

    selectedAlarmSound =
        String(soundId);

    if (alarmSoundSelect) {

        alarmSoundSelect.value =
            selectedAlarmSound;
    }

    localStorage.setItem(
        ALARM_SOUND_KEY,
        selectedAlarmSound
    );

    updateAlarmSoundUI();
}

function loadAlarmSound() {

    selectedAlarmSound =
        localStorage.getItem(
            ALARM_SOUND_KEY
        ) || "1";

    if (alarmSoundSelect) {

        alarmSoundSelect.value =
            selectedAlarmSound;
    }

    updateAlarmSoundUI();
}

alarmSoundSelect?.addEventListener(
    "change",
    () => {

        saveAlarmSound(
            alarmSoundSelect.value
        );

    }
);

/* ==========================================
ALARM PREVIEW
========================================== */

/*
    Plays one specific alarm.

    If you click the SAME preview button again,
    the alarm stops.

    Clicking another alarm automatically stops
    the previous one first.
*/

function playAlarmPreview(soundId) {

    const sound =
        document.getElementById(
            `alarmSound${soundId}`
        );

    if (!sound) {
        return;
    }

    if (
        previewingAlarmSound ===
        String(soundId)
    ) {

        stopAlarmSound();

        return;
    }

    stopAlarmSound();

    previewingAlarmSound =
        String(soundId);

    sound.currentTime =
        0;

    sound.volume =
        1;

    sound.play()
        .catch(error => {

            previewingAlarmSound =
                null;

            console.warn(
                "Browser blocked alarm preview:",
                error
            );

        });
}

/* ==========================================
PREVIEW BUTTONS
========================================== */

alarmPreviewButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                playAlarmPreview(
                    button.dataset.previewAlarm
                );

            }
        );

    }
);

/* ==========================================
CHOOSE ALARM BUTTONS
========================================== */

alarmChooseButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                const soundId =
                    button.dataset.chooseAlarm;

                saveAlarmSound(
                    soundId
                );

                /*
                    Preview the alarm immediately
                    after selecting it.
                */

                playAlarmPreview(
                    soundId
                );

            }
        );

    }
);

/* ==========================================
GET SELECTED AUDIO
========================================== */

function getSelectedAudio() {

    return document.getElementById(
        `alarmSound${selectedAlarmSound}`
    );
}

/* ==========================================
STOP ALL ALARMS
========================================== */

function stopAlarmSound() {

    previewingAlarmSound =
        null;

    document
        .querySelectorAll(
            "audio[id^='alarmSound']"
        )
        .forEach(audio => {

            audio.pause();

            audio.currentTime =
                0;

        });
}

/* ==========================================
PLAY ALARM
========================================== */

function playAlarmSound() {

    const sound =
        getSelectedAudio();

    if (!sound) {

        console.error(
            "Alarm sound not found."
        );

        return;
    }

    stopAlarmSound();

    sound.currentTime =
        0;

    sound.volume =
        1;

    sound.play()
        .catch(error => {

            console.warn(
                "Browser blocked alarm sound:",
                error
            );

        });
}

/* ==========================================
AUDIO UNLOCK
========================================== */

function unlockAlarmAudio() {

    if (alarmAudioUnlocked) {
        return;
    }

    const sound =
        getSelectedAudio();

    if (!sound) {
        return;
    }

    const oldVolume =
        sound.volume;

    sound.volume =
        0;

    sound.play()
        .then(() => {

            sound.pause();

            sound.currentTime =
                0;

            sound.volume =
                oldVolume;

            alarmAudioUnlocked =
                true;

        })
        .catch(() => {

            sound.volume =
                oldVolume;

        });
}

document.addEventListener(
    "click",
    unlockAlarmAudio,
    { once: true }
);

/* ==========================================
ALARM CALCULATION
========================================== */

function getAlarmMinutesBefore(
    alarm
) {

    switch (alarm) {

        case "5":
            return 5;

        case "10":
            return 10;

        case "15":
            return 15;

        case "30":
            return 30;

        case "60":
            return 60;

        default:
            return 0;
    }
}

/* ==========================================
GET ALARM DATE
========================================== */

function getAlarmTime(
    task
) {

    if (
        !task.alarm ||
        task.alarm === "none"
    ) {

        return null;
    }

    const date =
        new Date(
            `${task.date}T${task.start}:00`
        );

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return null;
    }

    if (
        task.alarm !== "start"
    ) {

        date.setMinutes(
            date.getMinutes() -
            getAlarmMinutesBefore(
                task.alarm
            )
        );
    }

    return date.getTime();
}

/* ==========================================
SCHEDULE ALARMS
========================================== */

function scheduleAlarms() {

    if (alarmTimer) {

        clearTimeout(
            alarmTimer
        );

        alarmTimer =
            null;
    }

    const now =
        Date.now();

    const upcoming =
        tasks
            .filter(task => {

                return (
                    task.alarm &&
                    task.alarm !== "none" &&
                    !task.completed
                );

            })
            .map(task => {

                return {

                    task:
                        task,

                    alarmTime:
                        getAlarmTime(task)

                };

            })
            .filter(item => {

                return (
                    item.alarmTime &&
                    item.alarmTime > now
                );

            })
            .sort(
                (a, b) =>
                    a.alarmTime -
                    b.alarmTime
            );

    if (
        upcoming.length === 0
    ) {

        return;
    }

    const nextAlarm =
        upcoming[0];

    const delay =
        nextAlarm.alarmTime -
        now;

    const maxDelay =
        2147483647;

    alarmTimer =
        setTimeout(
            () => {

                const currentTime =
                    Date.now();

                if (
                    currentTime <
                    nextAlarm.alarmTime
                ) {

                    scheduleAlarms();

                    return;
                }

                /*
                    IMPORTANT:
                    This alarm is only based on the
                    activity START time.

                    There is deliberately NO alarm
                    when the activity ends.
                */

                showAlarm(
                    nextAlarm.task
                );

                scheduleAlarms();

            },
            Math.min(
                delay,
                maxDelay
            )
        );
}

/* ==========================================
SHOW ALARM
========================================== */

function showAlarm(task) {

    playAlarmSound();

    const language =
        translations[currentLanguage] ||
        translations.en;

    if (
        typeof Notification !==
        "undefined" &&
        Notification.permission ===
        "granted"
    ) {

        try {

            new Notification(
                language.alarmNotification,
                {
                    body:
                        `${task.title} — ${
                            formatTime(
                                task.start
                            )
                        }`
                }
            );

        } catch {
            // Ignore notification errors.
        }
    }

    showAlarmPopup(
        task
    );
}

/* ==========================================
ALARM POPUP
========================================== */

function showAlarmPopup(task) {

    const oldPopup =
        document.getElementById(
            "alarmPopup"
        );

    oldPopup?.remove();

    const popup =
        document.createElement(
            "div"
        );

    popup.id =
        "alarmPopup";

    popup.innerHTML = `

        <div class="alarm-popup-content">

            <div class="alarm-icon">
                🔔
            </div>

            <h2>
                ${escapeHTML(task.title)}
            </h2>

            <p>
                ${formatTime(task.start)}
                –
                ${formatTime(task.end)}
            </p>

            <button id="dismissAlarm">
                OK
            </button>

        </div>

    `;

    document.body.appendChild(
        popup
    );

    document
        .getElementById(
            "dismissAlarm"
        )
        .addEventListener(
            "click",
            () => {

                stopAlarmSound();

                popup.remove();

            }
        );
}

/* ==========================================
ESCAPE HTML
========================================== */

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        text;

    return div.innerHTML;
}

/* ==========================================
UPDATE PAGE
========================================== */

function updatePage() {

    updateDateDisplay();

    renderTasks();

    scheduleAlarms();
}

/* ==========================================
INITIALIZE
========================================== */

loadTheme();

loadAlarmSound();

translatePage();

loadActivityFromURL();

updatePage();