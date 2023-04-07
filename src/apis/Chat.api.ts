import {BASE_URL} from '../constants/Constants';

export const GetMessages = async ({
  sender,
  receiver,
}: {
  sender: string | undefined;
  receiver: string;
}) => {
  try {
    const response = await fetch(
      `${BASE_URL}/message?sender=${sender}&receiver=${receiver}`,
      {
        method: 'GET',
      },
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const SendMessage = async ({
  sender,
  receiver,
  message,
}: {
  sender: string | undefined;
  receiver: string;
  message: string;
}) => {
  try {
    const response = await fetch(`${BASE_URL}/message`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({sender, receiver, message}),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};
