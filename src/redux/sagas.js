import { all, fork } from 'redux-saga/effects';
import { watchContacts } from './contacts';

export default function* rootSaga() {
  yield all([
    fork(watchContacts),
  ]);
}
