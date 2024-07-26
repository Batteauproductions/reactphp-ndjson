// Importing the variables
import { 
        choice_skills
        ,domain
        ,icons
        ,iconset
        ,jsonBaseChar
        ,jsonStat
        ,language
        ,oTranslations      
        ,oCharacter
} from './settings.js';

/*
This function will construct the sheet of the character based on information parsed.
When the document is ready, this function will be called, it will call this function.
The controller sets the content of the page and once iniatiated a the value of a hidden input field
determenes if the character is new or existing:
-- if new, the standard calls will be made
-- if existing, data should be shown on the sheet
*/
function _construct(obj=null) {
    if (obj !== null && obj !== undefined && obj !== '') { 
        const json_obj = JSON.parse(obj);
        console.log('Character information received, treating as excisting', json_obj);   
        oCharacter = json_obj;            
        oCharacter.status = 'existing';
    } else {
        console.log('No character information received, treating as new');
        oCharacter.status = 'new';        
        $('body').find('[data-open="adventure-modal"]').addClass('disabled');
    }
    initiateEditor();
    $('#stat-currency').html(currencyConvert(oCharacter.build.currency));
}

/*Add elements to the character
//-attribute: 
---oCharacter.profession
---oCharacter.skills
---oCharacter.items
//-type:
---profession
---skill
---item
//-subject: the object that is being parsed
*/
function characterAddTo(attribute,type,subject) {
    if (typeof subject === 'object') {
        
        //firstly: add the subject to the attribute called
        attribute.push(subject);

        //secondly: spend the experience / currency needed for this subject
        if (type === "profession" || type === "skill") {
            experienceSpend(subject.cost);
        } else if (type === "item") {
            currencySpend(subject.cost);
        }         

        //thirdly: check if the subject has a modifier, if so update the character stats
        if (subject.modifier.length > 0) {
            updateCharacterStats();
        }   
        
    } else {
        console.error("characterAddTo: argument 'subject' is not an object: " + $.type(subject));
    }
}

/*--characterRemoveFrom
//-attribute: 
---oCharacter.profession
---oCharacter.skills
---oCharacter.items
//-element: The element that is calling the action, is basically $(this)
//-main_id: The main_id of the skill/profession/item
//-sub_id: The sub_id of the skill/profession/item
*/
function characterRemoveFrom(attribute,element,type,main_id,sub_id=null) {
    let itemFound = false;
    let subject = {};
    //runs through the entire list of items in the attribute and stops when found
    for (let i = 0; i < attribute.length; i ++) {
        if(attribute[i].main_id == main_id && attribute[i].sub_id == sub_id) {            
            subject = attribute[i];
            attribute.splice(i,1);
            itemFound = true;
            break;
        } else {  
            console.error('characterRemoveFrom: Item not found');        
        }
    }
    if (!itemFound) {
        console.error('Item not found');
    } else {  
        if (subject.modifier && subject.modifier.length > 0) {
            updateCharacterStats();
        }
        if (type === "profession" || type === "skill") {
            experienceRefund(subject.cost);
        } else if (type === "item") {
            currencyRefund(subject.cost);
        }
        //check if the subject has a modifier
        if (subject.modifier.length > 0) {
            updateCharacterStats();
        }
        //remove the element from the DOM
        element.parent().parent().remove();
    } 
}

//This function serves as a "helper", to calculate the proper costs
//obj: the rank of the profession or skill
//--professions are based on the xp cost growth, this is not the same across ranks
function calculateProfessionCost(obj,rank) {
    let iTotalCost = 0;
    for (let i = 1; i <= rank; i++) {
        const cost = parseInt(obj.details[`rank_${i}_cost`]);
        iTotalCost += cost;
    }    
    return iTotalCost;
}
//--skills are allways calculated by rank increase and initial cost
function calculateSkillCost(obj,rank) {
    if(rank !== null) {
        return parseInt(obj.details.xp_cost) * parseInt(rank);
    }
    return parseInt(obj.details.xp_cost);
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
        console.log('element:',element)

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
            local_icons = iconset["new_skill_no_rank"];
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
        console.warn(`Attempt to set XP under minimum`);
        oCharacter.build.spend_xp = 0;
    } else {
        oCharacter.build.spend_xp -= cost;
    }
    $('#stat-spend_xp').text(oCharacter.build.spend_xp);
}

