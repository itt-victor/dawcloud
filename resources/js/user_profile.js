
const picContainer = document.querySelector('.profile-img-container');
const changePicBtn = document.querySelector('.change-avatar');
const imageInput = document.querySelector('#input_image');
const csrf_token = document.head.querySelector('[name="csrf-token"]').content;
let profileImage = document.querySelector('.profile-img');

picContainer.addEventListener('mouseenter', () => changePicBtn.style.visibility = 'visible');
picContainer.addEventListener('mouseleave', () => changePicBtn.style.visibility = 'hidden');

//cambiar profile pic
(function changeAvatar() {
    imageInput.addEventListener('change', e => {
        const image_blob = new Blob([e.target.files[0]], { type: 'image/*' });
        const objectURL = URL.createObjectURL(image_blob)
        profileImage.src = objectURL;

        let form = new FormData();
        form.append('image', e.target.files[0]);
        fetch('profile/change-image', {
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': csrf_token
            },
            type: 'multipart/form-data',
            body: form
        });
    });
})();
