import React, { createContext, useReducer, useEffect, ReactNode } from "react";
import reducers from "./Reducers";
import { Alert } from 'react-native';
import { sleep } from '../utils/sleep';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getData } from '../utils/fetchData';
import { ACTIONS } from './Actions';

interface AuthPayload {
  user?: any;
  token?: string;
  roles?: string;
}

interface State {
  notify: Record<string, any>;
  auth: AuthPayload;
  loading: boolean;
  language: 'en' | 'bn';
  pendingAppointmentList: any[];
}

interface ContextValue {
  state: State;
  dispatch: React.Dispatch<any>;
  logout: (navigation?: any) => Promise<void>;
}

export const DataContext = createContext<ContextValue | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const initialState: State = {
    notify: {},
    auth: {},
    loading: true,
    language: 'en',
    pendingAppointmentList: []
  };

  const [state, dispatch] = useReducer(reducers, initialState);

  const getUserInfo = async (token: string) => {
    try {
      const res = await getData('user', token);
      const user = {
        user: res.data,
        token,
        roles: res.data.roles?.[0]?.name
      };
      await AsyncStorage.setItem('user', JSON.stringify(user));
      dispatch({
        type: ACTIONS.AUTH,
        payload: {
          user: user.user,
          token: user.token,
          roles: user.roles
        }
      });
      dispatch({ type: ACTIONS.LOADING, payload: false });
    } catch (err) {
      dispatch({ type: ACTIONS.LOADING, payload: false });
    }
  };

  useEffect(() => {
    sleep(1000).then(() => {
      AsyncStorage.getItem('user').then(userStr => {
        if (userStr) {
          try {
            const parsed = JSON.parse(userStr);
            getUserInfo(parsed.token!);
          } catch {
            dispatch({ type: ACTIONS.LOADING, payload: false });
          }
        } else {
          dispatch({ type: ACTIONS.LOADING, payload: false });
        }
      });
    });
  }, []);

  const logout = async () => {
    Alert.alert("Hey!", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "YES",
        onPress: () => {
          AsyncStorage.removeItem('user');
          dispatch({ type: ACTIONS.AUTH, payload: {} });
        }
      }
    ]);
  };

  return (
    <DataContext.Provider value={{ state, dispatch, logout }}>
      {children}
    </DataContext.Provider>
  );
};