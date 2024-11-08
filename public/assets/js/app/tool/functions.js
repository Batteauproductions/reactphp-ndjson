//Generic settings and functions
import { debug, icons, iconset, jsonBaseChar, jsonStat, language, oTranslations, oCharacter } from './settings.js';
//Functions needed for actual app performance
import { addProfession } from './professions.js';
import { addSkill } from './skills.js';
import { addItem } from './equipment.js';

// This function wil throw messages to the console when on debug mode
function debugLog(message, ...optionalParams) {
    if (debug) {
        console.log(message, ...optionalParams);
    }
}

//This function will check if the character has enough xp available to buy the profession or skill
function checkXPCost(cost) {
    const deduction = parseInt(cost);
    if(oCharacter.build.spend_xp + deduction <= oCharacter.build.max_xp) {
        return true;
    } 
    return false;
};

//this function will check if an item already exists for the character
function checkDupplicateItem(attribute,main_id,sub_id=null) {
    let itemFound = false;
    for (let i = 0; i < attribute.length; i ++) {
        if(attribute[i].main_id == main_id && attribute[i].sub_id == sub_id) {            
            itemFound = true;
            break;
        } 
    }
    return itemFound;
}

//This function will check if the character has enough xp available to buy the profession or skill
function checkCurrencyCost(cost) {
    if (typeof cost === 'number') {
        if(oCharacter.build.currency - cost >= 0) {
            return true;
        } 
        return false;
    } else {
        console.error("checkCurrencyCost is not an number: " +$.type(cost));
    }    
};

