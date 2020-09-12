const db = firebase.firestore()

var provider = new firebase.auth.GoogleAuthProvider();
var userLogin

db.collection('books').onSnapshot(snapshot=>{
    var content=''
    snapshot.forEach(book=>{
        content+='<tr>'
        content+='<th scope="row">'+book.id+ '</th>'
        content+='<td>'+ book.data().title +'</td>'
        if(book.data().author){
            content+='<td>'+book.data().author.name+ ' ' + book.data().author.lastname+ '</td>'
        }else{
            content+='<td></td>'
        }
        content+='<td>'+ book.data().year +'</td>'
        content+='<td><button onclick="deleteBook(\'' +book.id  +'\')">Delete</button></td>'
        content+='</tr>'
    })
    $('#database').empty()
    $('#database').html(content)
})

function deleteBook(id){
    db.collection('books').doc(id).delete()
}

function addBook(){
    db.collection('books').add({
        title:$('#book-title').val(),
        author:{
            name:$('#book-author-name').val(),
            lastname:$('#book-author-lastname').val()
        },
        year:$('#book-year').val(),
        user:{
            email:userLogin.email,
            name:userLogin.displayName
        }
    })
}

function login(){
    firebase.auth().signInWithRedirect(provider).then(result=> {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        // ...
      }).catch(error=> {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });    
}

//listener

firebase.auth().onAuthStateChanged(user=>{
    if(user){
        $('#div-login').show()
        $('#div-logout').hide()
        $('#div-loading').hide()
        console.log(user)
        userLogin=user
        $('#user-name').text(user.displayName)
    }else{
        $('#div-login').hide()
        $('#div-logout').show()
        $('#div-loading').hide()
    }
})

$( document ).ready( ()=>{
    console.log('readyyyy')
})

function logout(){
    firebase.auth().signOut().then(()=>{

    })
}