async function deleteExpense(id) {
    try {
        const res = await fetch('expenses', {
            method: 'DELETE',
            mode: 'cors',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ expId: id })
        })
        if (res.ok) {
            overlay.classList.add('hidden')
            deleteModal.classList.add('hidden')
            deleteModal.classList.remove('flex')
            deleteModal.removeAttribute('data-id')
            window.location.reload()
        }
    } catch (e) {
        console.log(e)
    }
}

const deleteBtn = document.getElementById('delete-continue-btn')
const deleteCancelBtn = document.getElementById('delete-cancel-btn')
const deleteModal = document.getElementById('delete-modal')
const overlay = document.getElementById('overlay')

deleteCancelBtn.addEventListener('click', function() {
    overlay.classList.add('hidden')
    deleteModal.classList.add('hidden')
    deleteModal.classList.remove('flex')
})

deleteBtn.addEventListener('click', async function() {
    await deleteExpense(deleteModal.dataset.id)
})

let btnId = null
let dropdownClicked = []
document.querySelectorAll('.expense-btn').forEach((btn, i) => {
    dropdownClicked.push(false)
    btn.addEventListener('click', function(e) {
        e.stopPropagation()
        btnId = this.id.split('-').at(-1)
        const dropdownMenu = document.getElementById(`expense-dropdown-menu-${btnId}`)
        dropdownMenu.classList.toggle('hidden')

        if (!dropdownClicked[i]) {
            const deleteBtn = dropdownMenu.querySelector('.delete-btn')

            deleteBtn.addEventListener('click', function(e) {
                e.stopImmediatePropagation()
                overlay.classList.remove('hidden')
                deleteModal.classList.remove('hidden')
                deleteModal.classList.add('flex')
                deleteModal.setAttribute('data-id', this.dataset.id)
            })

            dropdownClicked[i] = true
        }
    })
})

window.addEventListener('click', function(e) {
    this.document.querySelectorAll('.expense-dropdown').forEach((dropdown) => {
        if (!e.target.matches(`#${dropdown.previousElementSibling.id}`) && !dropdown.classList.contains('hidden')) {
            dropdown.classList.add('hidden')
        }
    })
})