//This function will handle the choice of of Profession, Skill and Items
//The parameters it will use are as followed
//--oTempData, The choice made by the user
//--addFunction, The function it should perform once an item can be added
//--action: The action being called, it corresponds with a[data-action] from the app.js
//--type: A simple rundown of the type of action being called. It should be profession, skill or item
function handleChoice(oTempData,addFunction,action,type) {

    const showErrorMessage = (msg) => showMessage($('#choice-actions'), 'error', `${oTranslations[language][msg]}`);
    const $Container = action.replace('-choose','-list');

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
    }

    //--Check if the costs can be deducted from the character
    //--bDeducted; will be used to check if the modal can be closed or should remain open
    let bDeducted = false;

    if (type === "profession" || type === "skill") {
        bDeducted = checkXPCost(oChoice.cost);
        if (!bDeducted) {
            showErrorMessage('not_enough_vp');
            return;
        }
    } else if (type === "item") {
        bDeducted = checkCurrencyCost(oChoice.cost);
        if (!bDeducted) {
            showErrorMessage('not_enough_coin');
            return;
        }
    } else if (oTempData.subtype.length > 0 && oChoice.sub_id === null) { 
        showErrorMessage('choose_sub');                        
        return;
    }

    addFunction(oChoice);
    elementAdd($Container, oChoice, type);

    // Close the pop-up
    $('#selection-modal').foundation('close');
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

//--MODAL--//
const $typeSelect = $('select[name="type"]');
const $subtypeSelect = $('select[name="subtype"]');
const $choice_image = $('#choice-image');
const $choice_description = $('#choice-description');
const $choice_details = $('#choice-details');
const $choice_actions = $('#choice-actions');

/*modalClear
--complete, weither the modal should be completely cleared
*/
function modalClear(complete=false) {
    // Clear previous content
    if(complete) {
        $typeSelect.empty().hide();
    }
    $choice_image.attr('src','').hide();
    $subtypeSelect.empty().hide();
    $choice_description.empty().hide();
    $choice_details.empty().hide();
    $choice_actions.empty().hide();
}

