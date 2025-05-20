import { oTranslations, language } from "./settings";

class Icon {
    constructor({
        icon_visual = 'fa-solid fa-notdef',
        icon_class = '',
        icon_text = '??',
        action = () => {}
    }) {
        this.icon_visual = icon_visual;
        this.icon_class = icon_class;
        this.icon_text = icon_text;
        this.action = action;
    }

    icon() {
        return `<i class="${this.icon_visual}"></i>`;
    }

    text() {
        return oTranslations?.[language]?.[this.icon_text] || this.icon_text;
    }

    render(full = false) {
        const translatedText = this.text();
        return $('<a>', {
            class: this.icon_class,
            html: `${this.icon()}${full ? ` ${translatedText}` : ''}`,
            title: translatedText
        }).on('click', this.action);
    }
}

export {
    Icon
}
