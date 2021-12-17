'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');


//direct code likhna start karna is not a good convention
// so we have to start with the function 
const displayMovements=function(movements,sort=false)
{
  containerMovements.innerHTML="";

  const movs=sort ? movements.slice().sort((a,b)=> a-b) : movements;

  movs.forEach(function(mov,i){


    const type=mov > 0 ? 'deposit' : 'withdrawal'

    const html =`
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i+1} ${type}</div>
    <div class="movements__value">${mov}</div>
  </div>
  `;

  containerMovements.insertAdjacentHTML('afterbegin',html);

  });
};

//hame balance ko save bhi karna hai , taki aage bhi use kar sake 

const calcDisplayBalance= function(acc){
   acc.balance=acc.movements.reduce((acc,mov)=> acc +mov,0);
  // acc.balance=balance;
  labelBalance.textContent=`${acc.balance}💶`;
};


const calcDisplaySummary= function(acc)
{
  const income=acc.movements
  .filter(mov=> mov>0)
  .reduce((acc,mov)=> acc+mov,0);
  labelSumIn.textContent=`${income}💶`;

  const outcome=acc.movements
  .filter(mov=> mov<0)
  .reduce((acc,mov)=> acc+mov,0);
  labelSumOut.textContent=`${Math.abs(outcome)}💶`;

  const interest=acc.movements
  .filter(mov=> mov>0)
  .map(deposit=>(deposit*acc.interestRate)/100)
  .reduce((acc,int)=> acc+int,0);

  labelSumInterest.textContent=`${interest}💶`;





};



const createUsernames =function(accs)
{
  accs.forEach(function (acc){
    acc.username=acc.owner
    .toLowerCase()
    .split(' ')
    .map(name=> name[0])
    .join('');
  });

};


createUsernames(accounts);
//Event listener

const updateUI=function(acc)
{
   //Display movements 
   displayMovements(acc.movements);

   // Display balance 
calcDisplayBalance(acc);

   // display summer 

   calcDisplaySummary(acc);


}
let currentAccount;

btnLogin.addEventListener('click',function(e){
  e.preventDefault()

  // console.log("LOGIN");
  currentAccount=accounts.find(acc=> acc.username===inputLoginUsername.value);

  if(currentAccount?.pin=== Number(inputLoginPin.value)){

    labelWelcome.textContent=`Welcome back,${
      currentAccount.owner.split(' ')[0]
    }`;
    // console.log("jai maat di ");


    containerApp.style.opacity=100;
//clear input fields
inputLoginUsername.value=inputLoginPin.value='';

inputLoginPin.blur(); 

// hamne un teeno lines ke liye 
//update UI function bana diya 

   updateUI(currentAccount);
  }



   
});

btnTransfer.addEventListener('click',function(e){
  e.preventDefault();
  const amount=Number(inputTransferAmount.value);
  const receiverAcc=accounts.find(acc=> acc.username===inputTransferTo.value);
  console.log(amount,receiverAcc);

    inputTransferAmount.value=inputTransferTo.value="";

  if(
    amount>0 &&
    receiverAcc &&
    currentAccount.balance>=amount &&
    receiverAcc?.username!==currentAccount.username 

  ){

    // console.log("Transfer Valid ");

    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    updateUI(currentAccount);
  }
});
btnLoan.addEventListener('click',function(e){
  e.preventDefault();

  const amount=Number(inputLoanAmount.value);

  if(amount >0 && currentAccount.movements.some(mov=> mov>=amount*0.1))
  {
       currentAccount.movements.push(amount);


       updateUI(currentAccount);
  }

  inputLoanAmount.value="";
})

btnClose.addEventListener('click', function(e){
  e.preventDefault();
  // console.log("delete");

  if(
    inputCloseUsername.value===currentAccount.username &&
    Number(inputClosePin.value)===currentAccount.pin

  )
  {
    const index=accounts.findIndex(
      acc => acc.username===currentAccount.username);
      console.log(index);


      //delete account
      accounts.splice(index,1);

      //Hide UI 
      containerApp.style.opacity=0;

  }
  inputCloseUsername.value=inputClosePin.value='';

});

