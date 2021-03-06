'use strict';

window.addEventListener('load', () => {
   const fieldData = document.querySelectorAll('[data-number]'),
         options = document.querySelectorAll('input[name=options]'),
         saveBtn = document.querySelector('button[type=submit]'),
         resetBtn = document.querySelector('button[type=reset]');
   
   const monthlyPayment = document.querySelector('#monthly-payment'),
         requiredIncome = document.querySelector('#required-income'),
         overPayment = document.querySelector('#overpayment'),
         loanSum = document.querySelector('#loan-sum');
   
   let checkedInput;

   let changeDisplayNumber = (str) => {
      return (str.length) ? parseFloat(str.replace(/\s/g, '')).toLocaleString('fr') : ''; //???
   }
   
   let calculator = () => {
   /* Formulae 
      W - property value, A - initial payment, n - cretit term (months), I - interest rate;
    */
      let [W, A, n, I] = [...fieldData].map(el => parseFloat(el.value.replace( /\s/g, '')));
   
      let C = W - A;   // Loan sum
      let P = C * ((I / 1200) + ((I / 1200) / (Math.pow(1 + I/1200, n * 12) - 1)));   //Monthly payment
      let R = 5 * (P / 3); //Required income
      let L = P * n * 12 - W + A;   //Overpayment

      loanSum.innerHTML = (W && A) ? `${Math.round(C).toLocaleString('fr')} ₽` : '0 ₽';      
      overPayment.innerHTML  = (W && A && n && I) ? `${Math.round(L).toLocaleString('fr')} ₽` : '0 ₽';
      monthlyPayment.innerHTML = (W && A && n && I) ? `${Math.round(P).toLocaleString('fr')} ₽` : '0 ₽';
      requiredIncome.innerHTML = (W && A && n && I) ? `${Math.round(R).toLocaleString('fr')} ₽` : '0 ₽';  
   }

   let checkLocalStorage = () => {
      let savedData = localStorage.getItem('loanData');
      let savedDataObj;

      if(savedData || 0) {
         savedDataObj = JSON.parse(savedData);  

         for (const [key, value] of Object.entries(savedDataObj)) {
            if(typeof value !== 'boolean') {
               document.querySelector(`#${key}`).setAttribute('value', `${changeDisplayNumber(value)}`);
            }
            else {
               document.querySelector(`#${key}`).setAttribute('checked', `${value}`);
               document.querySelector(`#${key}`).parentNode.classList.add('active');
            }  
         }
      }

      calculator();
   }
   
   checkLocalStorage();

   saveBtn.addEventListener('click', () => {
      console.log('pressed Save');
      checkedInput = document.querySelectorAll('input[name=options]:checked')[0];
      
      let dataObj = {};

      fieldData.forEach(currentValue => {
         if(currentValue.value.length !== 0) {
            dataObj[currentValue.id] = currentValue.value;
         }
      });
      
      if (checkedInput !== undefined) {
         dataObj[checkedInput.id] = true;
      }     

      localStorage.setItem('loanData', JSON.stringify(dataObj));
   });

   resetBtn.addEventListener('click', () => {
      console.log('pressed Reset');
      checkedInput = document.querySelectorAll('input[name=options]:checked')[0];

      fieldData.forEach(field => {
         field.value = '';
      });
      
      if (checkedInput !== undefined) {
         checkedInput.parentNode.classList.remove('active');
         checkedInput.checked = false;
      }

      calculator();
   });

   options.forEach(option => {
      option.addEventListener('click', function() {
         if(fieldData[0].value.length) {
            let percentage = +fieldData[0].value.replace(/\s/g, '') * this.value / 100;
            fieldData[1].value = percentage.toLocaleString('fr');
         }

         calculator();
      })
   });

   fieldData.forEach((field, ind) => {
      field.addEventListener('change', function() {
         checkedInput = document.querySelectorAll('input[name=options]:checked')[0];

         if ([0, 1].includes(ind)) {
            this.value = changeDisplayNumber(this.value.replace(/[^\d*]/g, ''));
         } 
         else {
            this.value.replace('-', '');
         }
         
         if(([0, 1].includes(ind)) && checkedInput !== undefined) {
            if(ind === 0) {
               fieldData[1].value = (+fieldData[0].value.replace(/\s/g, '') * checkedInput.value / 100).toLocaleString('fr');
            }
            else {
               fieldData[0].value = (+fieldData[1].value.replace(/\s/g, '') * 100 / checkedInput.value).toLocaleString('fr');
            }
         }

         calculator();
      })
   });
})