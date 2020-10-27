import { ADD_CONTENT_DATA, EDIT_CONTENT_DATA, REMOVE_CONTENT_DATA,ADD_ID } from './action-types';

export const addContent = (content) => {
    return {
        type: ADD_CONTENT_DATA,
        payload: content
    }
}

export const editContent = (content) => {
    return {
        type: EDIT_CONTENT_DATA,
        payload: content
    }
}

export const removeContent = (content) => {
    return {
        type: REMOVE_CONTENT_DATA,
        payload: content
    }
}
export const addId = (_id) => {
    return {
        type: ADD_ID,
        payload: {
            _id
        }
    }
}