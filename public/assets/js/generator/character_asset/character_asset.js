//Generic settings and functions
import { icons, language, oTranslations, currentDateTime } from '../../_lib/settings.js'
import { debugLog, generateAssetIcons, showMessage, showPopup } from '../../_lib/functions.js'
import { findItemIndex } from '../character/character.js';
import { updateExperience } from '../helper/experience.js';

// Define the class
class CharacterAsset {
    constructor({
        details: {
            id, 
            name,
            description,
            requirements,
            cost,
            max_rank,
            loresheet,
            allow_multiple,            
        },
        modifier = [], // Default to an empty array for safety
        current: {
            sub_id = null,
            sub_name = null,
            rank = null,
            locked_rank = null,
            racial,
            rank_cost,
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
        this.requirements = requirements !== null ? requirements : null; //assets can have requirements
        this.max_rank = max_rank ? parseInt(max_rank) : 1 ; //checks that rank is always set to at least 1
        this.allow_multiple = allow_multiple ? parseInt(allow_multiple) : 0; //only certain items can be added multiple times [true/false]
        this.attribute = attribute; //what attribute of the character the assets should be stored [profession/skill/item]
        this.sub_id = sub_id !== null ? parseInt(sub_id) : null; //some assets have an sub id, for instance [2/5]
        this.sub_name = sub_name !== null ? sub_name : null; //some assets have a sub name, for instance [mage/elemental]
        this.rank = isNaN(parseInt(rank)) ? 1 : parseInt(rank); //what level is the asset
        this.locked_rank = locked_rank ? parseInt(locked_rank) : parseInt(rank); //what was the level when the character (asset) was locked
        this.modifier = modifier.length > 0 && modifier[0]?.id !== undefined ? parseInt(modifier[0].id) : null; //some assets contain stat modifiers
        this.racial = racial ? Boolean(parseInt(racial)) : false; //some assets are included in the racial choice of the character
        this.cost = this.racial ? "0" : cost; // all racial elements are 0 cost    
        this.rank_cost = rank_cost !== undefined ? parseInt(rank_cost) : parseInt(this.cost); // upon initialization the asset cost is the same as the cost          
        this.container = container; //this is the container on the character sheet [profession/skill/equipment]
        this.loresheet = loresheet ? Boolean(parseInt(loresheet)) : false;
        this.created_dt = created_dt ? created_dt : currentDateTime;
        this.modified_dt = modified_dt ? modified_dt : null;
        this.locked_dt = locked_dt ? locked_dt : null;
    }

    __construct() {
        window.character[this.attribute].push(this); //-- functionally   
        this.addVisualRow(false); //-- visionally 
    }

    add () {
        const duplicate_index = findItemIndex(this.attribute, this.id, this.sub_id);
        // Check for duplicates, no same assets with same main- and sub_id
        if (duplicate_index !== -1) {
            showMessage('#choice-actions', 'error', oTranslations[language].duplicate_choose);
            console.warn(oTranslations[language].duplicate_choose)
            return;
        }
        
        // Some assets allow for multiple main instances
        if(this.allow_multiple == 0) {
            const index = findItemIndex(this.attribute, this.id);
            if (index !== -1) {
                showMessage('#choice-actions', 'error', oTranslations[language].multiple_choose);
                console.warn(oTranslations[language].multiple_choose)
                return;
            }            
        }
        //-----------------------------//

        // Check if the requirement is met, if so; continue
        console.log('this.requirements ',this.requirements)
        if (this.requirements) {
            const andConditions = this.requirements.split('|');

            for (let condition of andConditions) {
                // Handle OR blocks
                let orParts = condition.split('/');
                let orSatisfied = false;

                for (let orPart of orParts) {
                    let parts = orPart.split(',');
                    let id = parseInt(parts[0]);
                    let rank = parts[1] ? parseInt(parts[1]) : null;

                    // You may want to adapt sub_id logic depending on your actual data
                    const index = findItemIndex('skill', id, null, rank, false);

                    if (index !== -1) {
                        orSatisfied = true;
                        break; // One OR condition met
                    }
                }

                if (!orSatisfied) {
                    showMessage('#choice-actions', 'error', oTranslations[language].requirements_not_met);
                    return;
                }
            }
        }


        //-----------------------------//

        // Check if the cost can be deducted, if so; deduct and continue
        const spend = this.costSpend(this.rank_cost);
        if(spend !== true) {
            showMessage('#choice-actions', 'error', spend);
            return;
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
        // Attempt to find the asset within the character object
        const index = findItemIndex(this.attribute, this.id, this.sub_id);
        if (index === -1) {
            console.error(`Trying to remove ${this.attribute}, instance not found`);
            return;
        }    
        // Refund the cost of the element
        this.costRefund(this.rank_cost);
        // Remove the asset of the character both functionally and visionally 
        window.character[this.attribute].splice(index, 1)[0]; //-- functionally
        const $row = this.getVisualRow(); //-- visionally
        $row.remove();        
        // Update the character object in the interface
        window.character.update();
        //-----------------------------//
        return true;
    }

    downgrade () {
        this.adjustRank(-1);
    }

    upgrade () {
        this.adjustRank(+1);
    }

    adjustRank(direction) {

        //check if item is available
        const index = findItemIndex(this.attribute, this.id, this.sub_id);
        if (index === -1) {
            console.error(`Trying to adjust ${this.attribute}, instance not found`);
            return;
        }
                
        // Checks if an attempt is made to manipulate outside of rank limit
        const new_rank = this.rank + direction;
        if (new_rank > this.max_rank) {
            console.error(`${oTranslations[language].rank_max}`);
            return;
        }
        if (new_rank < 1) {
            console.error(`${oTranslations[language].rank_min}`);
            return;
        }
        //-----------------------------//

        // Update the currency / experience accordingly
        const cost_array = this.cost.split('|').map(str => parseInt(str));
        let new_cost = 0;

        if (direction === 1) {
            // UPGRADE
            if (cost_array.length === 1) {
                new_cost = cost_array[0]; // flat cost for all ranks
            } else if (this.rank < cost_array.length) {
                new_cost = cost_array[this.rank]; // cost for upgrading to the next rank
            } 

            if (!this.costSpend(new_cost)) {
                showPopup(`<p>${spend}</p>`, 'inform', 'error');
                return;
            }

            this.rank += 1;
            this.rank_cost += new_cost;

        } else {
            // DOWNGRADE
            if (cost_array.length === 1) {
                new_cost = cost_array[0];
            } else if (this.rank > 0) {
                new_cost = cost_array[this.rank - 1]; // refund last rank's cost
            } 

            if (!this.costRefund(new_cost)) {
                showPopup(`<p>${spend}</p>`, 'inform', 'error');
                return;
            }

            this.rank -= 1;
            this.rank_cost -= new_cost;
        }
        //-----------------------------//
    
        // Icon logic
        const new_icons = generateAssetIcons(this);
    
        // Update UI
        const $row = this.getVisualRow();
        $row.find('[data-column="name"]').text(`${this.name} (${icons.rank.text()} ${this.rank})`);
        $row.find('[data-column="cost"]').text(`${this.rank_cost}pt.`);
        $row.find('[data-column="action"]').html(new_icons);

        window.character.update();
    
        return true;
    }

    getSelfIndex() {
        return findItemIndex(this.attribute, this.id, this.sub_id);
    }

    addVisualRow(animated) {
        //-- -- setup the master-row to contain the asset
        const row = $('<div>', {
            class: `grid-x choice-row ${animated ? 'animate__animated animate__fadeInLeft' : ''}`,
            [`data-${this.container}_id`]: this.id, 
            [`data-${this.container}_sub_id`]: this.sub_id,
        });
        //-- -- array to contain the columns, starting with the basic one   
        const lockedDt = window.character?.meta?.lastlocked_dt ?? null;
        const bNewAsset = lockedDt !== null && this.created_dt > lockedDt;
        let name = '';
            name += `${bNewAsset ? icons.new.icon() : ''}`;
            name += `${this.loresheet===1 ? icons.loresheet.icon() : ''}`;
            name += `${this.name}`;
            name += `${this.rank != this.max_rank ? ` (${icons.rank.text()} ${this.rank})` : ''}`;
        
        const arrColumns = [
            $('<div>', {
                'data-column': 'name',
                class: 'cell small-5 medium-4 text-left',
                html: `<span data-tooltip class="top" tabindex="2" title="${this.description}">${name}</span>` 
            })
        ];
        //-- -- create column for subname / cost (if any) and determine the icon set for this asset
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
                    html: this.racial ? `<em>${oTranslations[language].racial}</em>` : `${this.rank_cost}pt.`
                }));  
                break;
            case 'item':
                arrColumns.push($('<div>', {
                    'data-column': 'amount',
                    class: 'cell small-2 medium-1 text-right',
                    text: `${this.amount}x`
                }));    
                arrColumns.push($('<div>', {
                    'data-column': 'cost',
                    class: 'cell small-5 medium-4 text-center',
                    html: `${this.costText()}`
                }));                
                break;
        }  
        arrColumns.push($('<div>', {
            class: 'cell small-12 medium-3 small-text-center medium-text-right',
            'data-column': 'action',
            html: generateAssetIcons(this)
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
    }    

    costSpend(cost) {
        if(!updateExperience(cost,"spend")) {
            return oTranslations[language].not_enough_vp;  
        }
        return true;
    }

    costRefund(cost) {
        if(!updateExperience(cost,"refund")) {
            return false;
        }
        return true;      
    }

    getCurrentRankCost() {
        const cost_array = this.cost.split('|').map(str => parseInt(str));
        if (cost_array.length === 1) {
            // Flat cost per rank
            return cost_array[0];
        }
        // Progressive cost: sum of all previous steps up to current rank
        // E.g., for rank 2 and cost "3|2|1", return 3+2 = 5
        return cost_array.slice(0, this.rank).reduce((sum, val) => sum + val, 0);
    }

    getVisualRow() {
        const subIdSelector = this.sub_id !== null ? `[data-${this.container}_sub_id="${this.sub_id}"]` : '';
        const $row = $(`div[data-${this.container}_id="${this.id}"]${subIdSelector}`);
        return $row;
    }

}

export {  
    CharacterAsset   
}