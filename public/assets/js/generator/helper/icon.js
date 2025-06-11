import { oTranslations, language } from "../../_lib/settings.js";

class Icon {
    constructor({
        icon_visual = 'fa-solid fa-notdef',
        icon_class = '',
        icon_text = '??',
    }) {
        this.icon_visual = icon_visual;
        this.icon_class = icon_class;
        this.icon_text = icon_text;
    }

    icon() {
        return `<i class="${this.icon_visual}"></i>`;
    }

    text() {
        return oTranslations?.[language]?.[this.icon_text] || this.icon_text;
    }

    render(onclick = {}, full = false, customtxt = '') {
        const translatedText = this.text();
        const isEmptyFunction = typeof onclick !== 'function' || onclick.toString().replace(/\s/g, '') === 'function(){}';
    
        const tag = isEmptyFunction ? 'p' : 'a';
    
        const $el = $(`<${tag}>`, {
            class: this.icon_class,
            html: `${this.icon()} ${customtxt!=='' ? customtxt : ''} ${full ? translatedText : ''}`,
            title: translatedText,
        });
    
        if (!isEmptyFunction) {
            $el.on('click', function (event) {
                event.preventDefault();
                onclick();
            });
        }
    
        return $el.get(0);
    }
}

export {
    Icon
}
