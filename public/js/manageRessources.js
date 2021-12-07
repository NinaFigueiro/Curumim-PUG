import axios from 'axios';
import {showAlert} from './alerts';

export const updateBook = async(data, id) => {
    try {
        const res = await axios({
            method: 'PATCH',
            url: `http://127.0.0.1:8000/api/v1/books/${id}`,
            id,
            data
        });
        // console.log('Frontend data', data);
        if(res.data.status === 'success') {
            showAlert('success', 'Data updated successfully!');
        }

    } catch(err) {
        // showAlert('error', err.response.data.message);
        showAlert('error', err.response.data.message);
    }
};