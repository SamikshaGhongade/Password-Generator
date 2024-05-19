

const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");

// symbols
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/'; 


//initially
let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
//set strength color to gray
setIndicator("#ccc");


// set Password Length
function handleSlider(){

    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;

    //adding some more

    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"
}

function setIndicator(color){

    indicator.style.backgroundColor = color;

    //shadow
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndInteger(min, max){
  return  Math.floor(Math.random() * (max-min)) + min;
}

function generateRandomNumber(){
    return getRndInteger(0,9)
}

function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}

function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));
}

function generateSymbol(){

    const randNum = getRndInteger(0, symbols.length);

    return symbols.charAt(randNum);
}

function calcStrength(){

    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
      setIndicator("#0f0");
    } else if (
      (hasLower || hasUpper) &&
      (hasNum || hasSym) &&
      passwordLength >= 6
    ) {
      setIndicator("#ff0");
    } else {
      setIndicator("#f00");
    }
}

async function copyContent(){
try{
    await navigator.clipboard.writeText(passwordDisplay.value);

    copyMsg.innerText = "Copied";
}

catch(e) {
    copyMsg.innerText = "Failed";
}
  

//this is to add timer on copied

//to make copy wala span visible
copyMsg.classList.add("active");

setTimeout(  () => {
  copyMsg.classList.remove("active");
}, 2000);

}

//shuffle the password
function shufflePassword(array){

  //Fisher Yates Method
  for (let i = array.length - 1; i > 0; i--) {
    //random J, find out using random function
    const j = Math.floor(Math.random() * (i + 1));
    //swap number at i index and j index
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
let str = "";
array.forEach((el) => (str += el));
return str;

}


//slider
inputSlider.addEventListener('input' , (e) =>{
  passwordLength = e.target.value;
  handleSlider();
}
) 

function handleCheckBoxChange(){

  checkCount = 0;
  allCheckBox.forEach( (checkbox) =>{
    if(checkbox.checked)
            checkCount++;
  });

  //special case 
  if(passwordLength < checkCount){
    passwordLength = checkCount;
    handleSlider();
  }
}
//on CheckBox
allCheckBox.forEach( (checkbox) => {

  checkbox.addEventListener('change' , handleCheckBoxChange);
})

copyBtn.addEventListener('click' ,  () => {

  if(passwordDisplay.value){
    copyContent();
  }
});

generateBtn.addEventListener('click' , () =>
{

  //none of the checkboxes are selected

  if(checkCount <= 0){
    return;
  }

  if(passwordLength < checkCount){

    passwordLength = checkCount;
    handleSlider();
  }

  //lets start to find the new password
    console.log("Start to make the new password")
    //remove old password
    password = "";

    //put the stuff mentioned by checkboxes

    // if(uppercaseCheck.checked){

    //   password += generateUpperCase();
    // }

    // if(lowercaseCheckCheck.checked){

    //   password += generateLowerCase();
    // }

    // if(uppercaseCheck.checked){

    //   password += generateRandomNumber();
    // }

    // if(symbolsCheck.checked){

    //   password += generateSymbol();
    // }


    let funArr = [];

    if(uppercaseCheck.checked){
      funArr.push(generateUpperCase);
    }

    if(lowercaseCheck.checked){
      funArr.push(generateLowerCase);
    }

    if(numbersCheck.checked){
      funArr.push(generateRandomNumber);
    }

    if(symbolsCheck.checked){
      funArr.push(generateSymbol);
    }


    //compulsory addition
    for(let i=0; i<funArr.length; i++){
      password += funArr[i]();
    }

    console.log("Compulsory addition DONE");

    //remaining addition

    //whatever u can add

    for(let i=0; i<passwordLength-funArr.length; i++){

      let randIndex = getRndInteger(0, funArr.length);

      console.log("randIndex" + randIndex);
      password += funArr[randIndex]();

    }

    console.log("Remaining addition DONE");
    //shuffle the password
    password = shufflePassword(Array.from(password));

    //show in UI
    passwordDisplay.value = password;

    console.log("Shuffle password addition DONE")
    //calculate stregth
    calcStrength();

    

});



