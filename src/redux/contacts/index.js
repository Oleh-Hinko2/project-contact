import { takeEvery, put } from 'redux-saga/effects';
import { getItem } from '../../helpers/storage';

const CONTACTS_LOAD = 'contacts/CONTACTS_LOAD';
const CONTACTS_LOAD_SUCCESS = 'contacts/CONTACTS_LOAD_SUCCESS';
const ADD_CONTACT = 'contacts/ADD_CONTACT';
const TOGGLE_SHOW_CONTACT_MODAL = 'contacts/TOGGLE_SHOW_CONTACT_MODAL';
const SET_INITIAL_VALUES = 'contacts/SET_INITIAL_VALUES';
const SET_FAVORITE_CONTACT = 'contacts/SET_FAVORITE_CONTACT';
const EDIT_CONTACT = 'contacts/EDIT_CONTACT';

const initialState = {
  initialValues: {
      name: '',
      phone: '',
      email: ''
  },
  data: [],
  visible: false
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case EDIT_CONTACT : {
      const { data } = state;
      const updateData = [];
      data.forEach(item => {
        if(item.id === action.contactId) {
          updateData.push({
            ...item,
            ...action.data
          })
        } else {
          updateData.push(item)
        }
      })
      return {
        ...state,
        data: updateData,
        visible: false,
        initialValues: {
          name: '',
          phone: '',
          email: ''
        }
      }
    }
    case CONTACTS_LOAD_SUCCESS: {
      return {
        ...state,
        data: action.data
      };
    }
    case SET_FAVORITE_CONTACT : {
      const { data } = state;
      const updateData = [];
      data.forEach(item => {
        if(item.id === action.contactId) {
          updateData.push({
            ...item,
            type: 'favorite'
          })
        } else {
          updateData.push(item)
        }
      })
      return {
        ...state,
        data: updateData
      }
    }
    case SET_INITIAL_VALUES : {
      return {
        ...state,
        initialValues: action.data,
        visible: true
      }
    }
    case ADD_CONTACT: {
        const { data } = state;
        return {
            ...state,
            visible: false,
            data: [...data, action.item],
            initialValues: {
              name: '',
              phone: '',
              email: ''
            }
        }
    }
    case TOGGLE_SHOW_CONTACT_MODAL: {
        return {
            ...state,
            visible: action.flag
        }
    }
    default:
      return state;
  }
}

// <<<ACTIONS>>>
export const getAllContacts = () => ({ type: CONTACTS_LOAD });
export const addNewContact = item => ({ type: ADD_CONTACT, item });
export const toggleShowContactModal = flag => ({ type: TOGGLE_SHOW_CONTACT_MODAL, flag });
export const setInitialValues = data => ({type: SET_INITIAL_VALUES, data});
export const setFavoriteContact = contactId => ({type: SET_FAVORITE_CONTACT, contactId});
export const editContact = ({contactId, data}) => ({type: EDIT_CONTACT, contactId, data })

//<<<WORKERS>>>
function* getALLData() {
  try {
    const data = getItem('contacts');
    yield put({ type: CONTACTS_LOAD_SUCCESS, data: data ? data : [] });
  } catch (error) {
      console.log(error)
  }
};

//<<<WATCHERS>>>
export function* watchContacts() {
  yield takeEvery(CONTACTS_LOAD, getALLData);
}