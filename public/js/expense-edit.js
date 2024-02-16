let amountInput = document.getElementById('amount')
let typingTimer
let doneTypingInterval = 2000
const formatter = Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
})

amountInput.addEventListener('keyup', () => {
    clearTimeout(typingTimer)
    if (amountInput.value) {
        typingTimer = setTimeout(doneTyping, doneTypingInterval)
    }
})

function doneTyping() {
    let val = amountInput.value
    if (val) {
        amountInput.value = !isNaN(val.replaceAll('$', '').replaceAll(',', '').trim()) ? formatter.format(val) : val
    }
}

document.getElementById('date').addEventListener('change', function() {
    if (!this.value) {
        this.valueAsDate = new Date()
    }
})

async function editExpense(e) {
    e.preventDefault()
    let controller = new AbortController()
    try {
        const res = await fetch(window.location.href, {
            signal: controller.signal,
            method: 'PATCH',
            mode: 'cors',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                category: document.getElementById('category').value,
                date: document.getElementById('date').value,
                amount: document.getElementById('amount').value,
                description: document.getElementById('description').value
            })
        })

        if (!res.ok) {
            controller.abort()
        }
    } catch (err) {
        console.log(err)
    }
}

document.getElementById('submit-btn').addEventListener('click', editExpense)