import { ADD_CONTENT_DATA, EDIT_CONTENT_DATA, REMOVE_CONTENT_DATA,ADD_ID } from '../actions';

const contentData = {
    contents: []
}

export const contentDataReducer = (
    state = contentData,
    action 
) => {
    let newState = { ...state };
    switch (action.type) {
        case ADD_ID: {
            newState.id = action.payload._id
            break;
        }
        case ADD_CONTENT_DATA: {
            console.log("ADD_CONTENT_DATA: ",action.payload)
            newState.contents = [...newState.contents, action.payload.content]
            break;
        }
        case EDIT_CONTENT_DATA: {
            console.log("EDIT_CONTENT_DATA: ",action.payload)
            break;
        }
        case REMOVE_CONTENT_DATA: {
            console.log("Remove_CONTENT_DATA: ",action.payload)
            break;
        }
        
        default: {
        }
    }
    return newState;
}