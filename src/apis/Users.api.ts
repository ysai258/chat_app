import {BASE_URL} from '../constants/Constants';

export const GetUsers = async ({userId = ''}: {userId: string | undefined}) => {
  try {
    const response = await fetch(`${BASE_URL}/users/${userId}`, {
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const GetConnectedUsers = async ({
  userId = '',
}: {
  userId: string | undefined;
}) => {
  try {
    const response = await fetch(`${BASE_URL}/users/${userId}/connected`, {
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};
