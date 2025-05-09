//oSettings
const debug = true;
const date = new Date();
const currentDateTime = date.toISOString();
const domain = window.location.origin;
let language = 'nl-NL';
const oTranslations = Object.freeze({
    "nl-NL": {
        "change": "veranderen",
        "character_saving": "Opslaan bezig",
        "character_status": "Karakter status",
        "character_type": "Karakter type",
        "character_submit": "Opslaan bezig",
        "character_error": "Fout tijdens opslaan",
        "character_save_done": "Karakter opgeslagen",
        "character_name": "Karakternaam",
        "choose": "kiezen",
        "choose_option": "Maak een keuze",
        "copper": "koper",
        "disclaimer": "disclaimer",
        "downgrade": "verlagen",
        "duplicate_choose": "je personage heeft deze keuze al",
        "edit": "aanpassen",
        "experience": "vaardigheidspunt(en)",
        "gatherable": "verzamelbaar",
        "gold": "goud",
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
        "new": "nieuw",
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
    "note_add":{
        icon: '<i class="fa-regular fa-floppy-disk"></i>',
        class: '',
        text: oTranslations[language].note_add,
    },
    "character_saving":{
        icon: '<i class="fa-solid fa-rotate-right"></i>',
        class: '',
        text: oTranslations[language].character_saving,
    },
    "character_submit":{
        icon: '<i class="fa-solid fa-rotate-right"></i>',
        class: '',
        text: oTranslations[language].character_submit,
    },
    "character_error":{
        icon: '<i class="fa-solid fa-xmark"></i>',
        class: '',
        text: oTranslations[language].character_error,
    },
    "character_save_done":{
        icon: '<i class="fa-solid fa-xmark"></i>',
        class: '',
        text: oTranslations[language].character_save_done,
    },
    "change":{
        icon: '<i class="fa-solid fa-rotate-right"></i>',
        class: '',
        text: oTranslations[language].change,
    },
    "choose": {
        icon: '<i class="fa-regular fa-square-check"></i>',
        class: '',
        text: oTranslations[language].choose,
    },
    "disclaimer":{
        icon: '<i class="fa-solid fa-triangle-exclamation"></i>',
        class: 'warning',
        text: oTranslations[language].disclaimer,
    },
    "downgrade":{
        icon: '<i class="fa-solid fa-chevron-down"></i>',
        class: '',
        text: oTranslations[language].downgrade,
    },    
    "edit": {
        icon: '<i class="fa-solid fa-pen-to-square"></i>',
        class: '',
        text: oTranslations[language].edit,
    },
    "experience":{
        icon: '<i class="fa-solid fa-brain"></i>',
        class: '',
        text: oTranslations[language].experience,
    },
    "gatherable": {
        icon: '<i class="fa-solid fa-leaf"></i>',
        class: '',
        text: oTranslations[language].gatherable,
    },
    "loresheet":{
        icon: '<i class="fa-solid fa-scroll"></i>',
        class: '',
        text: oTranslations[language].loresheet,
    },
    "more_info":{
        icon: '<i class="fa-solid fa-circle-info"></i>',
        class: '',
        text: oTranslations[language].more_info,
    },
    "new": {
        icon: '<i class="fa-regular fa-star"></i>',
        class: '',
        text: oTranslations[language].new,
    },
    "racial": {
        icon: '<i class="fa-solid fa-users"></i>',
        class: '',
        text: oTranslations[language].racial,
    },
    "rank":{
        icon: '<i class="fa-solid fa-hashtag"></i>',
        class: '',
        text: oTranslations[language].rank,
    },
    "remove": {
        icon: '<i class="fa-solid fa-xmark"></i>',
        class: '',
        text: oTranslations[language].remove,
    },
    "required": {
        icon: '<i class="fa-solid fa-asterisk"></i>',
        class: '',
        text: oTranslations[language].required,
    },
    "upgrade":{
        icon: '<i class="fa-solid fa-chevron-up"></i>',
        class: '',
        text: oTranslations[language].upgrade,
    },
   "increase_base_sanity":{
        icon: '<i class="fa-solid fa-arrow-up-right-dots"></i>',
        class: '',
        text: oTranslations[language].increase_base_sanity,
    },
   "increase_base_health":{
        icon: '<i class="fa-solid fa-arrow-up-right-dots"></i>',
        class: '',
        text: oTranslations[language].increase_base_health,
    },
    "increase_base_dex":{
        icon: '<i class="fa-solid fa-arrow-up-right-dots"></i>',
        class: '',
        text: oTranslations[language].increase_base_dex,
    },
    "increase_base_str":{
        icon: '<i class="fa-solid fa-arrow-up-right-dots"></i>',
        class: '',
        text: oTranslations[language].increase_base_str,
    },
    "increase_base_intel":{
        icon: '<i class="fa-solid fa-arrow-up-right-dots"></i>',
        class: '',
        text: oTranslations[language].increase_base_intel,
    },
    "increase_base_godpoints":{
        icon: '<i class="fa-solid fa-arrow-up-right-dots"></i>',
        class: '',
        text: oTranslations[language].increase_base_godpoints,
    },
    "increase_base_mana":{
        icon: '<i class="fa-solid fa-arrow-up-right-dots"></i>',
        class: '',
        text: oTranslations[language].increase_base_mana,
    },
    "increase_base_points":{
        icon: '<i class="fa-solid fa-arrow-up-right-dots"></i>',
        class: '',
        text: oTranslations[language].increase_base_points,
    },
    "increase_base_mana_minor":{
        icon: '<i class="fa-solid fa-arrow-up-right-dots"></i>',
        class: '',
        text: oTranslations[language].increase_base_mana_minor,
    },
    "increase_base_currency":{
        icon: '<i class="fa-solid fa-arrow-up-right-dots"></i>',
        class: '',
        text: oTranslations[language].increase_base_currency,
    },
    "increase_base_str":{
        icon: '<i class="fa-solid fa-arrow-up-right-dots"></i>',
        class: '',
        text: oTranslations[language].increase_base_str,
    },
    "increase_base_favor":{
        icon: '<i class="fa-solid fa-arrow-up-right-dots"></i>',
        class: '',
        text: oTranslations[language].increase_base_favor,
    },
    // "Taal: Spreken" 
    "14":{
        icon: '<i class="fa-regular fa-comment"></i>',
        class: '',
        text: oTranslations[language].skill_speech,
    },
    // "Kennis X" 
    "5":{
        icon: '<i class="fa-regular fa-comment"></i>',
        class: '',
        text: oTranslations[language].skill_knowledge_x,
    },
});
const iconset = Object.freeze({
    "attribute_adjust_none": null,
    "attribute_adjust_basic": Array("remove"),
    "attribute_adjust_up": Array("upgrade","remove"),
    "attribute_adjust_all": Array("downgrade","upgrade","remove"),
    "attribute_adjust_down": Array("downgrade","remove"),
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