let sorted=false;
btnSort.addEventListener('click',function(e){
  e.preventDefault();
  displayMovements(currentAccount.movements,!sorted);
  sorted=!sorted;
})

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const euroTOUsd=1.1;

const movementsUSD=movements.map(function(mov){
  return mov*euroTOUsd;
});
console.log(movements);
console.log(movementsUSD);

const deposits=movements.filter(function(mov){
  return mov>0;
});
console.log(movements);
console.log(deposits);





/////////////////////////////////////////////////
let arr=['a','b','c','d','e'];
console.log(arr);
console.log(arr.slice(2));
console.log(arr); // yaniki yeh array mutate nahi kar raha
console.log(arr.slice(2));
console.log(arr.slice(2,4));
console.log(arr.slice(-2));
console.log(arr.slice(1,-2));


// console.log
console.log(arr.slice());// shadow copy in js 

console.log([...arr]);

//splice in js 
console.log("---------iske baad alag concept hai-------------- ");
console.log(arr.splice(2));
console.log(arr);


//reverse in js 

let a=[6,5,4,3,2,1];
console.log(a);
console.log(a.reverse());
let a1=['ritik'];
let total=a1.concat(a);
console.log(total);
console.log(total.reverse());
console.log(total.join('-'));

// Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners 
// about their dog's age, and stored the data into an array (one array for each). For 
// now, they are just interested in knowing whether a dog is an adult or a puppy.
// A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years 
// old.
// Your tasks:
// Create a function 'checkDogs', which accepts 2 arrays of dog's ages 
// ('dogsJulia' and 'dogsKate'), and does the following things:
// 1. Julia found out that the owners of the first and the last two dogs actually have 
// cats, not dogs! So create a shallow copy of Julia's array, and remove the cat 
// ages from that copied array (because it's a bad practice to mutate function 
// parameters)
// 2. Create an array with both Julia's (corrected) and Kate's data
// 3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 
// is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy 
// �
// ")
// 4. Run the function for both test datasets
// Test data:
// § Data 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
// § Data 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]
// Hints: Use tools from all lectures in this section so far �
// GOOD LUCK 

// const checkdogs=function(dogsJulia,dogsKate){
// const dogsJuliaCorrected=dogsJulia.slice();
// dogsJuliaCorrected.splice(0,1);
// dogsJuliaCorrected.splice(-2);
// const dogs=dogsJuliaCorrected.concat(dogsKate);
// console.log(dogs);
// dogs.forEach(function(dogs,i){
//   if(dogs>=3){
//     console.log(`Dog number ${i+1} is an adult, and is ${dogs} years old`);
//   }
//   else{
//     console.log(`Dog number is ${i+1} is still a puppy`);
//   }
// });

// };
// checkdogs([3,5,2,12,7],[4,1,15,8,3]);



console.log(movements);
console.log(movements.includes(-130));

// Let's go back to Julia and Kate's study about dogs. This time, they want to convert 
// dog ages to human ages and calculate the average age of the dogs in their study.
// Your tasks:
// Create a function 'calcAverageHumanAge', which accepts an arrays of dog's 
// ages ('ages'), and does the following things in order:
// 1. Calculate the dog age in human years using the following formula: if the dog is 
// <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old, 
// humanAge = 16 + dogAge * 4
// 2. Exclude all dogs that are less than 18 human years old (which is the same as 
// keeping dogs that are at least 18 years old)
// 3. Calculate the average human age of all adult dogs (you should already know 
// from other challenges how we calculate averages �)
// 4. Run the function for both test datasets
// Test data:
// § Data 1: [5, 2, 4, 1, 15, 8, 3]
// § Data 2: [16, 6, 10, 5, 6, 1, 4]
// GOOD LUCK �
// Coding Challenge #