import {BASE_URL} from '../constants/Constants';

export const AddUser = async ({
  email,
  username,
  img = '',
}: {
  email: string;
  username: string;
  img: string;
}) => {
  try {
    const response = await fetch(`${BASE_URL}/addUser`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({email, username, img}),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};
