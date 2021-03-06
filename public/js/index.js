import '@babel/polyfill';
import {login, logout} from './login';
import {updateSettings} from './updateSettings';
import {updateBook} from './manageRessources';

// DOM ELEMENTS
const loginForm = document.querySelector('.form--login');
const bookDataForm = document.querySelector('.form-book-data');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const logOutBtn = document.querySelector('.nav__el--logout');

const newsletterForm = document.querySelector('.form--newsletter');

// VALUES


// DELEGATION

if(loginForm)
loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password)
});

if(newsletterForm)
newsletterForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    // login(email, password);
});

if(logOutBtn) logOutBtn.addEventListener('click', logout);


if(userDataForm)
    userDataForm.addEventListener('submit', e => {
        e.preventDefault();
        const form = new FormData();
        form.append('name', document.getElementById('name').value);
        form.append('email', document.getElementById('email').value);
        form.append('img', document.getElementById('img').files[0]);

        updateSettings(form, 'data');
        console.log(form);
    });

if(userPasswordForm)
    userPasswordForm.addEventListener('submit', async e => {
        e.preventDefault();
        document.querySelector('.btn--save-password').textContent = 'Updating...'
        const passwordCurrent = document.getElementById('password-current').value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('password-confirm').value;
        // We use await so we only execute the rest of the code after the function is finished
        await updateSettings({passwordCurrent, password, passwordConfirm}, 'password');
        document.querySelector('.btn--save-password').textContent = 'Save Password'
        document.getElementById('password-current').value = '';
        document.getElementById('password').value = '';
        document.getElementById('password-confirm').value = '';
    });

if(bookDataForm)
    bookDataForm.addEventListener('submit', e => {
        e.preventDefault();
        const id = e.target.dataset.bookId;
        const name = document.getElementById('name').value;
        const author = document.getElementById('author').value;
        updateBook({name, author}, id);
    });