import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

export const signIn = async (email: string, password: string) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/user/auth/sign-in`, {
            email,
            password,
        }, {withCredentials: false});

        if (response.status === 200) {
            return response;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error signing in:', error);
        return null;
    }
}

export const signUp = async (email: string, password: string) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/user/auth/sign-up`, {
            email,
            password,
        });

        if (response.status === 201) {
            console.log('User signed up successfully:', response.data);
            return response;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error signing up:', error);
        return null;
    }
}

export const getUser = async (token: string) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/user`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 200) {
            return response;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error getting user:', error);
        return null;
    }
}