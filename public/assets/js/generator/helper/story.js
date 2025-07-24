import { openStoryModal } from '../modal/story_modal.js'

function editAdventure(storyId) {
    openStoryModal('adventure',$('#adventure-modal'),storyId);
}

function viewAdventure (storyId) {
    openStoryModal('adventure',$('#adventure-modal'),storyId);
}

function editBackground () {
    openStoryModal('background',$('#background-modal'));
}

function viewBackground () {
    openStoryModal('background',$('#background-modal'));
}



export {
    editBackground,
    editAdventure,
    viewBackground,
    viewAdventure
}