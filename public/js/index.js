import '@babel/polyfill';
import {login, logout} from './login';

// DOM ELEMENTS
const loginForm = document.querySelector('.form--login');
const newsletterForm = document.querySelector('.form--newsletter');
const logOutBtn = document.querySelector('.nav__el--logout');

// VALUES


// DELEGATION

if(loginForm)
loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    console.log(email, password)
    login(email, password);
});

if(newsletterForm)
newsletterForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    console.log(email, name)
    // login(email, password);
});

if(logOutBtn) logOutBtn.addEventListener('click', logout);