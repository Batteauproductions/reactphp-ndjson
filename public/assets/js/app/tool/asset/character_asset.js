//Generic settings and functions
import { oCharacter } from '../../generator.js';
import { icons, iconset, language, oTranslations } from '../settings.js'
import { generateIconSet, showMessage, showPopup } from '../functions.js'
import { updateExperience } from '../experience.js';
import { findItemIndex, updateCharacter, updateCharacterStats } from '../character.js';

// Define the class
class CharacterAsset {
    constructor({
        details: {
            id, 
            name,
            cost,
            max_rank,
            allow_multiple,            
        },
        modifier = [], // Default to an empty array for safety
        current: {
            sub_id = null,
            sub_name = null,
            rank = null,
            racial = false,
            asset_cost,
            attribute,            
            container = 'skill_base' //div container within the interface
        } = {} // Provide a default empty object for destructuring
    }) {
        this.id = parseInt(id);
        this.name = name;
        this.max_rank = isNaN(parseInt(max_rank)) ? 1 : parseInt(max_rank); //checks that rank is always set to at least 1
        this.allow_multiple = allow_multiple ? allow_multiple : false; //only certain items can be added multiple times [true/false]
        this.attribute = attribute; //what attribute of the character the assets should be stored [profession/skill/item]
        this.sub_id = sub_id !== null ? parseInt(sub_id) : null; //some assets have an sub id, for instance [2/5]
        this.sub_name = sub_name !== null ? sub_name : null; //some assets have a sub name, for instance [mage/elemental]
        this.rank = isNaN(parseInt(rank)) ? 1 : parseInt(rank); //what level is the asset
        this.modifier = modifier.length > 0 && modifier[0]?.id !== undefined ? parseInt(modifier[0].id) : null; //some assets contain stat modifiers
        this.racial = racial //some assets are included in the racial choice of the character
        this.cost = this.racial ? 0 : parseInt(cost); // all racial elements are 0 cost    
        this.asset_cost = asset_cost !== undefined ? parseInt(asset_cost) : this.cost; // upon initialization the asset cost is the same as the cost          
        this.container = container; //this is the container on the character sheet [profession/skill/equipment]
    }

    add () {

        // Check for duplicates, but only when not allowed
        if(!this.allow_multiple) {
            if (findItemIndex('skill', this.id, this.sub_id) !== -1) {
                showMessage('#choice-actions', 'error', oTranslations[language].duplicate_choose);
                return;
            }
        }
        //-----------------------------//

        // Check if the cost can be deducted, if so; deduct and continue
        if(!this.checkCost(this.asset_cost)) {
            return;
        } 
        //-----------------------------//   

        // Add the asset to the character functionally and visionally
        //-- functionally 
        oCharacter[this.attribute].push(this);
        //-- visionally
        //-- -- setup the master-row to contain the asset
        const row = $('<div>', {
            class: 'grid-x choice-row animate__animated animate__fadeInLeft',
            [`data-${this.container}_id`]: this.id, 
            [`data-${this.container}_sub_id`]: this.sub_id,
        });
        //-- -- array to contain the columns, starting with the basic one
        const arrColumns = [
            $('<div>', {
                'data-column': 'name',
                class: 'cell small-5 medium-4 text-left',
                text: `${this.name} ${this.rank != this.max_rank ? ` (${icons.rank.text} ${this.rank})` : ''}`
            })
        ];
        //-- -- create column for subname / cost (if any) and determine the icon set for this asset
        let local_icons;
        switch (this.attribute) {
            case 'skill':
            case 'profession':
                arrColumns.push($('<div>', {
                    'data-column': 'sub_name',
                    class: 'cell small-5 medium-4 text-center',
                    text: this.sub_name !== null ? this.sub_name : '-'
                }));    
                arrColumns.push($('<div>', {
                    'data-column': 'cost',
                    class: 'cell small-2 medium-1 text-right',
                    html: this.race ? `${oTranslations[language].racial}` : `${this.asset_cost}pt.`
                }));    
                local_icons = this.rank !== this.max_rank ? iconset["attribute_adjust_up"] : iconset["attribute_adjust_none"];
                break;
            case 'item':
                arrColumns.push($('<div>', {
                    'data-column': 'amount',
                    class: 'cell small-5 medium-4 text-right',
                    text: `${this.amount}x`
                }));    
                arrColumns.push($('<div>', {
                    'data-column': 'cost',
                    class: 'cell small-4 medium-3 text-right',
                    html: `${this.costText()}`
                }));    
                local_icons = iconset["attribute_adjust_none"];
                break;
        }        
        //-- -- fills the column of icons with the correct iconset
        const arrIcons = generateIconSet(local_icons,this,this.attribute);
        arrColumns.push($('<div>', {
            'data-column': 'action',
            class: 'cell small-12 medium-3 text-center medium-text-right',
            html: arrIcons
        }));
        //-- -- adds the columns to the master row    
        row.append(arrColumns);        
        // Sorts the rows within the container by ABC > Desc
        const $container = $(`[data-id="${this.container}-list"]`);
        let inserted = false;
        $container.children('.choice-row').each(function() {
            const currentRow = $(this);
            const currentName = currentRow.find('.cell.small-5.text-left').text().trim();
            if (currentName.localeCompare(this.name, undefined, { sensitivity: 'base' }) > 0) {
                currentRow.before(row);
                inserted = true;
                return false;
            }
        });
        if (!inserted) {
            $container.append(row);
        }
        //-----------------------------//        
        
        // Update character stats if the subject has a modifier
        if (this.modifier) {
            updateCharacterStats();
        }
        //-----------------------------//

        // Update the character object in the interface
        updateCharacter();
       
        return true;
    }
    
