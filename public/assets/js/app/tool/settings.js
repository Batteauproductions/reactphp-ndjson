//oSettings
const arrXP = Object.freeze($('input[name="arrXP"]').val().split(","));
const domain = window.location.origin;
let language = 'nl-NL';
const oTranslations = Object.freeze({
    "nl-NL": {
        not_enough_vp: 'Je hebt niet genoeg vaardigheidspunten.'
        ,not_enough_coin: 'Je hebt niet genoeg geld om dit aan te schaffen.'
        ,choose_sub: 'Kies een subtype'
        ,rank: "niveau"
        ,remove: "verwijderen"
        ,edit: "aanpassen"
        ,upgrade: "verhogen"
        ,downgrade: "verlagen"
        ,change: "veranderen"
        ,gold: "goud"
        ,silver: "zilver"
        ,copper: "koper"
        ,loresheet: "loresheet"
        ,experience: "vaardigheidspunt(en)"
        ,more_info: "meer informatie"
        ,choose: "kiezen"
        ,question_1: "Wat heb je dit evenement ondernomen?"
        ,question_2: "Wat heeft dit met je personage gedaan?"
        ,question_3: "Heb je relaties/contacten opgebouwd met npc’s?"
        ,question_4: "Wat heb je bijgeleerd (info) en welke theorieën leid je er uit af?"
        ,question_5: "Wat zijn je plannen komend evenement?"
        ,question_6: "Overige toevoeging? (optioneel)"
    },
});
const icons = Object.freeze({
    "choose": {
        icon: '<i class="fa-regular fa-square-check"></i>',
        text: oTranslations[language].choose,
    },
    "remove": {
        icon: '<i class="fa-solid fa-xmark"></i>',
        text: oTranslations[language].remove,
    },
    "edit": {
        icon: '<i class="fa-solid fa-pen-to-square"></i>',
        text: oTranslations[language].edit,
    },
    "upgrade":{
        icon: '<i class="fa-solid fa-circle-up"></i>',
        text: oTranslations[language].upgrade,
    },
    "downgrade":{
        icon: '<i class="fa-solid fa-circle-down"></i>',
        text: oTranslations[language].downgrade,
    },
    "change":{
        icon: '<i class="fa-solid fa-rotate-right"></i>',
        text: oTranslations[language].change,
    },
    "loresheet":{
        icon: '<i class="fa-solid fa-scroll"></i>',
        text: oTranslations[language].loresheet,
    },
    "experience":{
        icon: '<i class="fa-solid fa-brain"></i>',
        text: oTranslations[language].experience,
    },
    "more_info":{
        icon: '<i class="fa-solid fa-circle-info"></i>',
        text: oTranslations[language].more_info,
    }
});
const iconset = Object.freeze({
    "new_skill_no_rank": Array("remove"),
    "new_skill_with_rank": Array("remove","upgrade"),
    "new_item": Array("remove"),
})
const jsonBaseChar = Object.freeze(JSON.parse($('input[name="jsonBaseChar"]').val()));
const jsonStat = Object.freeze(JSON.parse($('input[name="jsonStat"]').val()));

let oCharacter = {
    build: Object.assign({}, jsonBaseChar),
    race: {},
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