//oSettings
const jsonBaseChar = Object.freeze(JSON.parse($('input[name="jsonBaseChar"]').val()));
const jsonStat = Object.freeze(JSON.parse($('input[name="jsonStat"]').val()));
const arrXP = Object.freeze($('input[name="arrXP"]').val().split(","));
const arrProfLevel = Object.freeze($('input[name="arrProfLevel"]').val().split(","));

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
    oCharacter,
}