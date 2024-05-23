//oSettings
const jsonBaseChar = Object.freeze(JSON.parse($('input[name="jsonBaseChar"]').val()));
const jsonStat = Object.freeze(JSON.parse($('input[name="jsonStat"]').val()));
const arrXP = Object.freeze($('input[name="arrXP"]').val().split(","));
const arrProfLevel = Object.freeze($('input[name="arrProfLevel"]').val().split(","));
const oTranslations = Object.freeze({
    "nl-NL": {
        not_enough_vp: 'Je hebt niet genoeg vaardigheidspunten.',
        choose_sub: 'Kies een subclasse',
        rank: "Niveau"
    },
    "en-GB": {
        not_enough_vp: 'Je hebt niet genoeg vaardigheidspunten.',
        choose_sub: 'Kies een subclasse',
        rank: "Level"
    }
});

let language = 'nl-NL';

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
    arrProfLevel,
    oTranslations,
    language,
    oCharacter,
}