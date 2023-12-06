let localToken = localStorage.getItem('auth_token');
let token = JSON.parse(localToken);

let noReg = document.querySelector('.no-file');
let fileContainer = document.querySelector('.file');

let logForm = document.getElementById('uploadForm');

const loginForm = document.querySelector('#my-form-login');

let checkLogin = document.getElementById('my-form');

let btnLeaveToken = document.getElementById('btn-clear-token');

const errorLogin = document.querySelector('.error-login');

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData1 = new FormData(loginForm);
    const login = formData1.get('login-log');
    const password = formData1.get('password-log');

    let responseEmailLogin = await fetch(`http://localhost:8000/check/email/login`, {
        method: 'GET',
    });
    const contentEmailLogin = await responseEmailLogin.json();

    contentEmailLogin.map(async (a) => {
        console.log(contentEmailLogin);
        console.log(login, password);

        async function checkPassword(login, password) {
            let checkPassword;
            await fetch(`http://localhost:8000/login/checkpassword`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ login, password })
            })
            .then(response => response.json())
            .then(result => {
                console.log(checkPassword = result);
            })
            .catch(error => {
                console.error('Error:', error);
            });

            if (a.login === login && checkPassword) {
                let importToken = await fetch(`http://localhost:8000/users/${login}`, {
                    method: 'GET',
                });

                const contentImportToken = await importToken.json();

                contentImportToken.map(a => {
                    localStorage.setItem("auth_token", `"${a.token}"`);
                    console.log(localStorage.getItem('auth_token'));
                    window.location = window.location;
                });

            } else {
                errorLogin.innerHTML = '<p class="error-txt">Неверная почта или пароль</p>';
            }
        }

        checkPassword(login, password);
    });
});

document.getElementById('uploadForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const fileInput = document.getElementById('fileInput');
    const selectedFile = fileInput.files[0];

    if (!selectedFile) {
        alert('Выберите файл.');
        return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    console.log(selectedFile);

    fetch('http://localhost:8000/upload', { method: 'POST', body: formData })
        .then(response => response.text())
        .then((result) => {
            alert(result);
        })
        .catch((error) => {
            console.error('Error:', error);
        });

    let checkId = await fetch(`http://localhost:8000/Checkid/token/${token}`, {
        method: 'GET',
    });

    const contentId = await checkId.json();

    let us
erid;
    let filename = selectedFile.name;
    let filepath = `uploads/${filename}`;
    let file_format = selectedFile.type;

    console.log(user_id, file_name, file_path, file_format);

    contentId.map(async (a) => {
        user_id = a.id;

        await fetch('http://localhost:8000/loading/files', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id, file_name, file_path, file_format }),
        });
    });
});

console.log(localStorage.getItem('auth_token'));

btnLeaveToken.addEventListener('click', () => {
    localStorage.clear();
    window.location = window.location;
});

if (token == null) {
    noReg.style.display = 'flex';
    fileContainer.style.display = 'none';
    logForm.style.display = 'none';
} else {
    noReg.style.display = 'none';
    fileContainer.style.display = 'flex';
    LogForn.style.display = 'flex';
checkLogin.style.display = 'none';
loginform.style.display = 'none';

}
