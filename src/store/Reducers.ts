import { ACTIONS } from './Actions';

const reducers = (state: any, action: any) => {
  switch (action.type) {
    case ACTIONS.NOTIFY:
      return {
        ...state,
        notify: action.payload
      };
    case ACTIONS.AUTH:
      return {
        ...state,
        auth: action.payload
      };
    case ACTIONS.LOADING:
      return {
        ...state,
        loading: action.payload
      };
    case ACTIONS.LANGUAGE:
      return {
        ...state,
        language: action.payload
      };
    case ACTIONS.PENDINGAPPOINTMENTLIST:
      return {
        ...state,
        pendingAppointmentList: action.payload
      };

    default:
      return state;
  }
};

export default reducers;