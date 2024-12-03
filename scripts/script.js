document.querySelectorAll('input[name="unitSystem"]').forEach(radio => {
    radio.addEventListener('change', function () {
        const unitSystem = document.querySelector('input[name="unitSystem"]:checked').value;

        if (unitSystem === 'imperial') {
            document.querySelectorAll('.imperial').forEach(el => el.style.display = 'inline-block');
            document.querySelectorAll('.metric').forEach(el => el.style.display = 'none');
            document.getElementById('weightUnit').textContent = '(lbs)';
        } else {
            document.querySelectorAll('.imperial').forEach(el => el.style.display = 'none');
            document.querySelectorAll('.metric').forEach(el => el.style.display = 'inline-block');
            document.getElementById('weightUnit').textContent = '(kg)';
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const unitSystemRadios = document.querySelectorAll('input[name="unitSystem"]');
    unitSystemRadios.forEach(radio => radio.checked = false);
    document.getElementById('weightUnit').textContent = '';
});

document.querySelectorAll('input[name="gender"]').forEach(radio => {
    radio.addEventListener('change', function () {
        const gender = document.querySelector('input[name="gender"]:checked').value;

        if (gender === 'female') {
            document.getElementById('female-options').style.display = 'block';
        } else {
            document.getElementById('female-options').style.display = 'none';
        }
    });
});

document.getElementById('calculateBtn').addEventListener('click', function () {
    const errorContainer = document.getElementById('error');
    const resultContainer = document.getElementById('result');
    errorContainer.textContent = '';
    resultContainer.textContent = '';

    try {
        const age = parseInt(document.getElementById('age').value, 10);
        const gender = document.querySelector('input[name="gender"]:checked').value;
        const unitSystem = document.querySelector('input[name="unitSystem"]:checked').value;
        const weight = parseFloat(document.getElementById('weight').value);
        const activity = document.getElementById('activity').value;
        const pregnancy = document.getElementById('pregnancy') ? document.getElementById('pregnancy').value : 'not-pregnant';

        if (isNaN(age) || isNaN(weight) || age < 1 || age > 120) {
            errorContainer.innerHTML = '<b>Please enter a valid age (1-120 years).</b>';
            resetInputs();
            return;
        }

        if (unitSystem === 'imperial') {
            const weightInKg = weight / 2.20462;
            if (weightInKg < 3 || weightInKg > 300) {
                errorContainer.innerHTML = '<b>Please enter a valid weight (6.6-661.4 lbs).</b>';
                resetInputs();
                return;
            }
        } else {
            if (weight < 3 || weight > 300) {
                errorContainer.innerHTML = '<b>Please enter a valid weight (3-300 kg).</b>';
                resetInputs();
                return;
            }
        }

        let baseIntake;

        if (unitSystem === 'imperial') {
            baseIntake = weight * 0.67;
        } else {
            baseIntake = weight * 0.033814;
        }

        if (gender === 'female') {
            if (pregnancy === 'pregnant') {
                baseIntake += 20;
            }
        }

        if (activity === 'moderate') baseIntake *= 1.2;
        else if (activity === 'active') baseIntake *= 1.4;

        const waterInLiters = baseIntake * 0.0295735;
        const waterInMl = waterInLiters * 1000;

        const resultText = `You should\n drink about\n ${baseIntake.toFixed(2)} oz\n (${waterInLiters.toFixed(2)} liters / ${waterInMl.toFixed(0)} ml)\n of water\n per day.`;

        resultContainer.textContent = resultText;
        resetInputs();
    } catch (error) {
        console.error('Error during calculation:', error);
        errorContainer.innerHTML = '<b>An error occurred. Please try again.</b>';
        resetInputs();
    }
});

function resetInputs() {
    document.getElementById('age').value = '';
    document.getElementById('weight').value = '';
    document.querySelectorAll('input[name="gender"]').forEach(radio => radio.checked = false);
    document.querySelectorAll('input[name="unitSystem"]').forEach(radio => radio.checked = false);
    document.getElementById('activity').value = 'light';
    const pregnancySelect = document.getElementById('pregnancy');
    if (pregnancySelect) pregnancySelect.value = 'not-pregnant';
}

document.getElementById('reset-button').addEventListener('click', () => {
    location.reload();
});
