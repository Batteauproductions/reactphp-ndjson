// Importing the variables
import { jsonBaseChar,jsonStat,arrXP,arrProfLevel,oCharacter,icons,oTranslations, language} from './settings.js';

function _construct(obj=null)
{
    console.log(oCharacter);
    
    if (obj !== null && obj !== undefined && obj !== '') {        
        let json_obj = JSON.parse(obj);
        console.log('character received', json_obj);
        oCharacter.status = 'existing';
    } else {
        console.log('No character information received, treating as new');
        oCharacter.status = 'new';
    }

    $('#stat-currency').html(convertCurrency(oCharacter.build.currency));
}

//This function serves as a "helper", to calculate the proper costs
//obj: the rank of the profession or skill
//--professions are based on the xp cost growth, this is not the same across ranks
function calculateProfessionCost(obj) {
    if (typeof obj === 'object') {
        let iTotalcost = 0;
        //increases cost per rank
        for(let i=0; i<obj.rank; i++) {
            iTotalcost += parseInt(arrProfLevel[i]);
        }
        return parseInt(iTotalcost);
    } else {
        console.error(`calculateProfessionCost is not an object: ${$.type(obj)}`);
    }
}
//--skills are allways calculated by rank increase and initial cost
function calculateSkillCost(obj) {
    console.log(obj);
    if (typeof obj === 'object') {
        if(obj.rank !== null) {
            return parseInt(obj.rank) * parseInt(obj.xp_cost);
        }
        return parseInt(obj.xp_cost);
    } else {
        console.error(`calculateSkillCost is not an object: ${$.type(obj)}`);
    }
}

//This function will check if the character has enough xp available to buy the profession or skill
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

//This function will check if the character has enough xp available to buy the profession or skill
function checkCurrencyCost(cost) {
    if (typeof cost === 'number') {
        if(oCharacter.build.currency - cost >= 0) {
            return true;
        } 
        return false;
    } else {
        console.error("checkXPCost is not an number: " +$.type(cost));
    }    
};

//A helper function to turn the complete integer of the currency of the user into setting correct text
function convertCurrency(iAmount) {
    const iCurrency = parseInt(iAmount);

    const iGold = Math.floor(iCurrency / 100);
    const iSilver = Math.floor((iCurrency % 100) / 10);
    const iCopper = iCurrency % 10;

    const iSize = 20;

    const sGold = iGold > 0 ? `${iGold} <img title="${oTranslations[language].gold}" src="${window.location.origin}/assets/images/elements/coin_gold.png" style="height:${iSize}x; width:${iSize}px"/>` : '';
    const sSilver = iSilver > 0 ? `${iSilver} <img title="${oTranslations[language].silver}" src="${window.location.origin}/assets/images/elements/coin_silver.png" style="height:${iSize}px; width:${iSize}px"/>` : '';
    const sCopper = iCopper > 0 ? `${iCopper} <img title="${oTranslations[language].copper}" src="${window.location.origin}/assets/images/elements/coin_copper.png" style="height:${iSize}px; width:${iSize}px"/>` : '';

    const sCurrency = `${sGold} ${sSilver} ${sCopper}`.trim();
    return sCurrency;
}

//This function will add a container to the sheet
//container: the element in the DOM to add elements to
//element: the element that needs to be added
function elementAdd(container, element, type) {
    if (typeof element === 'object') {
        console.log(element);

        //--create master container
        var row = $('<div>', {
            class: 'grid-x choice-row animate__animated animate__slideInDown',
        });

        //--create main name column
        var column_name = $('<div>', {
            class: 'cell small-5 text-left',
            text: `${element.main_name}${element.rank !== null ? ` (niveau ${element.rank})` : ''}`
        });

        if(type === 'skill' || type === 'profession') {
            //--create sub name (if exists)
            var column_subname = $('<div>', {
                class: 'cell small-4 text-center',
                text: `${element.sub_name !== null ? ` ${element.sub_name}` : '-'}`,
            });

            //--create xp cost column
            var column_cost = $('<div>', {
                class: 'cell small-1 text-right',
                text: `${element.xp_cost}pt.`
            });
        } else if (type === 'item') {
            
        }
        
        //--create icon set column
        var iconSet = ["upgrade","remove"];
        var arrIcons = [];
        for (var i=0; i<iconSet.length; i++) {
            var action = $('<a>', {
                "data-action": iconSet[i],
                "data-id": element.main_id,
                "data-sub_id": element.sub_id,
                html: icons[iconSet[i]].icon
            });
            arrIcons.push(action)
        }        
        var column_action = $('<div>', {
            class: 'cell small-2 text-right',
            html: arrIcons
        });
         
        $(row).append(column_name,column_subname,column_cost,column_action);      
        $(`#${container}`).prepend(row);
    } else {
        console.error("elementAdd is not an object: " +$.type(element));
    }
}

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

