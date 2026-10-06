// UI text in every supported language. Components never hard-code
// user-facing strings; they look them up here by key, so adding a language
// means adding one catalog below.

export type Locale = "en" | "fr";

/** Every supported language, in the order the language picker lists them. */
export const LOCALES: readonly Locale[] = ["en", "fr"];

/** Each language's own name for itself, as shown in the language picker. */
export const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  fr: "Français",
};

const en = {
  "app.title": "Todos",
  "app.loading": "Loading…",
  "app.leftToDo": "{count} left to do",
  "app.allDone": "All done — nice work!",
  "app.settings": "Settings",

  "form.title": "Title",
  "form.titlePlaceholder": "What needs to be done?",
  "form.priority": "Priority",
  "form.dueDate": "Due date",
  "form.add": "Add",

  "priority.low": "Low",
  "priority.medium": "Medium",
  "priority.high": "High",

  "toolbar.search": "Search todos",
  "toolbar.filterBy": "Filter by status",
  "status.all": "All",
  "status.active": "Active",
  "status.completed": "Completed",

  "list.empty": "Nothing here yet — add your first todo above.",
  "list.noMatches": "No todos match this view.",
  "list.showMore": "Show more",
  "list.clearCompleted": "Clear completed",

  "item.edit": "Edit",
  "item.editLabel": "Edit “{title}”",
  "item.deleteLabel": "Delete “{title}”",
  "item.titleLabel": "Todo title",
  "item.save": "Save",
  "item.cancel": "Cancel",

  "due.today": "Due today",
  "due.tomorrow": "Due tomorrow",
  "due.overdue": "Overdue",
  "due.on": "Due {date}",

  "settings.heading": "Settings",
  "settings.close": "Done",
  "settings.theme": "Theme",
  "settings.language": "Language",
  "settings.defaultPriority": "Default priority for new todos",
  "theme.system": "Match system",
  "theme.light": "Light",
  "theme.dark": "Dark",
};

export type MessageKey = keyof typeof en;

const fr: Record<MessageKey, string> = {
  "app.title": "Tâches",
  "app.loading": "Chargement…",
  "app.leftToDo": "À faire : {count}",
  "app.allDone": "Tout est fait — bravo !",
  "app.settings": "Réglages",

  "form.title": "Intitulé",
  "form.titlePlaceholder": "Que faut-il faire ?",
  "form.priority": "Priorité",
  "form.dueDate": "Échéance",
  "form.add": "Ajouter",

  "priority.low": "Basse",
  "priority.medium": "Moyenne",
  "priority.high": "Haute",

  "toolbar.search": "Rechercher des tâches",
  "toolbar.filterBy": "Filtrer par état",
  "status.all": "Toutes",
  "status.active": "En cours",
  "status.completed": "Terminées",

  "list.empty": "Rien pour l’instant — ajoutez votre première tâche ci-dessus.",
  "list.noMatches": "Aucune tâche ne correspond à cette vue.",
  "list.showMore": "Afficher la suite",
  "list.clearCompleted": "Clear completed",

  "item.edit": "Modifier",
  "item.editLabel": "Modifier « {title} »",
  "item.deleteLabel": "Supprimer « {title} »",
  "item.titleLabel": "Intitulé de la tâche",
  "item.save": "Enregistrer",
  "item.cancel": "Annuler",

  "due.today": "Pour aujourd’hui",
  "due.tomorrow": "Pour demain",
  "due.overdue": "En retard",
  "due.on": "Pour le {date}",

  "settings.heading": "Réglages",
  "settings.close": "Fermer",
  "settings.theme": "Thème",
  "settings.language": "Langue",
  "settings.defaultPriority": "Priorité par défaut des nouvelles tâches",
  "theme.system": "Comme le système",
  "theme.light": "Clair",
  "theme.dark": "Sombre",
};

const catalogs: Record<Locale, Record<MessageKey, string>> = { en, fr };

/** True when `value` names a supported language. */
export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

/**
 * The text for `key` in the given language, with each {name} placeholder
 * replaced by values[name]. A placeholder with no value is left as written.
 */
export function translate(
  locale: Locale,
  key: MessageKey,
  values: Record<string, string | number> = {},
): string {
  return catalogs[locale][key].replace(/\{(\w+)\}/g, (placeholder, name: string) =>
    name in values ? String(values[name]) : placeholder,
  );
}

/** A YYYY-MM-DD calendar day as a short date in the given language. */
export function formatDay(locale: Locale, dateKey: string): string {
  return new Intl.DateTimeFormat(locale, { month: "short", day: "numeric", timeZone: "UTC" }).format(
    new Date(`${dateKey}T00:00:00Z`),
  );
}
