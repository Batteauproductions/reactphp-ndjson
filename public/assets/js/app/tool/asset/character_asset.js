//Generic settings and functions
import { oCharacter } from '../../generator.js';
import { iconset, language, oTranslations } from '../settings.js'
import { generateIconSet, showMessage, showPopup } from '../functions.js'
import { checkExperienceCost } from '../experience.js';
import { findItemIndex, updateCharacter } from '../character.js';

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
            attribute,
            sub_id = null,
            sub_name = null,
            rank = null,
            racial = false,
            asset_cost = 0,            
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
        this.asset_cost = this.cost; // upon initialization the asset cost is the same as the cost          
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
        if(!checkCost(this.asset_cost)) {
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
        const arrIcons = generateIconSet(local_icons,this,attribute);
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
        // Remove from the character object if found, otherwise return error in console
        // Note: this error should not be possible for a user to invoke unless he intentionally tries to break the UI
        const index = findItemIndex(this.attribute, this.id, this.sub_id);
        if (index === -1) {
            console.error(`Trying to remove ${this.attribute}, non-existent`);
            return;
        }
    
        // Refund the cost of the element
        switch(this.attribute) {
            case "profession":
            case "skill":
                refundExperience(this.asset_cost);
                break;
            case "item":
                refundCurrency(this.asset_cost);
                break;
        }

        // Remove the asset of the character both functionally and visionally 
        //-- functionally
        oCharacter[this.attribute].splice(index, 1)[0];
        //-- visionally
        const subIdSelector = this.sub_id !== null ? `[data-${this.attribute}_sub_id="${this.sub_id}"]` : '';
        const $row = $(`div[data-${this.attribute}_id="${this.id}"]${subIdSelector}`);
        $row.remove();
        
        // Update the stats if there was a modifier present
        if (this.modifier) {
            updateCharacterStats();
        }

        // Update the character object in the interface
        updateCharacter();

        return true;
    }

    upgrade () {
        // Attempt to find the proffesion within the character object
        const index = findItemIndex('skill', this.id, this.sub_id)
        if (index === -1) {
            console.error(`Trying to upgrade ${this.attribute}, non-existent`);
            return;
        }

        // Get the new rank and cost of the asset
        const new_rank = this.rank+1;
        const diff_cost = this.getRankCost(new_rank) - this.cost;

        // Check if the cost can be deducted, if so; deduct and continue
        if(!this.checkCost(diff_cost)) {            
            return;
        } else {
            this.asset_cost += diff_cost;
            this.rank = new_rank;
        }
        //-----------------------------// 

        let new_icons = null;
        if (new_rank > this.max_rank) {
            showPopup(oTranslations[language].rank_max);
            new_icons = generateIconSet(iconset["attribute_adjust_down"],this,this.attribute);
            return;
        } else if (new_rank == this.max_rank) {
            new_icons = generateIconSet(iconset["attribute_adjust_down"],this,this.attribute);
        } else if (new_rank == this.min_rank) {
            new_icons = generateIconSet(iconset["attribute_adjust_up"],this,this.attribute);
        } else if (new_rank < this.max_rank) {
            new_icons = generateIconSet(iconset["attribute_adjust_all"],this,this.attribute);
        }

        // Update the stats if there was a modifier present
        if (this.modifier) {
            updateCharacterStats();
        }

        // Update the character object in the interface
        updateCharacter();

        return true;
    }

    downgrade() {
        //attempt to find the proffesion within the character object
        const index = findItemIndex('skill', this.id, this.sub_id)
        if (index === -1) {
            console.error('Trying to upgrade skill, non-existent')
            return;
        }

        //get the new rank of the profession
        const new_rank = this.rank-1;
        let new_icons = null;
        if (new_rank < 1) {
            showPopup(oTranslations[language].rank_min);
            new_icons = generateIconSet(iconset["attribute_adjust_up"],this,'skill');
            return;
        } else if (new_rank == 1) {
            new_icons = generateIconSet(iconset["attribute_adjust_up"],this,'skill');
        } else if (new_rank > 1) {
            new_icons = generateIconSet(iconset["attribute_adjust_all"],this,'skill');
        } 

        //get the new cost of the skill based on the new rank
        const new_cost = this.getRankCost(new_rank);
        
        oCharacter.updateAsset('skill',index,new_rank,new_cost,new_icons);
        return true;
    }

    checkCost(iCost) {
        // Check if the cost can be deducted, if so; deduct and continue
        switch(this.attribute) {
            case "profession":
            case "skill":
                // Check if the character has enough experience
                if (!checkExperienceCost(iCost)) {
                    showMessage('#choice-actions', 'error', oTranslations[language].not_enough_vp);
                    return;
                } else {
                    spendExperience(iCost);
                }
                break;
            case "item":
                if (!checkCurrencyCost(iCost)) {
                    showMessage('#choice-actions', 'error', oTranslations[language].not_enough_coin);
                    return;
                } else {
                    spendCurrency(iCost);
                }
                break;
        }
        return true;
    }

    getRankCost(new_rank) {
        switch(this.attribute) {
            case "profession":
                let totalCost = 0;
                for (let i = 1; i <= new_rank; i++) {
                    const propertyName = `rank_${i}_cost`;
                    if (this[propertyName] !== undefined) {
                        totalCost += this[propertyName];
                    }
                }
                return totalCost;
            case "skill":
                return this.cost * new_rank;
            case "item":
                return this.cost * amount;
        }
    }
}

export {  
    CharacterAsset   
}