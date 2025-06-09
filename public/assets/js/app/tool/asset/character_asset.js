//Generic settings and functions
import { oCharacter } from '../../generator.js';
import { icons, iconset, language, oTranslations, currentDateTime } from '../settings.js'
import { debugLog, generateIconSet, showMessage } from '../functions.js'
import { findItemIndex } from '../character.js';

// Define the class
class CharacterAsset {
    constructor({
        details: {
            id, 
            name,
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
            racial,
            rank_cost,
            attribute,  
            container, //div container within the interface                        
            created_dt,
            modified_dt,
            locked_dt,
        } = {} // Provide a default empty object for destructuring
    }) {
        this.id = parseInt(id);
        this.name = name;
        this.max_rank = isNaN(parseInt(max_rank)) ? 1 : parseInt(max_rank); //checks that rank is always set to at least 1
        this.allow_multiple = allow_multiple ? parseInt(allow_multiple) : 0; //only certain items can be added multiple times [true/false]
        this.attribute = attribute; //what attribute of the character the assets should be stored [profession/skill/item]
        this.sub_id = sub_id !== null ? parseInt(sub_id) : null; //some assets have an sub id, for instance [2/5]
        this.sub_name = sub_name !== null ? sub_name : null; //some assets have a sub name, for instance [mage/elemental]
        this.rank = isNaN(parseInt(rank)) ? 1 : parseInt(rank); //what level is the asset
        this.modifier = modifier.length > 0 && modifier[0]?.id !== undefined ? parseInt(modifier[0].id) : null; //some assets contain stat modifiers
        this.racial = racial ? Boolean(racial) : false //some assets are included in the racial choice of the character
        this.cost = this.racial ? 0 : parseInt(cost); // all racial elements are 0 cost    
        this.rank_cost = rank_cost !== undefined ? parseInt(rank_cost) : this.cost; // upon initialization the asset cost is the same as the cost          
        this.container = container; //this is the container on the character sheet [profession/skill/equipment]
        this.loresheet = loresheet ? Boolean(parseInt(loresheet)) : false;
        this.created_dt = created_dt ? created_dt : currentDateTime;
        this.modified_dt = modified_dt ? modified_dt : null;
        this.locked_dt = locked_dt ? locked_dt : null;
    }

    __construct() {
        oCharacter[this.attribute].push(this); //-- functionally   
        this.addVisualRow(); //-- visionally 
    }

    add () {

        // Check for duplicates, but only when not allowed
        if(!this.allow_multiple || this.max_purchase == 1) {
            const index = this.getSelfIndex();
            if (index !== -1) {
                showMessage('#choice-actions', 'error', oTranslations[language].duplicate_choose);
                return;
            }            
        }
        //-----------------------------//

        // Check if the cost can be deducted, if so; deduct and continue
        const spend = this.costSpend();
        if(spend !== true) {
            showMessage('#choice-actions', 'error', spend);
            return;
        }
        //-----------------------------//   

        // Add the asset to the character functionally and visionally        
        oCharacter[this.attribute].push(this); //-- functionally   
        this.addVisualRow(); //-- visionally
        //-----------------------------//
        oCharacter.update();
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
        oCharacter[this.attribute].splice(index, 1)[0]; //-- functionally
        const $row = this.getVisualRow(); //-- visionally
        $row.remove();        
        // Update the character object in the interface
        oCharacter.update();
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
        let cost;        
        if(direction===1) {
            cost = this.getNewRankCost(new_rank);
            const spend = this.costSpend(cost);
            if(!spend) {
                showMessage('#choice-actions', 'error', spend);
                return;
            }
            this.rank_cost += cost;           
        } else {
            cost = this.getNewRankCost(this.rank);
            this.costRefund(cost);
            this.rank_cost -= cost;
        }
        //-----------------------------//
    
        // Adjust rank
        this.rank = new_rank;
    
        // Icon logic
        let iconType = "attribute_adjust_all";
        if (new_rank === this.max_rank) { 
            iconType = "attribute_adjust_down" 
        } else if (new_rank === this.min_rank || new_rank === 1) { 
            iconType = "attribute_adjust_up" 
        }    
        const new_icons = generateIconSet(iconset[iconType], this, this.attribute);
    
        // Update UI
        const $row = this.getVisualRow();
        $row.find('[data-column="name"]').text(`${this.name} (${icons.rank.text()} ${this.rank})`);
        $row.find('[data-column="cost"]').text(`${this.rank_cost}pt.`);
        $row.find('[data-column="action"]').html(new_icons);

        oCharacter.update();
    
        return true;
    }

    getSelfIndex() {
        return findItemIndex(this.attribute, this.id, this.sub_id);
    }

    addVisualRow() {
        //-- -- setup the master-row to contain the asset
        const row = $('<div>', {
            class: 'grid-x choice-row animate__animated animate__fadeInLeft',
            [`data-${this.container}_id`]: this.id, 
            [`data-${this.container}_sub_id`]: this.sub_id,
        });
        //-- -- array to contain the columns, starting with the basic one        
        let name = '';
            name += `${!this.modified_dt || !this.locked_dt ? icons.new.icon() : ''}`;
            name += `${this.loresheet ? icons.loresheet.icon() : ''}`;
            name += `${this.name}`;
            name += `${this.rank != this.max_rank ? ` (${icons.rank.text()} ${this.rank})` : ''}`;
         
        const arrColumns = [
            $('<div>', {
                'data-column': 'name',
                class: 'cell small-5 medium-4 text-left',
                html: name
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
                    html: this.racial ? `<em>${oTranslations[language].racial}</em>` : `${this.rank_cost}pt.`
                }));    
                local_icons = this.rank !== this.max_rank ? iconset.attribute_adjust_up : this.racial ? iconset.attribute_adjust_none : iconset.attribute_adjust_basic;
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
                local_icons = iconset["attribute_adjust_basic"];
                break;
        }        
        //-- -- fills the column of icons with the correct iconset
        const arrIcons = generateIconSet(local_icons,this);
        arrColumns.push($('<div>', {
            class: 'cell small-12 medium-3 small-text-center medium-text-right',
            'data-column': 'action',
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
    }    

    costRefund() {
        console.error('Generic cost could not be refunded'); //this function is overwritten per child class
        return false; 
    }

    costSpend() {
        console.error('Generic cost could not be spend'); //this function is overwritten per child class
        return false;
    }

    getVisualRow() {
        const subIdSelector = this.sub_id !== null ? `[data-${this.container}_sub_id="${this.sub_id}"]` : '';
        const $row = $(`div[data-${this.container}_id="${this.id}"]${subIdSelector}`);
        return $row;
    }

    getNewRankCost() {
        return this.cost;
    }

    getCurrentRankCost() {
        return parseInt(this.cost * this.rank);
    }
}

export {  
    CharacterAsset   
}