    remove () {
        // Attempt to find the asset within the character object
        const index = this.getSelfIndex();
        if (index === -1) {
            console.error(`Trying to remove ${this.attribute}, instance not found`);
            return;
        }
    
        // Refund the cost of the element
        switch(this.attribute) {
            case "profession":
            case "skill":
                updateExperience(this.asset_cost,'subtract');
                break;
            case "item":
                refundCurrency(this.asset_cost);
                break;
        }

        // Remove the asset of the character both functionally and visionally 
        //-- functionally
        oCharacter[this.attribute].splice(index, 1)[0];
        //-- visionally
        const $row = this.getVisualRow();
        $row.remove();
        
        // Update the stats if there was a modifier present
        if (this.modifier) {
            updateCharacterStats();
        }

        // Update the character object in the interface
        updateCharacter();

        return true;
    }

    adjustRank(direction) {
        const index = this.getSelfIndex();
        if (index === -1) {
            console.error(`Trying to adjust ${this.attribute}, instance not found`);
            return;
        }
    
        const new_rank = this.rank + direction;
        const new_cost = this.getRankCost(new_rank);
    
        // Check cost and bounds
        if (!this.checkCost(new_cost)) return;
        if (new_rank > this.max_rank) {
            showPopup(oTranslations[language].rank_max);
            return;
        }
        if (new_rank < 1) {
            showPopup(oTranslations[language].rank_min);
            return;
        }
    
        // Adjust rank and cost
        this.asset_cost += direction === 1 ? new_cost : -new_cost;
        this.rank = new_rank;
    
        // Icon logic
        let iconType = "attribute_adjust_all";
        if (new_rank === this.max_rank) iconType = "attribute_adjust_down";
        else if (new_rank === this.min_rank || new_rank === 1) iconType = "attribute_adjust_up";
    
        const new_icons = generateIconSet(iconset[iconType], this, this.attribute);
    
        // Update UI
        const $row = this.getVisualRow();
        $row.find('[data-column="name"]').text(`${this.name} (${icons.rank.text} ${this.rank})`);
        $row.find('[data-column="cost"]').text(`${this.asset_cost}pt.`);
        $row.find('[data-column="action"]').html(new_icons);
    
        if (this.modifier) updateCharacterStats();
        updateCharacter();
    
        return true;
    }

    checkCost(iCost) {
        // Check if the cost can be deducted, if so; deduct and continue
        switch(this.attribute) {
            case "profession":
            case "skill":
                // Check if the character has enough experience
                if(!updateExperience(iCost,"add")) {
                    showMessage('#choice-actions', 'error', oTranslations[language].not_enough_vp);
                    return false;  
                }
                break;
            case "item":
                if (checkCurrencyCost(iCost)) {
                    spendCurrency(iCost);
                } else {
                    showMessage('#choice-actions', 'error', oTranslations[language].not_enough_coin);
                    return false;                    
                }
                break;
            default:
                return false;
        }
        return true;
    }

    getSelfIndex() {
        return oCharacter[this.attribute].indexOf(this);
    }

    getVisualRow() {
        const subIdSelector = this.sub_id !== null ? `[data-${this.container}_sub_id="${this.sub_id}"]` : '';
        const $row = $(`div[data-${this.container}_id="${this.id}"]${subIdSelector}`);
        return $row;
    }

    getRankCost(new_rank) {
        switch(this.attribute) {
            case "profession":
                return this[`rank_${new_rank}_cost`] || 0;;
            case "skill":
                return this.cost;
            case "item":
                return this.cost * amount;
        }
    }
}

export {  
    CharacterAsset   
}