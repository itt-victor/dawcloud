//////
const button = document.querySelector('#forgotten_password'),
	  closeBtn = document.querySelector('.x-button-6');

if (window.location.href.includes('forgot-password'))
	(document.querySelector('.recover_password_dialogue') as HTMLElement).style.display = 'block';


