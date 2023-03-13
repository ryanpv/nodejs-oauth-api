const URL_PARAMS = new URLSearchParams(window.location.search);
let ck = document.cookie

// Show an element
const show = (selector) => {
  const query = document.querySelectorAll(selector);
  for (var i = 0; i < query.length; i++)
  query[i].style.display = 'block'; 
};

// Hide an element
const hide = (selector) => {
  const query = document.querySelectorAll(selector);
  for (var i = 0; i < query.length; i++)
  query[i].style.display = 'none';  
};

if (ck.split("; ").includes("currentUserStatus=true")) {
  hide('.content.unauthorized');
  show('.content.authorized');
}

const btn = document.querySelector('.content.authorized')
// console.log('mainjs: ', btn.getAttribute('style'));



// const query = document.querySelectorAll('.content.unauthorized')
// for (var i = 0; x < query.length; i++)
// query[i].style.display = 'none';


// console.log(document.querySelectorAll('.content.unauthorized'));


// if(document.querySelector('#emailInputIndex').value !== null) {

//   console.log({
//     // 'email': event.emailName.value,
//     'email': document.querySelector('#emailInputIndex').value,
//     // 'password': event.passwordName.value,
//     'password': document.querySelector('#passwordInputIndex').value
//   });
// } else {
//   console.log('form incomplete');
// }
