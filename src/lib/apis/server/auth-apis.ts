import { kyNextInstance } from '../../kyInstance/kyNext';

export const setAuthCookie = async ({
  accessToken,
  userId,
}: {
  accessToken: string;
  userId: string;
}) => {
  try {
    await kyNextInstance.post('auth/auth-cookie', {
      json: {
        accessToken,
        userId,
      },
    });
    return true;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteAuthCookie = async () => {
  try {
    await kyNextInstance.delete('auth/auth-cookie');
    return true;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