function modalSet (data,action) {
    //check if the data has a subtype                
    if (data.hasOwnProperty('subtype') && data.subtype.length > 0) {                    
        //add new options

        for(var i=0; i< data.subtype.length; i++) {
            var option = $('<option>', {
                value: data.subtype[i].id,
                text: data.subtype[i].name
            });
            $('select[name="subtype"]').append(option);
        }
        $('select[name="subtype"]').show();
    };
    if(data.details.max_rank !== null) {
        for(var i=1; i<=data.details.max_rank; i++ ) {
            var label = $('<label>', {
                for: `rank-${i}`,
                text: `${oTranslations[language].rank} - ${i}`,
            });
            var option = $('<input>', {
                id: `rank-${i}`,
                value: i,
                type: "radio",
                name: "rank",
            });
            $('#rank-options').append(label, option);
        }
        $('#rank-options').show();
    }
    //fill the content                
    $(`#description h1[data-title]`).html(data.details.name);
    $(`#description p[data-description]`).html(data.details.description);
    if(data.details.hasOwnProperty('xp_cost')) {
        $('#description p[data-cost]').show().html(`${data.details.xp_cost} vp`);
    } else if (data.details.hasOwnProperty('price')) {
        $('#description p[data-cost]').show().html(convertCurrency(data.details.price));
    } else {
        $('#description p[data-cost]').hide();
    }
    $(`a[data-action]`).data('action',`${action}-choose`);
    $(`#description a[data-link]`).attr('href',`https://larp.dalaria.nl/wp-content/uploads/documents/KvD-Basisregels.pdf#page=${data.details.rule_page}`);
    $(`#description`).show();
}

//
function showMessage (element,type, message) {    
    switch(type) {
        case 'done':
            console.log(message);
            break;
        case 'error':
            $(element).addClass('input-error').text(message).show();
            break;
    }
}

function updateCharacter() {
    $('input[name="character"]').val(JSON.stringify(oCharacter));
}

function calculateIncrease(id) {
    let increase = 0;
    // Helper function to calculate the increase for each category
    var calculateForCategory = (category) => {
        $.each(category, function(key, value) {
            if ($.isArray(value.modifier)) {
                for (let i = 0; i < value.modifier.length; i++) {
                    if (value.modifier[i].id == id) {
                        increase += value.rank > 1 ? value.rank : 1;
                    }
                }
            } 
        });
    }

    // Calculate increase for race, profession, and skills
    calculateForCategory(oCharacter.race);
    calculateForCategory(oCharacter.profession);
    calculateForCategory(oCharacter.skills);

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
//---11: INCREASE_BASE_FAVOR
function updateCharacterStats() {
    //--adjust the stats of the character
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
    //--update the text on the sheet per modifier
    $.each(oCharacter.build, function(key,value) {
        $(`#stat-${key}`).text(value);
    });
    //update the object
    updateCharacter();
}

export {  
    _construct, 
    calculateProfessionCost,
    calculateSkillCost,
    checkXPCost,
    checkCurrencyCost,
    convertCurrency,
    experienceSpend,
    elementAdd,
    modalSet,
    showMessage,
    updateCharacter,    
    updateCharacterStats,
}