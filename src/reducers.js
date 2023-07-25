import { combineReducers } from 'redux';
import reducer1 from './reducer1';
import reducer2 from './reducer2';
// Importa todos los reducers que necesites

export default combineReducers({
    reducer1,
    reducer2,
    // Agrega todos tus reducers aquí
});
