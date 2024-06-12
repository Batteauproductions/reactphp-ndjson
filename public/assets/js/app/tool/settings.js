//oSettings
const arrXP = Object.freeze($('input[name="arrXP"]').val().split(","));
const domain = window.location.origin;
let language = 'nl-NL';
const oTranslations = Object.freeze({
    "nl-NL": {
        "change": "veranderen",
        "character_name": "Karakternaam",
        "choose": "kiezen",
        "choose_option": "Maak een keuze",
        "copper": "koper",
        "disclaimer": "disclaimer",
        "downgrade": "verlagen",
        "edit": "aanpassen",
        "experience": "vaardigheidspunt(en)",
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
        "loresheet": "Je krijgt hievoor een loresheet.",
        "more_info": "meer informatie",
        "not_enough_coin": "Je hebt niet genoeg geld om dit aan te schaffen.",
        "not_enough_vp": "Je hebt niet genoeg vaardigheidspunten.",
        "question_1": "Wat heb je dit evenement ondernomen?",
        "question_2": "Wat heeft dit met je personage gedaan?",
        "question_3": "Heb je relaties/contacten opgebouwd met npc’s?",
        "question_4": "Wat heb je bijgeleerd (info) en welke theorieën leid je er uit af?",
        "question_5": "Wat zijn je plannen komend evenement?",
        "question_6": "Overige toevoeging? (optioneel)",
        "rank": "niveau",
        "remove": "verwijderen",
        "required": "verplicht",
        "silver": "zilver",
        "upgrade": "verhogen"
    },
    "en-GB": {
        "change": "change",
        "character_name": "Character Name",
        "choose": "choose",
        "choose_option": "Make a choice",
        "copper": "copper",
        "disclaimer": "disclaimer",
        "downgrade": "downgrade",
        "edit": "edit",
        "experience": "experience point(s)",
        "gold": "gold",
        "increase_base_currency": "Increases starting amount",
        "increase_base_dex": "Increases dexterity",
        "increase_base_favor": "Increases patron favour",
        "increase_base_godpoints": "Increases god points",
        "increase_base_health": "Increases health points",
        "increase_base_intel": "Increases intelligence",
        "increase_base_mana": "Increases mana pool",
        "increase_base_mana_minor": "Increases mana pool (minor)",
        "increase_base_points": "Increases skill points",
        "increase_base_sanity": "Increases sanity",
        "loresheet": "You receive a loresheet for this.",
        "more_info": "more information",
        "not_enough_coin": "You do not have enough money to purchase this.",
        "not_enough_vp": "You do not have enough skill points.",
        "question_1": "What did you undertake this event?",
        "question_2": "What did this do to your character?",
        "question_3": "Did you build relationships/contacts with NPCs?",
        "question_4": "What did you learn (info) and what theories do you derive from it?",
        "question_5": "What are your plans for the next event?",
        "question_6": "Any additional notes? (optional)",
        "rank": "rank",
        "remove": "remove",
        "required": "required",
        "silver": "silver",
        "upgrade": "upgrade"
    }
});
const icons = Object.freeze({
    "change":{
        icon: '<i class="fa-solid fa-rotate-right"></i>',
        text: oTranslations[language].change,
    },
    "choose": {
        icon: '<i class="fa-regular fa-square-check"></i>',
        text: oTranslations[language].choose,
    },
    "disclaimer":{
        icon: '<i class="fa-solid fa-triangle-exclamation"></i>',
        text: oTranslations[language].disclaimer,
    },
    "downgrade":{
        icon: '<i class="fa-solid fa-circle-down"></i>',
        text: oTranslations[language].downgrade,
    },
    
    "edit": {
        icon: '<i class="fa-solid fa-pen-to-square"></i>',
        text: oTranslations[language].edit,
    },
    "experience":{
        icon: '<i class="fa-solid fa-brain"></i>',
        text: oTranslations[language].experience,
    },
    "loresheet":{
        icon: '<i class="fa-solid fa-scroll"></i>',
        text: oTranslations[language].loresheet,
    },
    "more_info":{
        icon: '<i class="fa-solid fa-circle-info"></i>',
        text: oTranslations[language].more_info,
    },
    "rank":{
        icon: '<i class="fa-solid fa-hashtag"></i>',
        text: oTranslations[language].rank,
    },
    "remove": {
        icon: '<i class="fa-solid fa-xmark"></i>',
        text: oTranslations[language].remove,
    },
    "required": {
        icon: '<i class="fa-solid fa-asterisk"></i>',
        text: oTranslations[language].required,
    },
    "upgrade":{
        icon: '<i class="fa-solid fa-circle-up"></i>',
        text: oTranslations[language].upgrade,
    },
   "increase_base_sanity":{
        icon: '<i class="fa-solid fa-arrow-up-right-dots"></i>',
        text: oTranslations[language].increase_base_sanity,
    },
   "increase_base_health":{
        icon: '<i class="fa-solid fa-arrow-up-right-dots"></i>',
        text: oTranslations[language].increase_base_health,
    },
    "increase_base_dex":{
        icon: '<i class="fa-solid fa-arrow-up-right-dots"></i>',
        text: oTranslations[language].increase_base_dex,
    },
    "increase_base_str":{
        icon: '<i class="fa-solid fa-arrow-up-right-dots"></i>',
        text: oTranslations[language].increase_base_str,
    },
    "increase_base_intel":{
        icon: '<i class="fa-solid fa-arrow-up-right-dots"></i>',
        text: oTranslations[language].increase_base_intel,
    },
    "increase_base_godpoints":{
        icon: '<i class="fa-solid fa-arrow-up-right-dots"></i>',
        text: oTranslations[language].increase_base_godpoints,
    },
    "increase_base_mana":{
        icon: '<i class="fa-solid fa-arrow-up-right-dots"></i>',
        text: oTranslations[language].increase_base_mana,
    },
    "increase_base_points":{
        icon: '<i class="fa-solid fa-arrow-up-right-dots"></i>',
        text: oTranslations[language].increase_base_points,
    },
    "increase_base_mana_minor":{
        icon: '<i class="fa-solid fa-arrow-up-right-dots"></i>',
        text: oTranslations[language].increase_base_mana_minor,
    },
    "increase_base_currency":{
        icon: '<i class="fa-solid fa-arrow-up-right-dots"></i>',
        text: oTranslations[language].increase_base_currency,
    },
    "increase_base_favor":{
        icon: '<i class="fa-solid fa-arrow-up-right-dots"></i>',
        text: oTranslations[language].increase_base_favor,
    },
});
const iconset = Object.freeze({
    "new_skill_no_rank": Array("remove"),
    "new_skill_with_rank": Array("remove","upgrade"),
    "new_item": Array("remove"),
})
const jsonBaseChar = Object.freeze(JSON.parse($('input[name="jsonBaseChar"]').val()));
const jsonStat = Object.freeze(JSON.parse($('input[name="jsonStat"]').val()));

// Get the current date and time
const currentDateTime = new Date();

let oCharacter = {
    meta: {
        name: '',
        background: '',
        created_dt: currentDateTime.toISOString(),
        modified_dt: '',
        firstlocked_dt: '',
        lastlocked_dt: '',
    },
    build: Object.assign({}, jsonBaseChar),
    race: [],
    profession: [],
    skills: [], 
    items: [],
    stories: [],
}

export {
    arrXP,
    domain,
    icons,
    iconset,
    jsonBaseChar,
    jsonStat,
    language,
    oCharacter,    
    oTranslations,
}