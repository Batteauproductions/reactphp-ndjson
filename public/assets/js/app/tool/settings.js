//oSettings
const arrXP = Object.freeze($('input[name="arrXP"]').val().split(","));
const domain = window.location.origin;
let language = 'nl-NL';
const oTranslations = Object.freeze({
    "nl-NL": {
        not_enough_vp: 'Je hebt niet genoeg vaardigheidspunten.'
        ,not_enough_coin: 'Je hebt niet genoeg geld om dit aan te schaffen.'
        ,choose_sub: 'Kies een subtype'
        ,loresheet: 'Je krijgt hievoor een loresheet.'
        ,rank: "niveau"
        ,remove: "verwijderen"
        ,edit: "aanpassen"
        ,upgrade: "verhogen"
        ,downgrade: "verlagen"
        ,change: "veranderen"
        ,gold: "goud"
        ,silver: "zilver"
        ,copper: "koper"
        ,experience: "vaardigheidspunt(en)"
        ,more_info: "meer informatie"
        ,choose: "kiezen"
        ,question_1: "Wat heb je dit evenement ondernomen?"
        ,question_2: "Wat heeft dit met je personage gedaan?"
        ,question_3: "Heb je relaties/contacten opgebouwd met npc’s?"
        ,question_4: "Wat heb je bijgeleerd (info) en welke theorieën leid je er uit af?"
        ,question_5: "Wat zijn je plannen komend evenement?"
        ,question_6: "Overige toevoeging? (optioneel)"
        ,increase_base_sanity: "Verhoogt de sanity"
        ,increase_base_health: "Verhoogt de levenspunten"
        ,increase_base_dex: "Verhoogt de behendigheid"
        ,increase_base_str: "Verhoogt de kracht"
        ,increase_base_intel: "Verhoogt de intelligentie"
        ,increase_base_godpoints: "Verhoogt de godpunten"
        ,increase_base_mana: "Verhoogt de mana-poel"
        ,increase_base_points: "Verhoogt de vaardigheidspunten"
        ,increase_base_mana_minor: "Verhoogt de mana-poel (minor)"
        ,increase_base_currency: "Verhoogt het startbedrag"
        ,increase_base_favor: "Verhoogt de patron gunst"
    },
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