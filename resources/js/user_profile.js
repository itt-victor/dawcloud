
const picContainer = document.querySelector('.profile-img-container');
const changePicBtn = document.querySelector('.change-avatar');
const projects = document.querySelector('.profile-projects');
const personalInfo = document.querySelector('.personal-info-container');
const deleteContainer = document.querySelector('.delete-account-container');
const projectsBtn = document.querySelector('.my-projects');
const personalInfoBtn = document.querySelector('.personal-info');
const dltAccountBtn = document.querySelector('.dlt-account');
let profileImage = document.querySelector('.profile-img');

const visible = element => element.style.display = 'initial';
const invisible = element => element.style.display = 'none';


picContainer.addEventListener('mouseenter', () => changePicBtn.style.visibility = 'visible');
picContainer.addEventListener('mouseleave', () => changePicBtn.style.visibility = 'hidden');

projectsBtn.addEventListener('click', () => {
    visible(projects); invisible(personalInfo); invisible(deleteContainer);
});
personalInfoBtn.addEventListener('click', () => {
    visible(personalInfo); invisible(projects); invisible(deleteContainer);
});
dltAccountBtn.addEventListener('click', () => {
    visible(deleteContainer); invisible(personalInfo); invisible(projects);
});


