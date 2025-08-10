//Generic settings and functions
import { icons, language, oTranslations } from '../../_lib/settings.js'
import { debugLog, generateAssetIcons, showMessage, showPopup } from '../../_lib/functions.js'
import { findItemIndex, findLinkedSkillIndex } from '../character/character.js';
import { updateExperience } from '../helper/experience.js';
import { convertCurrency } from '../helper/currency.js';

// Define the class
class CharacterAsset {
    constructor({
        details: {
            id, 
            name,
            description,
            requirements,
            cost,
            asset_value_max,
            loresheet,
            allow_multiple,            
        },
        modifier = [], // Default to an empty array for safety
        current: {
            sub_id = null,
            sub_name = null,
            asset_value = null,
            asset_value_locked = null,
            racial,
            asset_value_cost,
            attribute,  
            container, //div container within the interface                        
            created_dt,
            modified_dt,
            locked_dt,
        } = {} // Provide a default empty object for destructuring
    }) {
        this.id = id !== null ? parseInt(id) : null;
        this.name = name;
        this.description = description;
        this.requirements = requirements ?? null; //assets can have requirements
        this.asset_value_max = asset_value_max ? parseInt(asset_value_max) : 1 ; //checks that asset_value is always set to at least 1
        this.allow_multiple = allow_multiple ? parseInt(allow_multiple) : 0; //only certain items can be added multiple times [true/false]
        this.attribute = attribute; //what attribute of the character the assets should be stored [profession/skill/item]
        this.sub_id = sub_id !== null ? parseInt(sub_id) : null; //some assets have an sub id, for instance [2/5]
        this.sub_name = sub_name !== null ? sub_name : null; //some assets have a sub name, for instance [mage/elemental]
        this.asset_value = isNaN(parseInt(asset_value)) ? 1 : parseInt(asset_value); //what level is the asset
        this.asset_value_locked = asset_value_locked ?? null; //what was the level when the character (asset) was locked
        this.modifier = modifier.length > 0 && modifier[0]?.id !== undefined ? parseInt(modifier[0].id) : null; //some assets contain stat modifiers
        this.racial = racial ? Boolean(parseInt(racial)) : false; //some assets are included in the racial choice of the character
        this.cost = this.racial ? "0" : cost; // all racial elements are 0 cost    
        this.asset_value_cost = asset_value_cost !== undefined ? parseInt(asset_value_cost) : parseInt(this.cost); // upon initialization the asset cost is the same as the cost          
        this.container = container; //this is the container on the character sheet [profession/skill/equipment]
        this.loresheet = loresheet ? Boolean(parseInt(loresheet)) : false;
        this.created_dt = created_dt ? created_dt : null;
        this.modified_dt = modified_dt ? modified_dt : null;
        this.locked_dt = locked_dt ? locked_dt : null;
    }

    __construct() {
        window.character[this.attribute].push(this); //-- functionally   
        this.addVisualRow(false); //-- visionally 
    }

    add () {

        // Return 1 (Unique combination): Check for duplicates, no same assets with same main- and sub_id
        const duplicate_index = findItemIndex(this.attribute, this.id, this.sub_id);
        if (duplicate_index !== -1) {
            const message = oTranslations[language].duplicate_choose;
            showMessage('#choice-actions', 'error', message);
            debugLog(message);
            return false;
        }
        //-----------------------------//
        
        // Return 2 (Duplicate master): Some assets allow for multiple main instances, others do not
        if(this.allow_multiple == 0) {
            const index = findItemIndex(this.attribute, this.id);
            if (index !== -1) {
                const message = oTranslations[language].multiple_choose
                showMessage('#choice-actions', 'error', message);
                debugLog(message);
                return false;
            }            
        }
        //-----------------------------//

        // Return 3 (Requirements): Check if the requirement is met, if so; continue
        // The data structure is as follows
        // | : indicates and AND
        // / : indicates an OR
        // , : indicates asset_value
        // example: 14|12,2/13,2 translates to "skill id 14 AND (skill id 12 asset_value 2 OR skill id 13 asset_value 2)
        if (this.requirements) {
            const andConditions = this.requirements.split('|');
            for (let condition of andConditions) {
                // Handle OR blocks
                let orParts = condition.split('/');
                let orSatisfied = false;
                for (let orPart of orParts) {
                    let parts = orPart.split(',');
                    let id = parseInt(parts[0]);
                    let asset_value = parts[1] ? parseInt(parts[1]) : null;
                    const index = findItemIndex('skill', id, null, asset_value, false);
                    if (index !== -1) {
                        orSatisfied = true;
                        break; // One OR condition met
                    }
                }
                if (!orSatisfied) {
                    const message = oTranslations[language].requirements_not_met;
                    showMessage('#choice-actions', 'error', message);
                    debugLog(message);
                    return false;
                }
            }
        }
        //-----------------------------//

        // Return 4 (Cost): Check if the cost can be deducted, if so; deduct and continue
        if(!this.costSpend(this.asset_value_cost)) {
            if(this.attribute==='item') {
                showMessage('#choice-actions', 'error', oTranslations[language].not_enough_coin);
            } else {
                showMessage('#choice-actions', 'error', oTranslations[language].not_enough_vp);
            }
            return false;
        }
        //-----------------------------//   

        // Add the asset to the character functionally and visionally        
        window.character[this.attribute].push(this); //-- functionally   
        this.addVisualRow(true); //-- visionally
        //-----------------------------//
        window.character.update();
        //-----------------------------//
        return true;
    }
    
