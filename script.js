let checkNumber = (number) => (/^-?\d+(\.\d+)?$/).test(number);
let isValid = (value) => checkNumber(value) && value > 0;
let inputELs = document.querySelectorAll("input")
const [resetBtn, total, tipTotal] = ["reset", "total", "tip_total"].map((id) => document.getElementById(id))

let data = {
    bill: 0,
    tips: 0,
    nop: 0,
    validateRule: {
        //maybe we have some loop here
        bill: (value) => isValid(value),
        tips: (value) => isValid(value),
        nop: (value) => isValid(value),
    },
    isReady: function () {
        this.isReadyReset()
        return isValid(this.bill) && isValid(this.tips) && isValid(this.nop)
    },
    isReadyReset: function () {
        resetBtn.toggleAttribute("empty", !(isValid(this.bill) || isValid(this.tips) || isValid(this.nop)))
    },
    caculateTip: function () {
        if (!this.isReady()) return 0.00;
        return (parseFloat(this.bill) * parseFloat(this.tips) / 100)
    },
    caculateResult: function () {
        if (!this.isReady()) return 0.00        
        return (parseFloat(this.bill) + this.caculateTip()) / parseFloat(this.nop)
    },
    resetAll: function () {
        this.bill = 0
        this.tips = 0
        this.nop = 0
        inputELs.forEach(input => input.value = '')
        tipOptionEls.forEach(option => option.removeAttribute("active"))

    }
}

let updatePrice = () => {
    total.textContent = `${data.caculateResult().toFixed(2)}$`
    tipTotal.textContent = `${data.caculateTip().toFixed(2)}$`
}

//hanlde tip click
let tipOptionEls = document.querySelectorAll('.option')
let hanleTipChosen = (e) => {
    if (e.target.hasAttribute("active")) {
        e.target.removeAttribute("active")
        updatePrice()
        return false
    }
    tipOptionEls.forEach(el => el.removeAttribute("active"))
    e.target.toggleAttribute('active')
    data.tips = e.target.getAttribute('value')
    updatePrice()
}
tipOptionEls.forEach(tipOptionEl => tipOptionEl.addEventListener('click', hanleTipChosen))
//end hanlde tip click


//hanlde user input
let validate = (name, value) => {
    if (!data.validateRule[name]) return false
    return data.validateRule[name](value)
}
let handleInput = (e) => {
    let inputEL = e.target
    let name = inputEL.getAttribute('name')
    let value = inputEL.value
    let errorEl = inputEL.closest("fieldset").querySelector(".error")
    if (!value) return false
    let isValid = validate(name, value)
    inputEL.toggleAttribute("error", !isValid)
    if (errorEl) errorEl.textContent = isValid ? "" : "Invalid value"
    data[name] = value
    updatePrice()
}
inputELs.forEach(inputEL => inputEL.addEventListener('change', handleInput))
//end handle user input

let handleReset = (e) => {
    data.resetAll()
    updatePrice()
}
resetBtn.addEventListener('click', handleReset)