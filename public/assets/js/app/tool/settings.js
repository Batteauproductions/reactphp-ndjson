import { Icon } from "./icon.js";

//oSettings
const debug = true;
const date = new Date();
const currentDateTime = date.toISOString();
const domain = window.location.origin;
let language = 'nl-NL';
const oTranslations = Object.freeze({
    "nl-NL": {
        "change": "veranderen",
        "character_save": "Karakter opslaan",
        "character_saving": "Opslaan bezig",
        "character_status": "Karakter status",
        "character_type": "Karakter type",
        "character_submit": "Opslaan bezig",
        "character_error": "Er ging iets mis, neem contact op met de spelleiding.",
        "character_error_save": "Fout tijdens opslaan",
        "character_save_done": "Karakter opgeslagen",
        "character_name": "Karakternaam",
        "cancel": "annuleren",
        "coin": "Geldstukken",
        "choose": "kiezen",
        "choose_option": "Maak een keuze",
        "copper": "koper",
        "confirm": "ok",
        "disclaimer": "disclaimer",
        "downgrade": "verlagen",
        "duplicate_choose": "je personage heeft deze keuze al",
        "edit": "aanpassen",
        "experience": "vaardigheidspunt(en)",
        "gatherable": "verzamelbaar",
        "gold": "goud",
        "gamemaster_only": "Speciale vaardigheid",
        "increase_base_currency": "Verhoogt het startbedrag",
        "increase_base_dex": "Verhoogt de behendigheid",
        "increase_base_favor": "Verhoogt de patron gunst",
        "increase_base_godpoints": "Verhoogt de godpunten",
        "increase_base_health": "Verhoogt de levenspunten",
        "increase_base_intel": "Verhoogt de intelligentie",
        "increase_base_mana": "Verhoogt de mana-poel",
        "increase_base_mana_minor": "Verhoogt de mana-poel (minor)",
        "increase_base_points": "Verhoogt de vaardigheidspunten",
        "increase_base_sanity": "Verhoogt de sanity",
        "increase_base_str": "Verhoogt de kracht",
        "loresheet": "Je krijgt hievoor een loresheet.",
        "more_info": "meer informatie",
        "not_choice_made": "Je dient nog een keuze te maken.",
        "not_enough_coin": "Je hebt niet genoeg geld om dit aan te schaffen.",
        "not_enough_vp": "Je hebt niet genoeg vaardigheidspunten.",
        "new": "Nieuw",
        "popup_success": "Gelukt!",
        "popup_error": "Oops!",
        "question_1": "Wat heb je dit evenement ondernomen?",
        "question_2": "Wat heeft dit met je personage gedaan?",
        "question_3": "Heb je relaties/contacten opgebouwd met npc’s?",
        "question_4": "Wat heb je bijgeleerd (info) en welke theorieën leid je er uit af?",
        "question_5": "Wat zijn je plannen komend evenement?",
        "question_6": "Overige toevoeging? (optioneel)",
        "rank": "niveau",
        "rank_max": "Maximale niveau behaald",
        "rank_min": "Minimale niveau bereikt",
        "racial": "ras",
        "remove": "verwijderen",
        "required": "verplicht",
        "silver": "zilver",
        "skill_speech": "Taal: Spreken",
        "skill_knowledge_x": "Kennis X",
        "upgrade": "verhogen",
        "note_add" : "notitie toevoegen",
    }
});
const icons = Object.freeze({
    note_add: new Icon({icon_visual: 'fa-regular fa-floppy-disk', icon_text: 'note_add'}),
    character_save: new Icon({icon_visual: 'fa-solid fa-floppy-disk', icon_class: 'button solid', icon_text: 'character_save'}),
    character_saving: new Icon({icon_visual: 'fa-solid fa-rotate-right', icon_class: 'button solid', icon_text: 'character_saving'}),
    character_submit: new Icon({icon_visual: 'fa-solid fa-rotate-right', icon_class: 'button solid', icon_text: 'character_submit'}),
    character_error: new Icon({icon_visual: 'fa-solid fa-xmark', icon_text: 'character_error'}),
    character_error_save: new Icon({icon_visual: 'fa-solid fa-xmark', icon_text: 'character_error_save'}),
    character_save_done: new Icon({icon_visual: 'fa-solid fa-check', icon_text: 'character_save_done'}),
    cancel: new Icon({icon_visual: 'fa-solid fa-xmark', icon_text: 'cancel'}),
    coin: new Icon({icon_visual: 'fa-solid fa-coins', icon_text: 'coin'}),
    confirm: new Icon({icon_visual: 'fa-solid fa-check', icon_text: 'confirm'}),
    change: new Icon({icon_visual: 'fa-solid fa-rotate-right', icon_text: 'change'}),
    choose: new Icon({icon_visual: 'fa-regular fa-square-check', icon_class: 'button solid', icon_text: 'choose'}),
    disclaimer: new Icon({icon_visual: 'fa-solid fa-triangle-exclamation', icon_text: 'disclaimer'}),
    downgrade: new Icon({icon_visual: 'fa-solid fa-chevron-down', icon_text: 'downgrade'}),
    edit: new Icon({icon_visual: 'fa-solid fa-pen-to-square', icon_text: 'edit'}),
    experience: new Icon({icon_visual: 'fa-solid fa-brain', icon_text: 'experience'}),
    gatherable: new Icon({icon_visual: 'fa-solid fa-leaf', icon_text: 'gatherable'}),
    loresheet: new Icon({icon_visual: 'fa-solid fa-scroll', icon_text: 'loresheet'}),
    more_info: new Icon({icon_visual: 'fa-solid fa-circle-info', icon_text: 'more_info'}),
    new: new Icon({icon_visual: 'fa-regular fa-star', icon_text: 'new'}),
    racial: new Icon({icon_visual: 'fa-solid fa-users', icon_text: 'racial'}),
    rank: new Icon({icon_visual: 'fa-solid fa-hashtag', icon_text: 'rank'}),
    remove: new Icon({icon_visual: 'fa-solid fa-xmark', icon_text: 'remove'}),
    required: new Icon({icon_visual: 'fa-solid fa-asterisk', icon_text: 'required'}),
    upgrade: new Icon({icon_visual: 'fa-solid fa-chevron-up', icon_text: 'upgrade'}),
    gamemaster_only: new Icon({icon_visual: 'fa-solid fa-meteor', icon_text: 'gamemaster_only'}),
    increase_base_sanity: new Icon({icon_visual: 'fa-solid fa-arrow-up-right-dots', icon_text: 'increase_base_sanity'}),
    increase_base_health: new Icon({icon_visual: 'fa-solid fa-arrow-up-right-dots', icon_text: 'increase_base_health'}),
    increase_base_dex: new Icon({icon_visual: 'fa-solid fa-arrow-up-right-dots', icon_text: 'increase_base_dex'}),
    increase_base_str: new Icon({icon_visual: 'fa-solid fa-arrow-up-right-dots', icon_text: 'increase_base_str'}),
    increase_base_intel: new Icon({icon_visual: 'fa-solid fa-arrow-up-right-dots', icon_text: 'increase_base_intel'}),
    increase_base_godpoints: new Icon({icon_visual: 'fa-solid fa-arrow-up-right-dots', icon_text: 'increase_base_godpoints'}),
    increase_base_mana: new Icon({icon_visual: 'fa-solid fa-arrow-up-right-dots', icon_text: 'increase_base_mana'}),
    increase_base_points: new Icon({icon_visual: 'fa-solid fa-arrow-up-right-dots', icon_text: 'increase_base_points'}),
    increase_base_mana_minor: new Icon({icon_visual: 'fa-solid fa-arrow-up-right-dots', icon_text: 'increase_base_mana_minor'}),
    increase_base_currency: new Icon({icon_visual: 'fa-solid fa-arrow-up-right-dots', icon_text: 'increase_base_currency'}),
    increase_base_favor: new Icon({icon_visual: 'fa-solid fa-arrow-up-right-dots', icon_text: 'increase_base_favor'}),
    "14": new Icon({icon_visual: 'fa-regular fa-comment', icon_text: 'skill_speech'}),
    "5": new Icon({icon_visual: 'fa-regular fa-comment', icon_text: 'skill_knowledge_x'}),
});

const iconset = Object.freeze({
    attribute_adjust_none: null,
    attribute_adjust_basic: [
        { name: 'remove', icon: icons.remove }
    ],
    attribute_adjust_up: [
        { name: 'upgrade', icon: icons.upgrade },
        { name: 'remove', icon: icons.remove }
    ],
    attribute_adjust_all: [
        { name: 'downgrade', icon: icons.downgrade },
        { name: 'upgrade', icon: icons.upgrade },
        { name: 'remove', icon: icons.remove }
    ],
    attribute_adjust_down: [
        { name: 'downgrade', icon: icons.downgrade },
        { name: 'remove', icon: icons.remove }
    ],
});


//Character related assignments
const arrXP = Object.freeze($('input[name="arrXP"]').val().split(","));
const jsonBaseChar = Object.freeze(JSON.parse($('input[name="jsonBaseChar"]').val()));
const jsonStat = Object.freeze(JSON.parse($('input[name="jsonStat"]').val()));

export {
    arrXP,
    debug,
    currentDateTime,
    domain,
    icons,
    iconset,
    jsonBaseChar,
    jsonStat,
    language,
    oTranslations,
}