const inputslider=document.querySelector("[data-lengthslider]");
const lengthDisplay=document.querySelector("[data-lengthnumber]");
const passwordDisplay=document.querySelector("[data-passwordDisplay]");
const copyBtn=document.querySelector("[data-copy]");
const copyMsg=document.querySelector("[data-copyMsg]");
const upperCaseCheck=document.querySelector("#uppercase");
const lowerCaseCheck=document.querySelector("#lowercase");
const numbersCheck=document.querySelector("#numbers");
const symbolsCheck=document.querySelector("#symbols");
const indicator=document.querySelector("[dataindicator]");
const generateBtn=document.querySelector(".generateButton");
const allCheckbox=document.querySelectorAll("input[type=checkbox]");
const symbols='~`!@#$%^&*()_-+={[}]|:;"<,>.?/';


let password="";
let passwordlength=10;
let checkcount=0;

handleSlider();
setindicator("#ccc");
//set pasword length
function handleSlider(){
    inputslider.value=passwordlength;
    lengthDisplay.innerText=passwordlength;
    const min=inputslider.min;
    const max=inputslider.max;
    inputslider.style.backgroundSize=((passwordlength-min)*100/(max-min))+"% 100%";   
}

function setindicator(color){
    indicator.style.backgroundColor=color;
    //shadow
    indicator.style.boxShadow= `0px 0px 12px 1px ${color}`;
}

function getRndInteger(min ,max){
      return Math.floor(Math.random()*(max-min))+min;
}
function generateRandomNumber(){
      return getRndInteger(0,9);
}
function generateLowercase(){
    return String.fromCharCode(getRndInteger(97,123));
}
function generateUppercase(){
    return String.fromCharCode(getRndInteger(65,91));
}
function generateSymbol(){
    const randNum=getRndInteger(0,symbols.length)
    return symbols.charAt(randNum);
}

function calcStrength(){
    let hasupper=false;
    let haslower=false;
    let hasnum=false;
    let hassym=false;
     if (upperCaseCheck.checked) hasupper=true;
     if (lowerCaseCheck.checked) haslower=true;
     if (numbersCheck.checked) hasnum=true;
     if (symbolsCheck.checked) hassym=true;
    
     if(hasupper && haslower &&(hassym||hasnum) &&passwordlength>=8)
     setindicator("#0f0");
     else if((haslower||hasupper)&&(hasnum||hassym)&&passwordlength>=6)
       setindicator("#ff0");
     else 
     setindicator("#f00");
}


async function copyContent(){
   try{
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText="copied";
   }
 catch(e){
    copyMsg.innerText="failed";
 }
 copyMsg.classList.add("active");
 setTimeout(
    ()=>{
        copyMsg.classList.remove("active");
    },2000);
}
  function shufflePassword(array)
  { //Fisher Yates Method 
     for(let i=array.length-1; i>0;i--){
       const j=Math.floor(Math.random() * (i+1));
       const temp=array[i];
       array[i]=array[j];
       array[j]=temp; 
     }  
     let str="";
     array.forEach((el)=>(str+=el));
     return str;
  }
  function handleCheckBoxChange(){
    checkcount=0;
    allCheckbox.forEach((checkbox)=>
      {if(checkbox.checked)
      checkcount++;
      });
      //Special Condition
      if(passwordlength<checkcount)
      passwordlength=checkcount;
      handleSlider();
  }
    
 allCheckbox.forEach( (checkbox)=>{
       checkbox.addEventListener('change',handleCheckBoxChange);
 })
inputslider.addEventListener( 'input', (e)=>{
     passwordlength=e.target.value;
     handleSlider();
})

copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value)  
    copyContent();
})   
 generateBtn.addEventListener('click', ()=>{
        if(checkcount<=0)
        return;
        if(passwordlength<checkcount)
        {passwordlength=checkcount;
            handleSlider();
        }
      //let's start journey to find password 
      //remove old password
      console.log("old password removal");
      password="";
      
      let funcArr=[];
     if(upperCaseCheck.checked)
     funcArr.push(generateUppercase);   
     if(lowerCaseCheck.checked)
     funcArr.push(generateLowercase); 
     if(symbolsCheck.checked)
     funcArr.push(generateSymbol); 
     if(numbersCheck.checked)
     funcArr.push(generateRandomNumber);
     console.log(" before cmp");
     //compulsory addition 
     for(let i=0;i<funcArr.length;i++)
     {password+= funcArr[i]();
     }
     console.log(" after cmp");
     //remaining addition 
     for(let i=0; i<passwordlength-funcArr.length; i++)
     { let rndindex=  getRndInteger(0 ,funcArr.length);
        console.log(rndindex);
          password+= funcArr[rndindex]();
          console.log("funcarr");
     }
     console.log("remaining addition");
     //shuffle the password 
     shufflePassword(Array.from(password));
     console.log("Shuffle Pass");
     //show in UI
     passwordDisplay.value=password;
     //calling Calculate strength function 
     console.log(" call str");
     calcStrength();
 })