function modalSet(data, action) {

    modalClear();

    // Check if the data has a subtype, otherwise add new options
    if (data.subtype && data.subtype.length > 0) {
        const options = data.subtype.map(subtype => $('<option>', {
            value: subtype.id,
            text: subtype.name
        }));
        $subtypeSelect.append(options).show();
    }

    // Create and append content elements if they exist
    //Always check if the attribute is set, if not do not add to the model

    /*-- update the image --*/
    let subtypeValue = $('[name="subtype"]').val();
    if(action === "profession") {
        if (data.details.id && subtypeValue) {
            $choice_image.attr('src',`${domain}/assets/images/profession/prof_${data.details.id}_${subtypeValue}.png`).show();
        } else if (data.details.id) {
            $choice_image.attr('src',`${domain}/assets/images/profession/prof_${data.details.id}.png`).show();
        }    
    }

    /*--contentElements-- */
    //The base description of the race, profession or skill
    const contentElements = [];
    if (data.details.name) {
        contentElements.push($('<h1>', { html: data.details.name }));
    }
    if (data.details.description) {
        contentElements.push($('<p>', { html: data.details.description }));
    }
    if (data.details.advanced_description) {
        contentElements.push($('<p>', { html: data.details.advanced_description }));
    }       
    $choice_description.append(contentElements).show();

    /* --contentDetailsElements-- */
    //Extra information (shown in box) of the race, profession or skill
    const contentDetailsElements = [];
    if (data.details.disclaimer) {        
        contentDetailsElements.push($('<p>', { html: `${icons.disclaimer.icon} ${data.details.disclaimer}` }));
    } 
    if (data.details.requirement_name) {        
        contentDetailsElements.push($('<p>', { html: `${icons.required.icon} ${data.details.requirement_name}` }));
    } 
    if (data.details.loresheet) {        
        contentDetailsElements.push($('<p>', { html: `${icons.loresheet.icon} ${icons.loresheet.text}` }));
    }   
    //if the choice has a option of modifier, give the option to choose, otherwise just show 
    if(data.modifier && data.modifier.length > 1) {        
        for(let i = 0; i < data.modifier.length; i++) {
            var name = data.modifier[i].name;
            var row = $('<div>', { class: `choice-row` });
            var input = $('<input>', { id: `modifier-${i}`, value: data.modifier[i].id, type: 'radio', name: 'stat-modifier' });
            var label = $('<label>', { for: `modifier-${i}`, html: `${icons[name.toLowerCase()].icon} ${icons[name.toLowerCase()].text}` });
            row.append(input, label);
            contentDetailsElements.push(row);
        }        
    } else if (data.modifier && data.modifier.length == 1) {
        var name = data.modifier[0].name;
        contentDetailsElements.push($('<p>', { html: `${icons[name.toLowerCase()].icon} ${icons[name.toLowerCase()].text}` }));
    }
    //if the choice has ranks to choice, give the option to choose the rank
    if (data.details.max_rank) {
        var $row = $('<div>', { html: `${icons.rank.icon}` })
        for (let i = 1; i <= data.details.max_rank; i++) {
            $row.append(
                $('<input>', { id: `rank-${i}`, value: i, type: 'radio', name: 'rank' })
                ,$('<label>', { for: `rank-${i}`, text: ` ${i}` })
            );
        }
        contentDetailsElements.push($row)
    }

    //split based on action, shows in the contentDetailsElements container
    switch (action) {
        case 'skill_base':
        case 'skill_combat':
        case 'skill_magic':
            contentDetailsElements.push($('<p>', { html: `${icons.experience.icon} <span id="rank_cost">${data.details.xp_cost}</span> ${icons.experience.text}`}));
            break;
        case 'profession':
            contentDetailsElements.push($('<p>', { html: `${icons.experience.icon} ${data.details.rank_1_cost} ${icons.experience.text}`}));
            break;
        case 'item_add':
            contentDetailsElements.push($('<p>', { html: currencyConvert(data.details.price) }));
            break;
        default: 
            console.warn(`Unused action of ${action} has been called`);
            break;
    }

    //--choice skills
    if (data.skills && data.skills.length > 1) {
        data.skills.forEach(skill => {
            //Declare variables
            const { main_id, main_name, sub_id, sub_name, options } = skill;
            const row = $('<div>', { 'data-raceskill': '', class: 'choice-row' });
            // Check if the skills has options
            if (options) {
                //Create DOM elements
                const $label = $('<label>', { text: main_name, for: 'subtype-dropdown' });
                const $select = $('<select>', { id: 'subtype-dropdown' });
                // Iterate over the object to create <option> elements
                $.each(options, (key, value) => {
                    const $option = $('<option>', {
                        value: value.id,
                        text: value.name
                    });
                    // Append the option to the select element
                    $select.append($option);
                });
                row.append($label, $select);
            } else {
                row.html(`<p>${main_name} - ${sub_name}</p>`);
                skill.race = true;
                choice_skills.push(skill);
            }
            contentDetailsElements.push(row);
        });

    }
    
    //if there are details, show them on the page
    if(contentDetailsElements.length > 0) {
        $choice_details.append(contentDetailsElements).show();
    }
        
    /*--contentActionsElements-- */
    const contentActionsElements = [];
    contentActionsElements.push($('<a>', { 
        class: 'button solid','data-action': `${action}-choose`
        ,html: `${icons.choose.icon} ${icons.choose.text}`})
    )
    if (data.details.rule_page) {
        contentActionsElements.push($('<a>', { 
            class: 'button clear'
            ,target: '_blank'
            ,href: `https://larp.dalaria.nl/wp-content/uploads/documents/KvD-Basisregels.pdf#page=${data.details.rule_page}`
            ,html: `${icons.more_info.icon} ${icons.more_info.text}`})
        );
    }
    $choice_actions.append(contentActionsElements).show();;

}

//
function showMessage (element,type, message) {    
    console.log(`showMessage(${element},${type},${message})`)
    switch(type) {
        case 'done':
            console.log(message);
            break;
        case 'error':
            $(element).prepend($('<p>',{ class: "input-message input-error", text: message}));
            break;
    }
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
        clues: { base: jsonBaseChar.intel, factor: 5, stat: jsonStat.intel }
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

    // Update the object
    updateCharacter();
    console.log(oCharacter);
}

export {  
    _construct, 
    characterAddTo,
    characterRemoveFrom,
    calculateProfessionCost,
    calculateSkillCost,
    checkXPCost,
    checkCurrencyCost,
    currencyConvert,
    experienceSpend,
    elementAdd,
    handleChoice,
    initiateEditor,
    modalClear,
    modalSet,
    showMessage,
    updateCharacter,    
    updateCharacterStats,
}