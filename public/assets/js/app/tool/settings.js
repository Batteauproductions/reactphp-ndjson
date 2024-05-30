//oSettings
const domain = window.location.origin;
const jsonBaseChar = Object.freeze(JSON.parse($('input[name="jsonBaseChar"]').val()));
const jsonStat = Object.freeze(JSON.parse($('input[name="jsonStat"]').val()));
const arrXP = Object.freeze($('input[name="arrXP"]').val().split(","));
const arrProfLevel = Object.freeze($('input[name="arrProfLevel"]').val().split(","));
const oTranslations = Object.freeze({
    "nl-NL": {
        not_enough_vp: 'Je hebt niet genoeg vaardigheidspunten.'
        ,choose_sub: 'Kies een subclasse'
        ,rank: "Niveau"
        ,remove: "verwijderen"
        ,edit: "aanpassen"
        ,upgrade: "verhogen"
        ,downgrade: "verlagen"
        ,change: "veranderen"
    },
});

let language = 'nl-NL';

const icons = Object.freeze({
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
});
const iconset = Object.freeze({
    "new_skill_no_rank": Array("remove"),
    "new_skill_with_rank": Array("remove","upgrade"),
})

let oCharacter = {
    build: Object.assign({}, jsonBaseChar),
    race: {},
    profession: [],
    skills: [], 
}

export {
    jsonBaseChar,
    jsonStat,
    arrXP,
    icons,
    arrProfLevel,
    oTranslations,
    language,
    oCharacter,
    domain,
}