    remove () {

        // Return 1: Attempt to find the asset within the character object
        const index = findItemIndex(this.attribute, this.id, this.sub_id);
        if (index === -1) {
            console.error(`Trying to remove ${this.attribute}, instance not found`);
            return false;
        }
        //-----------------------------//

        // (potentional) Return 2: Attempt to remove profession with skills of profession
        // A profession can not be removed if the character still has skills related to the profession
        if(this.attribute === 'profession') {
            const index = findLinkedSkillIndex(this.id, this.sub_id);
            const title = oTranslations[language].popup_error;
            const message = oTranslations[language].linked_profession;
            if (index !== -1) {
                showPopup(`<h2>${title}</h2><p>${message}`,'inform','error');
                return false;
            }
        }
        //-----------------------------//

        // This pushes the instance to an array if it has a creation date (stored in the database)
        // It will then process deletion in a later stage so that no every delete is called via ajax and processed in bulk
        if (this.created_dt !== null) {   
            const asset = {
                cid:    window.character.meta.id,
                sm_id:  this.id,
                su_id:  this.sub_id,
                table:  this.attribute,
            }
            window.remove_asset.push(asset);
        }
        //-----------------------------//

        // Refund the cost of the element
        this.costRefund(this.asset_value_cost);

        // Remove the asset of the character both functionally and visually 
        window.character[this.attribute].splice(index, 1)[0]; //-- functionally
        const $row = this.getVisualRow(); //-- visually
        $row.remove();

        // Update the character object in the interface
        window.character.update();
        return true;
    }

    downgrade () {
        this.adjustAssetValue(-1);
    }

    upgrade () {
        this.adjustAssetValue(+1);
    }

    adjustAssetValue(direction) {

        // Return 1: Checks if item exists on the character, should not be possible hence a console error
        const index = findItemIndex(this.attribute, this.id, this.sub_id);
        if (index === -1) {
            console.error(`Trying to adjust ${this.attribute}, instance not found`);
            return false;
        }
        //-----------------------------//
                
        // (potential) Return 2: Checks if an attempt is made to manipulate outside of asset_value limit, should not be possible hence a console error
        const new_asset_value = this.asset_value + direction;
        const isItem = this.attribute === 'item';

        if(!isItem) {
            if (this.asset_value_max !== null && new_asset_value > this.asset_value_max) {
                console.error(`${oTranslations[language].asset_value_max}`);
                return false;
            }
            if (new_asset_value < 1) {
                console.error(`${oTranslations[language].asset_value_min}`);
                return false;
            }
        }
        //-----------------------------//

        // Update the currency / experience accordingly
        const cost_array = this.cost.split('|').map(str => parseInt(str));
        let new_cost = 0;

        if (direction === 1) {
            // UPGRADE
            if (cost_array.length === 1) {
                new_cost = cost_array[0]; // flat cost for all asset_values
            } else if (this.asset_value < cost_array.length) {
                new_cost = cost_array[this.asset_value]; // cost for upgrading to the next asset_value
            } 
            // Return 3: Check if cost can be paid
            if (!this.costSpend(new_cost)) {
                let title = oTranslations[language].popup_error;
                let paragraph;
                if(!isItem) {
                    paragraph = oTranslations[language].not_enough_vp;
                } else {
                    paragraph = oTranslations[language].not_enough_coin;
                }
                showPopup(`<h2>${title}</h2><p>${paragraph}</p>`, 'inform', 'error');
                return false;
            }
            this.asset_value += 1;
            this.asset_value_cost += new_cost;
        } else {
            // DOWNGRADE
            if (cost_array.length === 1) {
                new_cost = cost_array[0];
            } else if (this.asset_value > 0) {
                new_cost = cost_array[this.asset_value - 1]; // refund last asset_value's cost
            } 
            
            if (!this.costRefund(new_cost)) {
                let title = oTranslations[language].popup_error;
                let paragraph;
                if(!isItem) {
                    paragraph = oTranslations[language].not_enough_vp;
                } else {
                    paragraph = oTranslations[language].not_enough_coin;
                }
                showPopup(`<h2>${title}</h2><p>${paragraph}</p>`, 'inform', 'error');
                return;
            }

            this.asset_value -= 1;
            this.asset_value_cost -= new_cost;
        }
        //-----------------------------//
        
        // Update UI
        const $row = this.getVisualRow();
        buildOrUpdateRow(this, $row);

        window.character.update();
    
        return true;
    }

    getSelfIndex() {
        return findItemIndex(this.attribute, this.id, this.sub_id);
    }

    addVisualRow(animated) {
        const $row = buildOrUpdateRow(this, null, animated); // 'this' = asset object
        const $container = $(`[data-id="${this.container}-list"]`);
        insertRowAlphabetically($container, $row);
        
        return true;
    }    

