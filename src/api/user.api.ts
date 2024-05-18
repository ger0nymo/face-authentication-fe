import axios, {AxiosError} from 'axios';

const API_BASE_URL = 'http://localhost:8080';

export const signIn = async (email: string, password: string) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/user/auth/sign-in`, {
            email,
            password,
        }, {withCredentials: false});

        if (response.status === 200 || response.status === 210) {
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

export const imageEmbedding = async (image: string) => {
    const token = localStorage.getItem('token');

    // Decode the base64-encoded image string
    const byteCharacters = atob(image.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    // Create a Blob from the decoded image data
    const blob = new Blob([byteArray], { type: 'image/jpeg' });

    let data = new FormData();
    data.append('file', blob, 'image.jpg');

    try {
        const response = await axios.post(`${API_BASE_URL}/user/image/image-embedding`, data, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        });

        if (response.status === 200) {
            return response;
        } else {
            return response.data;
        }
    } catch (error) {
        return (error as AxiosError).response?.data;
    }
}

export const compareFaces = async (image: string, verificationToken: string) => {
    // Decode the base64-encoded image string
    const byteCharacters = atob(image.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    // Create a Blob from the decoded image data
    const blob = new Blob([byteArray], { type: 'image/jpeg' });

    let data = new FormData();
    data.append('file', blob, 'image.jpg');

    try {
        const response = await axios.post(`${API_BASE_URL}/user/image/compare-faces`, data, {
            headers: {
                'Authorization': `Bearer ${verificationToken}`,
                'Content-Type': 'multipart/form-data',
            },
        });

        if (response.status === 200) {
            return response;
        } else {
            return response.data;
        }
    } catch (error) {
        return (error as AxiosError).response?.data;
    }
}

export const disableFaceVerification = async () => {
    const token = localStorage.getItem('token');

    try {
        await axios.post(`${API_BASE_URL}/user/disable-face-verification`, {}, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });
    } catch (error) {
        console.error('Error disabling face verification:', error);
    }
}