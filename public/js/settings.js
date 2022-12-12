async function saveSettings() {
    try {
        const res = await fetch('settings', {
            method: 'PUT',
            mode: 'cors',
            credentials: 'same-origin',
            redirect: 'follow',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: usernameInput.value,
                email: emailInput.value,
                password: passwordInput.value,
                confirmPassword: confirmPasswordInput.value
            })
        })

        if (res.status === 400) {
            const data = await res.json()
            const { username, email, password, errors } = data
    
            if (errors.length) {
                document.getElementById('username-error').textContent = errors.find(err => err['param'] === 'username')?.msg ?? ''
                document.getElementById('email-error').textContent = errors.find(err => err['param'] === 'email')?.msg ?? ''
                document.getElementById('password-error').textContent = errors.find(err => err['param'] === 'password')?.msg ?? ''
                document.getElementById('confirm-password-error').textContent = errors.some(err => err['param'] === 'password') ? '' : errors.find(err => err['param'] === 'confirmPassword')?.msg ?? ''
    
                usernameInput.value = username
                emailInput.value = errors.some(err => err['param'] === 'email') ? '' : email
                passwordInput.value = errors.some(err => err['param'] === 'password') ? '' : password
                confirmPasswordInput.value = ''
            }
        } else if (res.redirected) {
            window.location.replace(res.url)
        }
    } catch (e) {
        console.log(e)
    } 
}

const saveBtn = document.getElementById('save-btn')
const usernameInput = document.getElementById('username')
const emailInput = document.getElementById('email')
const passwordInput = document.getElementById('password')
const confirmPasswordInput = document.getElementById('confirmPassword')

document.addEventListener('keyup', function(e) {
    let target = e.target.tagName === 'INPUT'
    let hasValue = e.target.value.length > 0
    if (target && hasValue) {
        saveBtn.disabled = false
    } else if (target && !hasValue) {
        saveBtn.disabled = true
    }
})

passwordInput.addEventListener('keyup', function(e) {
    console.log(this.value.length)
    confirmPasswordInput.disabled = this.value.length <= 0
})

saveBtn.addEventListener('click', saveSettings)