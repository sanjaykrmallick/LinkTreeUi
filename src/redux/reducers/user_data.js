import { ADD_USERDATA, REMOVE_USERDATA,ADD_USER_AVATAR } from '../actions';

const userData = {
    userName: '',
    token: '',
    isActive: false,
    avatarLink: '',
}

export const userDataReducer = (
    state = userData,
    action
) => {
    let newState = { ...state };
    switch (action.type) {
        case ADD_USERDATA: {
            newState = {
                userName: action.payload.userLoginData.userName,
                token: action.payload.userLoginData.token,
                isActive: true,
                avatarLink: '',
            }
            break;
        }
        case REMOVE_USERDATA: {
            newState = {
                userName: '',
                token: '',
                isActive: false,
                _id: '',
                avatarLink: '',
            }
            break;
        }
        case ADD_USER_AVATAR: {
            console.log(action.payload);
            newState.avatarLink = action.payload.avatarLink;
            break;
        }
        default: {
        }
    }
    return newState;
}