    costSpend(cost) {
        return updateExperience(cost,"spend");
    }

    costRefund(cost) {
        return updateExperience(cost,"refund")
    }

    getCurrentAssetValueCost() {
        const cost_array = this.cost.split('|').map(str => parseInt(str));
        if (cost_array.length === 1) {
            const value_cost = cost_array[0];
            // Flat cost per asset_value
            return parseInt(value_cost*this.asset_value);
        }
        // Progressive cost: sum of all previous steps up to current asset_value
        // E.g., for asset_value 2 and cost "3|2|1", return 3+2 = 5
        return cost_array.slice(0, this.asset_value).reduce((sum, val) => sum + val, 0);
    }

    getVisualRow() {
        const subIdSelector = this.sub_id !== null ? `[data-${this.container}_sub_id="${this.sub_id}"]` : '';
        const $row = $(`div[data-${this.container}_id="${this.id}"]${subIdSelector}`);
        return $row;
    }

}

// Build or update a row for an asset
function buildOrUpdateRow(data, $row = null, animated = false) {
    const isItem = data.attribute === 'item';

    // create row if not provided
    if (!$row || !$row.length) {
        $row = $('<div>', {
            class: `grid-x choice-row ${animated ? 'animate__animated animate__fadeInLeft' : ''}`,
            // computed attr names
            [`data-${data.container}_id`]: data.id,
            [`data-${data.container}_sub_id`]: data.sub_id
        });
    }

    // name + icons
    const lockedDt = window.character?.meta?.lastlocked_dt ?? null;
    const bNewAsset = lockedDt !== null && data.created_dt > lockedDt;
    let nameHtml = '';
    nameHtml += bNewAsset ? icons.new.icon() : '';
    nameHtml += data.loresheet === 1 ? icons.loresheet.icon() : '';
    nameHtml += data.name;
    if (!isItem && data.asset_value != data.asset_value_max) {
        nameHtml += ` (${icons.asset_value.text()} ${data.asset_value})`;
    }

    // ensure name column
    let $nameCell = $row.find('[data-column="name"]');
    if (!$nameCell.length) {
        $nameCell = $('<div>', {
            'data-column': 'name',
            class: 'cell small-5 medium-4 text-left'
        }).appendTo($row);
    }
    $nameCell.html(`<span data-tooltip class="top" tabindex="2" title="${data.description}">${nameHtml}</span>`);

    // attribute-specific columns
    if (data.attribute === 'skill' || data.attribute === 'profession') {
        let $sub = $row.find('[data-column="sub_name"]');
        if (!$sub.length) {
            $sub = $('<div>', {
                'data-column': 'sub_name',
                class: 'cell small-5 medium-4 text-center'
            }).insertAfter($nameCell);
        }
        $sub.text(data.sub_name ?? '-');

        let $cost = $row.find('[data-column="cost"]');
        if (!$cost.length) {
            $cost = $('<div>', {
                'data-column': 'cost',
                class: 'cell small-2 medium-1 text-right'
            }).insertAfter($sub);
        }
        $cost.html(data.racial ? `<em>${oTranslations[language].racial}</em>` : `${data.asset_value_cost}pt.`);
    } else if (data.attribute === 'item') {
        let $amount = $row.find('[data-column="amount"]');
        if (!$amount.length) {
            $amount = $('<div>', {
                'data-column': 'amount',
                class: 'cell small-2 medium-1 text-right'
            }).insertAfter($nameCell);
        }
        $amount.text(`${data.asset_value}x`);

        let $cost = $row.find('[data-column="cost"]');
        if (!$cost.length) {
            $cost = $('<div>', {
                'data-column': 'cost',
                class: 'cell small-5 medium-4 text-center'
            }).insertAfter($amount);
        }
        $cost.html(data.costText());
    } else {
        // fallback cost column if needed
        let $cost = $row.find('[data-column="cost"]');
        if (!$cost.length) {
            $cost = $('<div>', {
                'data-column': 'cost',
                class: 'cell small-2 medium-1 text-right'
            }).insertAfter($nameCell);
        }
        $cost.html(`${data.asset_value_cost ?? ''}`);
    }

    // action column
    let $action = $row.find('[data-column="action"]');
    if (!$action.length) {
        $action = $('<div>', {
            class: 'cell small-12 medium-3 small-text-center medium-text-right',
            'data-column': 'action'
        }).appendTo($row);
    }
    $action.html(generateAssetIcons(data));

    return $row;
}

// Insert a row into $container sorted by the rendered name column
function insertRowAlphabetically($container, $row) {
    const newName = $row.find('[data-column="name"]').text().trim();

    let inserted = false;
    $container.children('.choice-row').each(function() {
        const $cur = $(this);
        const curName = $cur.find('[data-column="name"]').text().trim();

        // insert before the first item that sorts after newName (case/accent insensitive)
        if (curName.localeCompare(newName, undefined, { sensitivity: 'base' }) > 0) {
            $cur.before($row);
            inserted = true;
            return false; // break .each()
        }
    });

    if (!inserted) {
        $container.append($row);
    }
}


export {  
    CharacterAsset   
}