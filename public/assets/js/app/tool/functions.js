// Importing the variables
import { oSettings, oCharacter } from './settings.js';

//This function serves as a "helper", to calculate the proper profession costs
//rank: the rank of the profession
function calculateProfessionCost(rank) {
    if (typeof rank === 'number') {
        let iTotalcost = 0;
        for(let i=0; i<rank; i++) {
            iTotalcost += parseInt(oSettings.arrProfLevel[i]);
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
            text: `${element.main_name} (niveau ${element.rank})`
        });
        var subtype = $('<div>', {
            class: 'cell small-4 text-center',
            text: element.sub_name,
        });
        var cost = $('<div>', {
            class: 'cell small-2 text-right',
            text: `${calculateProfessionCost(element.rank)}pt.`
        });
        $(`#${container}`).prepend(name,subtype,cost);
    } else {
        console.error("elementAdd is not an object: " +$.type(element));
    }
}

//This function will 
function experienceSpend(cost) {
    oCharacter.build.spend_xp += cost;
    $('#spend_xp').text(oCharacter.build.spend_xp);
}
function experienceRefund(cost) {
    oCharacter.build.spend_xp -= cost;
    $('#spend_xp').text(oCharacter.build.spend_xp);
}

//This function will add a profession to the character
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
	/*//Sanity 
	window.oCharacter.sanity = window.chargen_settings.character.sanity+(calculateIncrease(1)*window.chargen_settings.stat_mod.sanity);
	$('#BASE_SANITY').html(window.oCharacter.sanity);
	//Health
	window.oCharacter.hp = window.chargen_settings.character.hp+(calculateIncrease(2)*window.chargen_settings.stat_mod.hp);
	$('#BASE_HEALTH').html(window.oCharacter.hp);
	//Dexterity
	window.oCharacter.dex = window.chargen_settings.character.dex+(calculateIncrease(3)*window.chargen_settings.stat_mod.dex);
	$('#BASE_DEX').html(window.oCharacter.dex);
	//Strength
	window.oCharacter.str = window.chargen_settings.character.str+(calculateIncrease(4)*window.chargen_settings.stat_mod.str);
	$('#BASE_STR').html(window.oCharacter.str);
	//Intelligence
	window.oCharacter.intel = window.chargen_settings.character.intel+(calculateIncrease(5)*window.chargen_settings.stat_mod.intel);
	$('#BASE_INT').html(window.oCharacter.intel);
	//Godpoints
	window.oCharacter.gp = window.chargen_settings.character.gp+(calculateIncrease(6)*window.chargen_settings.stat_mod.gp);
	$('#BASE_GODPOINTS').html(window.oCharacter.gp);		
	//Mana
	window.oCharacter.mana = window.chargen_settings.character.mana+(calculateIncrease(7)*window.chargen_settings.stat_mod.mana)+(calculateIncrease(9)*window.chargen_settings.stat_mod.mana_minor);
	$('#BASE_MANA').html(window.oCharacter.mana);
	//Available experience points
	
	//Check if NPC / DPC
	let dropdownValue = $('select[name="type_id"]').val();
	if (dropdownValue === '2' || dropdownValue === '3') {
		window.oCharacter.max_xp = 100;
	} else {
		window.oCharacter.max_xp = window.chargen_settings.character.max_xp+(calculateIncrease(8)*window.chargen_settings.stat_mod.xp)+adjustExperienceTotal();		
	}
	$('.BASE_POINTS').html(window.oCharacter.max_xp);
	adjustExperience();		
	
	$('#charObject').val(JSON.stringify(window.oCharacter));*/
}

export {    
    calculateProfessionCost,
    checkXPCost,
    elementAdd,
    professionAdd,
    professionRemove,
    updateCharacter,    
    updateCharacterStats,
}