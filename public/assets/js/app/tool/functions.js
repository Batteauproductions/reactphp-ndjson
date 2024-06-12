// Importing the variables
import { 
        arrXP
        ,icons
        ,iconset
        ,jsonBaseChar
        ,jsonStat
        ,language
        ,oTranslations      
        ,oCharacter
} from './settings.js';

function _construct(obj=null)
{
    console.log(oCharacter);
    
    if (obj !== null && obj !== undefined && obj !== '') {        
        let json_obj = JSON.parse(obj);
        oCharacter.status = 'existing';
    } else {
        console.log('No character information received, treating as new');
        oCharacter.status = 'new';
        initiateEditor();
        $('body').find('[data-open="adventure-modal"]').addClass('disabled');
    }

    $('#stat-currency').html(convertCurrency(oCharacter.build.currency));
}

//
function characterAddTo(attribute,type,subject) {
    //add the subject to the attribute called
    attribute.push(subject);
    if (type === "profession" || type === "skill") {
        experienceSpend(subject.cost);
    } else if (type === "item") {
        currencySpend(subject.cost);
    } 
    // Check if the choice has a stat modifier
     if (subject.modifier.length > 0) {
        updateCharacterStats();
    }   
    console.log('characterAddTo: ',oCharacter);
}

/*--characterRemoveFrom
//-attribute: 
---oCharacter.profession
---oCharacter.skills
---oCharacter.items
//-element: The element that is calling the action, is is basically $(this)
//-main_id: The main_id of the skill/profession/item
//-sub_id: The sub_id of the skill/profession/item*/
function characterRemoveFrom(attribute,element,type,main_id,sub_id=null) {
    let itemFound = false;
    let subject = {};
    for (let i = 0; i < attribute.length; i ++) {
        if(attribute[i].main_id == main_id && attribute[i].sub_id == sub_id) {            
            subject = attribute[i];
            attribute.splice(i,1);
            itemFound = true;
            break;
        } 
    }
    if (!itemFound) {
        console.error('Item not found');
    } else {  
        if (subject.modifier.length > 0) {
            updateCharacterStats();
        }
        if (type === "profession" || type === "skill") {
            experienceRefund(subject.cost);
        } else if (type === "item") {
            currencyRefund(subject.cost);
        }
        element.parent().parent().remove();
    }
    console.log('characterRemoveFrom: ',oCharacter);
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

//This function will handle the spending of experience
//It should check if there is an attempt to spend more than available
function currencySpend(cost) {
    if((oCharacter.build.currency-cost) < 0) {
        console.error(`Attempt to set currency over maximum`);
        oCharacter.build.currency = 0;
    } else {
        oCharacter.build.currency -= cost;
    }
    $('#stat-currency').html(convertCurrency(oCharacter.build.currency));
}

//This function will handle the refund of experience
//It should check if there is an attempt to refund more than zero
function currencyRefund(cost) {
    oCharacter.build.currency += cost;
    $('#stat-currency').html(convertCurrency(oCharacter.build.currency));
}

//This function will add a container to the sheet
//container: the element in the DOM to add elements to
//element: the element that needs to be added
function elementAdd(container, element, type) {
    if (typeof element === 'object') {

        // Create master container
        const row = $('<div>', {
            class: 'grid-x choice-row animate__animated animate__fadeInLeft',
        });

        // Create main name column
        const column_name = $('<div>', {
            class: 'cell small-5 text-left',
            text: `${element.main_name}${element.rank !== null ? ` (${icons.rank.text} ${element.rank})` : ''}`
        });

        let column_subname, column_amount, column_cost, local_icons;

        if (type === 'skill' || type === 'profession') {
            // Create sub name column (if exists)
            column_subname = $('<div>', {
                class: 'cell small-4 text-center',
                text: element.sub_name !== null ? element.sub_name : '-',
            });
            // Create cost column
            column_cost = $('<div>', {
                class: 'cell small-1 text-right',
                html: `${element.cost}pt.`
            });
            local_icons = iconset["new_skill_no_rank"];
        } else if (type === 'item') {
            column_amount = $('<div>', {
                class: 'cell small-2 text-right',
                text: `${element.amount}x`
            });
            column_cost = $('<div>', {
                class: 'cell small-3 text-right',
                html: `${convertCurrency(element.cost)}`
            });
            local_icons = iconset["new_item"];
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

        // Append columns to row
        row.append(column_name);
        if (column_subname) row.append(column_subname);
        if (column_amount) row.append(column_amount);
        if (column_cost) row.append(column_cost);
        row.append(column_action);

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
const $container = $('#choice-description');
const $container_details = $('#choice-details');
const $container_actions = $('#choice-actions');

/*modalClear
--complete, weither the modal should be completely cleared
*/
function modalClear(complete=false) {
    // Clear previous content
    if(complete) {
        $typeSelect.empty().hide();
    }
    $subtypeSelect.empty().hide();
    $container.empty().hide();
    $container_details.empty().hide();
    $container_actions.empty().hide();
}

function modalSet(data, action) {

    modalClear();

    // Check if the data has a subtype and add new options
    if (data.subtype && data.subtype.length > 0) {
        const options = data.subtype.map(subtype => $('<option>', {
            value: subtype.id,
            text: subtype.name
        }));
        $subtypeSelect.append(options).show();
    }

    // Create and append content elements if they exist
    /*--contentElements-- */
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
       
    $container.append(contentElements).show();

    /*--contentDetailsElements-- */
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
    if(data.modifier.length > 1) {        
        for(let i = 0; i < data.modifier.length; i++) {
            var name = data.modifier[i].name;
            contentDetailsElements.push(                
                $('<input>', { id: `modifier-${i}`, value: data.modifier[i].id, type: 'radio', name: 'stat-modifier' })
                ,$('<label>', { for: `modifier-${i}`, html: `${icons[name.toLowerCase()].icon} ${icons[name.toLowerCase()].text}` })
            );
        }        
    } else if (data.modifier.length == 1) {
        var name = data.modifier[0].name;
        contentDetailsElements.push($('<p>', { html: `${icons[name.toLowerCase()].icon} ${icons[name.toLowerCase()].text}` }));
    }
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
    if (action ==="skill_base" || action === "skill_combat" || action === "skill_magic") {
        contentDetailsElements.push($('<p>', { html: `${icons.experience.icon} <span id="rank_cost">${data.details.xp_cost}</span> ${icons.experience.text}`}));
    } else if (action === "profession") {
        contentDetailsElements.push($('<p>', { html: `${icons.experience.icon} ${data.details.rank_1_cost} ${icons.experience.text}`}));
    } else if (action === "item_add") {
        contentDetailsElements.push($('<p>', { html: convertCurrency(data.details.price) }));
    }
    $container_details.append(contentDetailsElements).show();;
    
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
    $container_actions.append(contentActionsElements).show();;

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
    oCharacter.build.max_xp = jsonBaseChar.max_xp+(calculateIncrease(8)*jsonStat.xp);
    oCharacter.build.currency = jsonBaseChar.currency+(calculateIncrease(10)*jsonStat.currency);
    //--adjust the stats of the character
	oCharacter.build.hp = jsonBaseChar.hp+(calculateIncrease(2)*jsonStat.hp);
    oCharacter.build.sanity = jsonBaseChar.sanity+(calculateIncrease(1)*jsonStat.sanity);
    oCharacter.build.mana = jsonBaseChar.mana+(calculateIncrease(7)*jsonStat.mana)+(calculateIncrease(9)*jsonStat.mana_minor);
    oCharacter.build.gp = jsonBaseChar.gp+(calculateIncrease(6)*jsonStat.gp);
    //oCharacter.build.favour = jsonBaseChar.favour+(calculateIncrease(6)*jsonStat.favour);
    //--adjust the powers of the character
    oCharacter.build.str = jsonBaseChar.str+(calculateIncrease(4)*jsonStat.str);
    oCharacter.build.dex = jsonBaseChar.dex+(calculateIncrease(3)*jsonStat.dex);
    oCharacter.build.intel = jsonBaseChar.intel+(calculateIncrease(5)*jsonStat.intel);
    oCharacter.build.clues = jsonBaseChar.intel+(calculateIncrease(5)*jsonStat.intel);
    //--update the text on the sheet per modifier
    $.each(oCharacter.build, function(key,value) {
        let content;
        switch (key) {
            case "currency":
                content = convertCurrency(value);
                break;
            default: 
                content = value;
                break;
        }
        $(`#stat-${key}`).html(content);
    });
    //update the object
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
    convertCurrency,
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