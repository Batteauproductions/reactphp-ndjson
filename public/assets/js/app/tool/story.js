import { openStoryModal } from './modal/story_modal.js'

function editAdventure() {
    openStoryModal('adventure',$('#adventure-modal'));
}

function editBackground () {
    openStoryModal('background',$('#background-modal'));
}

export {
    editBackground,
    editAdventure
}