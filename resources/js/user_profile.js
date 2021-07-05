
const picContainer = document.querySelector('.profile-img-container');
const changePicBtn = document.querySelector('.change-avatar');
const configurationContainer = document.querySelector('.configuration-container');
const projects = document.querySelector('.profile-projects');
const personalInfo = document.querySelector('.personal-info-container');
const configurationBtn = document.querySelector('.configuration');
const projectsBtn = document.querySelector('.my-projects');
const personalInfoBtn = document.querySelector('.personal-info');
//const dltAccountBtn = document.querySelector('.dlt-account');
let profileImage = document.querySelector('.profile-img');

const visible = element => element.style.display = 'initial';
const invisible = element => element.style.display = 'none';


picContainer.addEventListener('mouseenter', () => changePicBtn.style.visibility = 'visible');
picContainer.addEventListener('mouseleave', () => changePicBtn.style.visibility = 'hidden');

projectsBtn.addEventListener('click', () => {
    visible(projects); invisible(personalInfo); invisible(configurationContainer);
});
personalInfoBtn.addEventListener('click', () => {
    visible(personalInfo); invisible(projects); invisible(configurationContainer);
});
configurationBtn.addEventListener('click', () => {
    visible(configurationContainer); invisible(personalInfo); invisible(projects);
});


