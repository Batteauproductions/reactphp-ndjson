const oSettings = {
    jsonBaseChar: JSON.parse($('input[name="jsonBaseChar"]').val()),
    jsonStat: JSON.parse($('input[name="jsonStat"]').val()),
    arrXP: $('input[name="arrXP"]').val().split(","),
    arrProfLevel: $('input[name="arrProfLevel"]').val().split(","),
};

let oCharacter = {
    build: oSettings.jsonBaseChar,
    race: {},
    profession: [],
    skills: [], 
}

export {
    oSettings,
    oCharacter,
}