//A helper function to turn the complete integer of the currency of the user into setting correct text
function currencyConvert(iAmount) {
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

//This function will handle the refund of experience
function currencyRefund(cost) {
    oCharacter.build.currency += cost;
    $('#stat-currency').html(currencyConvert(oCharacter.build.currency));
}

//This function will handle the spending of experience
//It should check if there is an attempt to spend more than available
function currencySpend(cost) {
    if((oCharacter.build.currency-cost) < 0) {
        console.error(`Attempt to spend more than available currency over maximum`);
        oCharacter.build.currency = 0;
    } else {
        oCharacter.build.currency -= cost;
    }
    $('#stat-currency').html(currencyConvert(oCharacter.build.currency));
}

//This function will add a container to the sheet
//container: the element in the DOM to add elements to
//element: the element that needs to be added
function elementAdd(container, element, type) {
    if (typeof element === 'object') {
        //console.log('element:',element)
        console.log(`element`,element)
        // Create master row to hold information
        const row = $('<div>', {
            class: 'grid-x choice-row animate__animated animate__fadeInLeft',
        });

        let arrColumn = [], column_name, column_subname, column_amount, column_cost, local_icons;
        // Create main name column
        column_name = $('<div>', {
            class: 'cell small-5 text-left',
            text: `${element.main_name} ${element.rank != null ? ` (${icons.rank.text} ${element.rank})` : ''}`
        });
        arrColumn.push(column_name);

        if (type === 'skill' || type === 'profession') {
            // Create sub name column (if exists)
            column_subname = $('<div>', {
                class: 'cell small-4 text-center',
                text: element.sub_name !== null ? element.sub_name : '-',
            });
            arrColumn.push(column_subname);
            // Create cost column
            column_cost = $('<div>', {
                class: 'cell small-1 text-right',
                html: element.race ? `${oTranslations[language].racial}` : `${element.cost}pt.`
            });    
            if(element.rank) {
                local_icons = iconset["new_skill_with_rank"];
            } else {
                local_icons = iconset["new_skill_no_rank"];
            }
            
            arrColumn.push(column_cost);
        } else if (type === 'item') {
            // Add column with amount of items
            column_amount = $('<div>', {
                class: 'cell small-2 text-right',
                text: `${element.amount}x`
            });
            arrColumn.push(column_amount);
            // Create cost column with money
            column_cost = $('<div>', {
                class: 'cell small-3 text-right',
                html: `${currencyConvert(element.cost)}`
            });
            local_icons = iconset["new_item"];
            arrColumn.push(column_cost);
        }
        // Create icon set column
        const arrIcons = local_icons.map(icon => $('<a>', {
            "data-action": `${type}-${icon}`,
            "data-id": element.main_id,
            "data-sub_id": element.sub_id,
            html: icons[icon].icon
        }));
        const column_action = $('<div>', {
            class: 'cell small-2 text-right',
            html: arrIcons
        });
        arrColumn.push(column_action);

        // Append columns to row
        row.append(arrColumn);

        // Insert row into container alphabetically
        const $container = $(`[data-id="${container}"]`);
        let inserted = false;

        $container.children('.choice-row').each(function () {
            const currentRow = $(this);
            const currentName = currentRow.find('.cell.small-5.text-left').text().trim();
            if (currentName.localeCompare(element.main_name, undefined, { sensitivity: 'base' }) > 0) {
                currentRow.before(row);
                inserted = true;
                return false; // break the loop
            }
        });

        if (!inserted) {
            $container.append(row);
        }
    } else {
        console.error("elementAdd: argument 'element' is not an object: " + $.type(element));
    }
}

//This function will handle the spending of experience
//It should check if there is an attempt to spend more than available
function experienceSpend(cost) {
    if((oCharacter.build.spend_xp+cost) > oCharacter.build.max_xp) {
        console.error(`Attempt to set XP over maximum`);
        oCharacter.build.spend_xp = oCharacter.build.max_xp;
    } else {
        oCharacter.build.spend_xp += cost;
    }
    $('#stat-spend_xp').text(oCharacter.build.spend_xp);
}

//This function will handle the refund of experience
//It should check if there is an attempt to refund more than zero
function experienceRefund(cost) {
    if((oCharacter.build.spend_xp-cost) < 0) {
        console.error(`Attempt to set XP under minimum`);
        oCharacter.build.spend_xp = 0;
    } else {
        oCharacter.build.spend_xp -= cost;
    }
    $('#stat-spend_xp').text(oCharacter.build.spend_xp);
}

//This function will handle the choice of of Profession, Skill and Items
//The parameters it will use are as followed
//--sAction: A simple rundown of the type of action being called. It should be profession, skill or item
//--oData, The choice made by the user
function handleChoice(sAction,oData) {

    const showErrorMessage = (msg) => showMessage($('#choice-actions'), 'error', `${oTranslations[language][msg]}`);
    const $Container = `${type}-list`;

    //create a temporary object stripping it of all information we don't need
    const oChoice = {
        main_id: parseInt(oTempData.details.id),
        main_name: oTempData.details.name,
        sub_id: $('select[name="subtype"] option:selected').val() ? parseInt($('select[name="subtype"] option:selected').val()) : null,
        sub_name: ($('select[name="subtype"] option:selected').val() !== '') ? $('select[name="subtype"] option:selected').text() : null,        
        rank: oTempData.rank,  
        modifier: oTempData.modifier,  
        cost: oTempData.cost,
        amount: oTempData.amount,
        sl_skill: 1,
        allow_multiple: oTempData.amount != 0 ? true : false,
    }

    //--Check if the costs can be deducted from the character
    //--bDeducted; will be used to check if the modal can be closed or should remain open
    let bDeducted = false;
    let addFunction;
    let attribute; 

    switch(type) {
        case "profession":
            attribute = oCharacter.profession;
            addFunction = addProfession;
            bDeducted = checkXPCost(oChoice.cost);
            if (!bDeducted) {
                showErrorMessage('not_enough_vp');
                return;
            }
            break;
        case "skill":
            attribute = oCharacter.skill;
            addFunction = addSkill;
            bDeducted = checkXPCost(oChoice.cost);
            if (!bDeducted) {
                showErrorMessage('not_enough_vp');
                return;
            }
            break;
        case "item":
            attribute = oCharacter.item;
            addFunction = addItem;
            bDeducted = checkCurrencyCost(oChoice.cost);
            if (!bDeducted) {
                showErrorMessage('not_enough_coin');
                return;
            }
            break;
        default:
            if (oTempData.subtype.length > 0 && oChoice.sub_id === null) {
                showErrorMessage('choose_sub');
                return;
            }
            break;
    }
    // Ensure addFunction is assigned before calling it
    if(!checkDupplicateItem(attribute,oChoice.main_id,oChoice.sub_id)){
        if (typeof addFunction === 'function') {
            addFunction(oChoice);
            elementAdd($Container, oChoice, type);
            // Close the pop-up
            $('#selection-modal').foundation('close');
        } else {
            console.error(`No addFunction defined for type: ${type}`);
        }
    } else {
        showErrorMessage('duplicate_choose');
    }
}

function initiateEditor() {
	/////////////////////////////////////////////////////////////////////////////////
	/////LIBRARY FUNCTION FOR THE WYSIWYG EDITOR DOCUMENTATION CAN BE FOUND ON  /////
	/////THE WEBSITE: https://ckeditor.com/ (ckeditor5-build-classic-34.1.0)	/////
	/////////////////////////////////////////////////////////////////////////////////
	const maxCharacters = 10000;
	const container = document.querySelector('#ck-count-container' );
	const progressCircle = document.querySelector( '.update__chart__circle' );
	const charactersBox = document.querySelector( '.update__chart__characters' );
	const wordsBox = document.querySelector( '.update__words' );
	const circleCircumference = Math.floor( 2 * Math.PI * progressCircle.getAttribute( 'r' ) );
	//const updateButton = document.querySelector( '#update-btn' );
	//const saveButton = document.querySelector( '#save-btn' );
	
	ClassicEditor.create( document.querySelector( '#background' ), {
		attributes: { 'color': '#fff' },
		heading: {
			options: [
				{ model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
				{ model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
				{ model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
				{ model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' }
			]
		},
		wordCount: {			
            onUpdate: stats => {
                const charactersProgress = stats.characters / maxCharacters * circleCircumference;
                const isLimitExceeded = stats.characters > maxCharacters;
                const isCloseToLimit = !isLimitExceeded && stats.characters > maxCharacters * .8;
                const circleDashArray = Math.min( charactersProgress, circleCircumference );

                // Set the stroke of the circle to show how many characters were typed.
                progressCircle.setAttribute( 'stroke-dasharray', `${ circleDashArray },${ circleCircumference }` );

                // Display the number of characters in the progress chart. When the limit is exceeded,
                // display how many characters should be removed.
                if ( isLimitExceeded ) {
                    charactersBox.textContent = `-${ stats.characters - maxCharacters }`;
                } else {
                    charactersBox.textContent = stats.characters;
                }

                wordsBox.textContent = `Woorden: ${ stats.words }`;

                // If the content length is close to the character limit, add a CSS class to warn the user.
                container.classList.toggle( 'update__limit-close', isCloseToLimit );

                // If the character limit is exceeded, add a CSS class that makes the content's background red.
                container.classList.toggle( 'update__limit-exceeded', isLimitExceeded );
				
				// If the character limit is exceeded, disable the send button.
                //updateButton.toggleAttribute( 'disabled', isLimitExceeded );
                //saveButton.toggleAttribute( 'disabled', isLimitExceeded );
            }
        }
		
	})
	.then( editor => {
		editor.model.document.on('change:data', (evt, data) => {
			oCharacter.meta.background = editor.getData();
            updateCharacter();
		});
	})
	.catch( error => {
		console.error(error)
	});	
}

// A simple function to insert a paragraph into the dom with a class and message
function showMessage(element,type,message) {    
    $(element).prepend($('<p>',{ class: `input-message input-${type} animate__animated animate__shakeX`, text: message}));
}

// A simple function to stringify the character object
function updateCharacter() {
    $('input[name="character"]').val(JSON.stringify(oCharacter));
}

function calculateIncrease(id) {
    let increase = 0;
    // Helper function to calculate the increase for each category
    var calculateForCategory = (category) => {
        if ($.isArray(category)) {
            $.each(category, function(key, value) {
                if ($.isArray(value.modifier)) {
                    for (let i = 0; i < value.modifier.length; i++) {
                        if (value.modifier[i].id == id) {
                            increase += value.rank > 1 ? value.rank : 1;
                        }
                    }
                } 
            });
        } else {
            if(category.modifier == id) {
                increase ++
            }
        }
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

    // Define calculation rules
    const statMappings = {
        max_xp: { base: jsonBaseChar.max_xp, factor: 8, stat: jsonStat.xp },
        currency: { base: jsonBaseChar.currency, factor: 10, stat: jsonStat.currency },
        hp: { base: jsonBaseChar.hp, factor: 2, stat: jsonStat.hp },
        sanity: { base: jsonBaseChar.sanity, factor: 1, stat: jsonStat.sanity },
        mana: { base: jsonBaseChar.mana, factor: 7, stat: jsonStat.mana, additionalFactor: 9, additionalStat: jsonStat.mana_minor },
        gp: { base: jsonBaseChar.gp, factor: 6, stat: jsonStat.gp },
        str: { base: jsonBaseChar.str, factor: 4, stat: jsonStat.str },
        dex: { base: jsonBaseChar.dex, factor: 3, stat: jsonStat.dex },
        intel: { base: jsonBaseChar.intel, factor: 5, stat: jsonStat.intel },
        clues: { base: jsonBaseChar.intel, factor: 5, stat: jsonStat.intel },
        favour: { base: jsonBaseChar.favour, factor: 11, stat: jsonStat.favour }
    };

    // Calculate and update oCharacter.build properties
    for (const [key, { base, factor, stat, additionalFactor, additionalStat }] of Object.entries(statMappings)) {
        oCharacter.build[key] = base + (calculateIncrease(factor) * stat);
        if (additionalFactor && additionalStat) {
            oCharacter.build[key] += calculateIncrease(additionalFactor) * additionalStat;
        }
    }

    // Update the text on the sheet per modifier
    $.each(oCharacter.build, function(key, value) {
        const content = (key === "currency") ? currencyConvert(value) : value;
        $(`#stat-${key}`).html(content);
    });
}

export {  
    debugLog,
    checkDupplicateItem,
    checkXPCost,
    checkCurrencyCost,
    currencyConvert,
    experienceSpend,
    elementAdd,
    handleChoice,
    initiateEditor,
    showMessage,
    updateCharacter,    
    updateCharacterStats,
}