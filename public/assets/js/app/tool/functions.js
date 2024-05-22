// Importing the variables
import { jsonBaseChar,jsonStat,arrXP,arrProfLevel,oCharacter } from './settings.js';

function _construct(obj=null)
{
    console.log(oCharacter);
    
    if (obj !== null && obj !== undefined && obj !== '') {        
        let json_obj = JSON.parse(obj);
        console.log('character received', json_obj);
    } else {
        console.log('No character information received, treating as new');
    }
}

//This function serves as a "helper", to calculate the proper profession costs
//rank: the rank of the profession
function calculateProfessionCost(rank) {
    if (typeof rank === 'number') {
        let iTotalcost = 0;
        for(let i=0; i<rank; i++) {
            iTotalcost += parseInt(arrProfLevel[i]);
        }
        return parseInt(iTotalcost);
    } else {
        console.error("calculateProfessionCost is not an number: " +$.type(rank));
    }
}

function checkXPCost(cost) {
    if (typeof cost === 'number') {
        if(oCharacter.build.spend_xp + cost <= oCharacter.build.max_xp) {
            return true;
        } 
        return false;
    } else {
        console.error("checkXPCost is not an number: " +$.type(cost));
    }    
};

//This function will add a container to the sheet
//container: the element in the DOM to add elements to
//element: the element that needs to be added
function elementAdd(container, element) {
    if (typeof element === 'object') {
        var name = $('<div>', {
            class: 'cell small-6 text-left',
            text: `${element.main_name}${element.rank !== null ? ` (niveau ${element.rank})` : ''}`
        });
        var subtype = $('<div>', {
            class: 'cell small-4 text-center',
            text: `${element.sub_name !== null ? ` ${element.sub_name}` : '-'}`,
        });
        var cost = $('<div>', {
            class: 'cell small-2 text-right',
            text: `${element.xp_cost}pt.`
        });
        $(`#${container}`).prepend(name,subtype,cost);
    } else {
        console.error("elementAdd is not an object: " +$.type(element));
    }
}

//This function will 
function experienceSpend(cost) {
    if((oCharacter.build.spend_xp+cost) > oCharacter.build.max_xp) {
        console.warn(`Attempt to set XP over maximum`);
        oCharacter.build.spend_xp = oCharacter.build.max_xp;
    } else {
        oCharacter.build.spend_xp += cost;
    }
    $('#spend_xp').text(oCharacter.build.spend_xp);
}
function experienceRefund(cost) {
    if((oCharacter.build.spend_xp-cost) < 0) {
        console.warn(`Attempt to set XP under minimum`);
        oCharacter.build.spend_xp = 0;
    } else {
        oCharacter.build.spend_xp -= cost;
    }
    $('#spend_xp').text(oCharacter.build.spend_xp);
}

//
function showMessage (type, message) {
    switch(type) {
        case 'done':
            console.log(message);
            break;
        case 'error':
            console.log(message);
            break;
    }
}

//These functions deal with adding, altering or removing skills from the character
//obj: The skill that is being parsed
function skillAdd(obj) {
    if (typeof obj === 'object') {
        oCharacter.skills.push(obj);
        experienceSpend(obj.xp_cost);
    } else {
        console.error("skillAdd is not an object: " +$.type(obj));
    }
}

function skillRemove(obj) {
    if (typeof obj === 'object') {
        oCharacter.skills.splice(obj);
        experienceRefund(obj.xp_cost);
    } else {
        console.error("skillRemove is not an object: " +$.type(obj));
    }
}

//These functions deal with adding, altering or removing professions from the character
//obj: The profession that is being parsed
function professionAdd(obj) {
    if (typeof obj === 'object') {
        oCharacter.profession.push(obj);
        experienceSpend(calculateProfessionCost(obj.rank));
    } else {
        console.error("professionAdd is not an object: " +$.type(obj));
    }
}

//This function will remove a profession to the character
//obj: The profession that is being parsed
function professionRemove(obj) {
    if (typeof obj === 'object') {
        
    } else {
        console.error("professionRemove is not an object: " +$.type(obj));
    }
}


function updateCharacter() {

}

function calculateIncrease(id) {	
	let increase = 0;
    	
    //--- race
	$.each(oCharacter.race, function(key,value) {
        if($.isArray(value.modifier)) {
            for(var i=0; i<value.modifier.length; i++) {
                if(value.modifier[i].id === id) {
                    increase ++;
                }
            }
        } else if (value.modifier.id === id) {
            increase ++;
        }        
    });
    //--- profession
    $.each(oCharacter.profession, function(key,value) {
        if($.isArray(value.modifier)) {
            for(var i=0; i<value.modifier.length; i++) {
                if(value.modifier[i].id === id) {
                    increase ++;
                }
            }            
        } else if (value.modifier.id === id) {
            increase ++;
        }        
    });
    //--- skills
    $.each(oCharacter.skills, function(key,value) {
        if($.isArray(value.modifier)) {
            for(var i=0; i<value.modifier.length; i++) {
                if(value.modifier[i].id == id) {
                    increase ++;
                }
            }
        } else if (value.modifier.id === id) {
            increase ++;
        }
    });

	return increase;
}

//This function updates the stats of the character	
//---1: INCREASE_BASE_SANITY
//---2: INCREASE_BASE_HEALTH
//---3: INCREASE_BASE_DEX
//---4: INCREASE_BASE_STR
//---5: INCREASE_BASE_INTEL
//---6: INCREASE_BASE_GODPOINTS
//---7: INCREASE_BASE_MANA
//---8: INCREASE_BASE_POINTS
//---9: INCREASE_BASE_MANA_MINOR
//---10: INCREASE_BASE_CURRENCY
function updateCharacterStats() {

    //oCharacter.build.currency = jsonBaseChar.currency+(calculateIncrease(10)*jsonStat.currency);
	oCharacter.build.hp = jsonBaseChar.hp+(calculateIncrease(2)*jsonStat.hp);
    oCharacter.build.sanity = jsonBaseChar.sanity+(calculateIncrease(1)*jsonStat.sanity);
    oCharacter.build.mana = jsonBaseChar.mana+(calculateIncrease(7)*jsonStat.mana);
    oCharacter.build.gp = jsonBaseChar.gp+(calculateIncrease(6)*jsonStat.gp);
    //oCharacter.build.favour = jsonBaseChar.favour+(calculateIncrease(6)*jsonStat.favour);
    oCharacter.build.str = jsonBaseChar.str+(calculateIncrease(4)*jsonStat.str);
    oCharacter.build.dex = jsonBaseChar.dex+(calculateIncrease(3)*jsonStat.dex);
    oCharacter.build.intel = jsonBaseChar.intel+(calculateIncrease(5)*jsonStat.intel);
    //oCharacter.build.clues = jsonBaseChar.clues+(calculateIncrease(6)*jsonStat.clues);

    //update the text
    $.each(oCharacter.build, function(key,value) {
        $(`#stat-${key}`).text(value);
    });
    //update the object
    $('input[name="character"]').val(JSON.stringify(oCharacter));

}

export {  
    _construct, 
    calculateProfessionCost,
    checkXPCost,
    elementAdd,
    professionAdd,
    showMessage,
    skillAdd,
    professionRemove,
    updateCharacter,    
    updateCharacterStats,
}