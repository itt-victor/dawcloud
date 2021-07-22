
const picContainer = document.querySelector('.profile-img-container') as HTMLElement;
const changePicBtn = document.querySelector('.change-avatar') as HTMLElement;
const configurationContainer = document.querySelector('.configuration-container') as HTMLElement;
const projects = document.querySelector('.profile-projects') as HTMLElement;
const personalInfo = document.querySelector('.personal-info-container') as HTMLElement;
const configurationBtn = document.querySelector('.configuration') as HTMLElement;
const projectsBtn = document.querySelector('.my-projects') as HTMLElement;
const personalInfoBtn = document.querySelector('.personal-info') as HTMLElement;
const dltAccountBtn = document.querySelector('.dlt-account') as HTMLElement;
const deleteDialogue = document.querySelector('.delete-dialogue') as HTMLElement;
const cancelDelete = document.querySelector('.cancel-dlt') as HTMLElement;
let profileImage = document.querySelector('.profile-img') as HTMLElement;


const visible = (element: HTMLElement) => element.style.display = 'initial';
const invisible = (element: HTMLElement) => element.style.display = 'none';


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
dltAccountBtn.addEventListener('click', () => visible(deleteDialogue));
cancelDelete.addEventListener('click', () => invisible(deleteDialogue));
